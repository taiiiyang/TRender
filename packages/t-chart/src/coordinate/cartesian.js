import { curry } from "@tinyvis/t-utils";
import { scale, translate } from "./transform";

// 笛卡尔坐标系
function coordinate(transformOptions, canvasOptions) {
  // 需要注意传入的值都是 [0, 1]，所以才能正确映射到画布坐标
  const { x, y, width, height } = canvasOptions;

  // 坐标系变换需要先经过两步，第一步是 scale，第二步是 translate
  return [scale(width, height), translate(x, y)];
}

export const cartesian = curry(coordinate);
