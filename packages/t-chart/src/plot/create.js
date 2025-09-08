import { curry } from "@tinyvis/t-utils";
import { cartesian, polar, transpose } from "../coordinate";
import {
  area,
  cell,
  interval,
  line,
  link,
  path,
  point,
  rect,
  text,
} from "../geometry";
import { axisX, axisY, legendRamp, legendSwatches } from "../guide";
import {
  createBand,
  createIdentity,
  createLinear,
  createLog,
  createOrdinal,
  createPoint,
  createQuantile,
  createQuantize,
  createThreshold,
  createTime,
} from "../scale";
import { createBinX, createNormalizeY, createStackY, createSymmetryY } from "../statistic";

// 封装 guide：将 guide 函数和 options 绑定，返回一个统一的 guide 实例，方便后续调用时只需传 renderer、scale、coordinate。
function createGuide(guide, options) {
  return (renderer, scale, coordinate) => guide(renderer, scale, coordinate, options);
}

// 内部自动调用 nice
function createScaleQ(creator, options) {
  const { nice = true, tickCount = 10 } = options;
  const scale = creator(options);
  if (nice && typeof scale.nice === "function") {
    scale.nice(tickCount);
  }
  return scale;
}

const guideProducer = curry(createGuide);
const scaleQProducer = curry(createScaleQ);

const producerMap = {
  // scales
  band: createBand,
  identity: scaleQProducer(createIdentity),
  linear: scaleQProducer(createLinear),
  log: scaleQProducer(createLog),
  time: createTime,
  ordinal: createOrdinal,
  dot: createPoint,
  quantile: createQuantile,
  quantize: createQuantize,
  threshold: createThreshold,

  // guides
  axisX: guideProducer(axisX),
  axisY: guideProducer(axisY),
  legendRamp: guideProducer(legendRamp),
  legendSwatches: guideProducer(legendSwatches),

  // statistics
  binX: createBinX,
  normalizeY: createNormalizeY,
  stackY: createStackY,
  symmetryY: createSymmetryY,

  // coordinates
  polar,
  transpose,
  cartesian,
};

const geometries = {
  area,
  cell,
  interval,
  line,
  link,
  path,
  point,
  rect,
  text,
};

export function create(options) {
  if (typeof options === "function") {
    return options;
  }

  const { type, ...rest } = options;

  if (Object.keys(geometries).includes(type)) {
    return geometries[type];
  }

  if (type === "facet") {
    // 手动创建一个 分面 的统计函数
    const facet = () => {};
    facet.channels = () => ({
      x: { name: "x", optional: true },
      y: { name: "y", optional: true },
    });
    return facet;
  }

  if (!producerMap[type]) {
    throw new Error(`Unknown node type: ${options.type}`);
  }

  return producerMap[type](rest);
}
