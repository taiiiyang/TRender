import { interpolateColor, interpolateNumber } from "../scale";
import { defined, firstOf, group, lastOf, map } from "../utils";
import { categoricalColors, ordinalColors } from "./theme";

// 对 channels 中的 values ，作用 scales，返回 { key: scaledValues }
export function applyScales(channels, scales) {
  return map(channels, ({ values, name }) => {
    const scale = scales[scaleName(name)];
    return values.map(scale);
  });
}

export function inferScales(channels, options) {
  // 归一同 比例尺 下的通道
  const scaleChannels = group(channels.flatMap(Object.entries), ([name]) => scaleName(name));
  const scales = {};

  Object.entries(scaleChannels, ([scaleName, scaleChannels]) => {
    const channel = mergeChannels(scaleName, scaleChannels);
    const option = options[scaleName] ?? {};
    const type = inferScaleType(channel, option);
    return {
      ...option,
      ...inferScaleOption(type, channel, option),
      domain: inferScaleDomain(type, channel, option),
      range: inferScaleRange(type, channel, option),
      label: inferScaleLabel(type, channel, option), // label 会在 guide 创建时传入
      type,
    };
  });
  return scales;
}

function inferScaleLabel(_, { field }, { label }) {
  if (label)
    return label;
  return field;
}

// 根据用户类型补齐默认配置
function inferScaleOption(type, { name }, { interpolate, margin, padding }) {
  switch (type) {
    case "linear":
    case "log":
      return interpolate
        ? { interpolate }
        : { interpolate: ["color"].includes(name) ? interpolateColor : interpolateNumber };
    case "band":
      return {
        padding: padding ?? 0.1,
      };
    case "dot":
      return {
        margin: margin ?? 0.5, // 点比例尺需要有 0.5 宽度边距，避免太靠近
      };
    default:
      return {};
  }
}

// 根据 channels 中的 values ，推断比例尺定义域
function inferScaleDomain(type, { values }, { domain, ...options }) {
  if (domain)
    return domain;
  switch (type) {
    case "linear":
    case "log":
    case "quantize": // 量化
      return inferContinuousDomain(values, options);
    case "ordinal":
    case "dot":
    case "band":
      return inferCategoricalDomain(values, options);
    case "quantile":
      return inferOrderedDomain(values, options);
    case "time":
      return inferTimeDomain(values, options);
    default:
      return [];
  }
}

function inferScaleRange(type, { name }, { range }) {
  if (range)
    return range;
  switch (type) {
    case "linear":
    case "log":
    case "time":
    case "dot":
    case "band":
      return inferNormalizeDomain(name);
    case "ordinal":
      return categoricalColors;
    case "quantile":
    case "quantize":
    case "threshold":
      return ordinalColors;
    default:
      return [];
  }
}

function inferNormalizeDomain(name) {
  if (name === "y")
    return [1, 0];
    // 因为屏幕坐标系的原点在左上角，y 像素是“向下增大”。
    // 而图表语义希望“数据值越大越往上”。所以把 y 的标准化 range 设为 [1, 0]，
    // 让更大的数据值映射到更小的归一化值，最终乘以高度后出现在更靠上的像素位置。
  if (name === "color")
    return [firstOf(ordinalColors), lastOf(ordinalColors)];

  return [0, 1];
}

function mergeChannels(name, channels) {
  const values = [];
  let scale = null;
  let field = null; // 作用的字段
  for (const { values: v = [], scale: s, field: f } of channels) {
    values.push(...v);
    scale = scale ?? s;
    field = field ?? f;
  }
  return {
    values,
    scale,
    field,
    name,
  };
}

function scaleName(channelName) {
  if (channelName.startsWith("x"))
    return "x";
  if (channelName.startsWith("y"))
    return "y";
  if (isStyleChannel(channelName))
    return "color";
  return channelName;
}

function isStyleChannel(channelName) {
  return ["fill", "stroke"].includes(channelName);
}

function isPosition(name) {
  return ["x", "y"].includes(name);
}

function isOrdinalList(values) {
  return values.some(value => ["boolean", "string"].includes(typeof value));
}

function isTemporal(values) {
  return values.some(value => value instanceof Date);
}

function isUnique(values) {
  return Array.from(new Set(values)).length === 1;
}

function inferContinuousDomain(values, { zero = false } = {}) {
  const definedValues = values.filter(defined);
  if (definedValues.length === 0)
  // 如果没有可用的值，需要返回空
    return [];
  const max = Math.max(...definedValues);
  const min = Math.min(...definedValues);
  return [zero ? 0 : min, max];
}

function inferTimeDomain(values, options) {
  // 时间也是连续比例尺
  return inferContinuousDomain(values, options).map(d => new Date(d));
}

// 格式化分类定义域
function inferCategoricalDomain(values) {
  return Array.from(new Set(values.filter(defined)));
}

// 在原来连续的基础上进行排序
function inferOrderedDomain(values, options) {
  return inferContinuousDomain(values, options).sort();
}

function asOrdinalType(name) {
  return isPosition(name) ? "dot" : "ordinal";
}

// 通过通道值推理出比例尺类型
function inferScaleType({ scale, values, name }, { type, domain, range }) {
  if (type)
    return type;
  if (scale)
    return scale;

  if ((domain ?? range ?? []).length > 2)
    return asOrdinalType(name);
  if (domain) {
    if (isOrdinalList(domain)) {
      return asOrdinalType(name);
    }
    if (isTemporal(domain)) {
      return "time";
    }
    return "linear";
  }

  if (isOrdinalList(values)) {
    return asOrdinalType(name);
  }
  if (isTemporal(values)) {
    return "time";
  }
  if (isUnique(values)) {
    return "identity";
  }
  return "linear";
}
