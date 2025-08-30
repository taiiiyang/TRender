/**
 * 量化比例尺：将定义域分为等比例的份数，份数为值域的长度，
 * [0, 100] 分为 5 份， [0, 25, 50, 75, 100]
 *
 * const scale = createQuantize({
 * domain: [0, 300577],
 * range: ["white", "pink", "red"],
 * })
 * 因为 range 有3个值，所以 domain 会被分成三等份，
 * 并且按照如下的规则映射
 * [0, 300577 / 3) -> "white"
 * [300577 / 3, 300577 * (2 / 3)) -> "pink"
 * [300577 * (2 / 3), 300577) -> "red
 * 统计值在每一份的数量
 */
import { createThreshold } from "./threshold";

export function createQuantize({ domain: [d0, d1], range, ...rest }) {
  const n = range.length - 1;
  const step = (d1 - d0) / (n + 1);
  const quantizeDomain = Array.from({ length: n }).fill(0).map((_, i) => step * (i + 1));
  return createThreshold({ domain: quantizeDomain, range, ...rest });
}
