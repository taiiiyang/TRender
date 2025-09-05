import { compose, indexOf } from "../utils";
import { create } from "./create";
import { ENCODING_TYPES, inferEncodings, valueOf } from "./encoding";

// 负责将原始几何配置（数据、通道、变换、统计、样式等）标准化为一个可直接用于绘图的几何对象。
// 整合出 channels ，encodings, styles, geometry, index
// type 为几何图形的 type
export function initialize({ data, type, encoding: E, transforms: transformsOptions, statistics: statisticsOptions, styles }) {
  // 处理 transforms，表示的是坐标系的变换
  const transforms = compose(...transformsOptions.map(create)); // 变换函数实际上是一堆坐标系转换
  const transformedData = transforms(data);
  const index = indexOf(transformedData);

  // 处理 encodings，补全编码信息
  const encodings = inferEncodings(type, transformedData, E);
  const constantStyles = {};
  const encodingValues = {};
  Object.entries(encodings).forEach(([encodingName, encodingValue]) => {
    if (encodingValue.type === ENCODING_TYPES.CONSTANTS) {
      constantStyles[encodingName] = encodingValue;
    }
    // 格式化后的 encoding 即为 channel 的前置
    encodingValues[encodingName] = valueOf(transformedData, encodingValue);
  });

  // 处理 statistics
  const statistics = compose(...statisticsOptions.map(create));
  const { index: I, value: transformedValues } = statistics({ index, values: encodingValues });

  // 处理 channels，根据编码信息重新整合 channels
  // geometry 中的 channels 目前只有属性，需要根据编码信息将编码值添加到 channels 中
  const geometry = create({ type });
  const channels = [];
  Object.entries(geometry.channels()).forEach(([channelName, channelInfo]) => {
    const values = transformedValues[channelName];
    const { optional } = channelInfo;
    if (values) {
      channels[channelName] = createChannel(channelInfo, values, encodings[channelName]);
    }
    else if (!optional) {
      throw new Error(`Channel ${channelName} is required`);
    }
  });

  return { index: I, styles: { ...styles, ...constantStyles }, channels, geometry };
}

function createChannel(channelInfo, values, encoding) {
  const { type, value } = encoding;
  return {
    ...channelInfo,
    ...(type === ENCODING_TYPES.FIELD ? { field: value } : {}),
    values,
  };
}
