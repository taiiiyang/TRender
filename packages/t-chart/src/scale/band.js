/**
 * Band 比例尺主要用于将离散的序数属性映射为连续的数值属性，往往用于条形图中确定某个条的位置。
 */

import { createOrdinal } from "./ordinal";
import { band } from "./utils";

export function createBand(options) {
  const { bandRange, bandWidth, step } = band(options);
  const scale = createOrdinal({ ...options, range: bandRange });

  scale.bandWidth = () => bandWidth;
  scale.step = () => step;

  return scale;
}
