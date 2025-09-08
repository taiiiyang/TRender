/**
 * 分位数比例尺：将数量分成 等频 的分组，分组数与值域相同，每组数量接近相同
 * 所以 domain 需要传入一个数据集
 */
// 首先把会 salary 按照升序排序 [0, ......, 300577]
// 因为一共有100条数据，所以
// 前33条数据会被映射为 "white"
// 排名33到67的数据会被映射为 "pink"
// 最后33条数据会映射为 "red
import { createThreshold } from "./threshold";

export function createQuantile({ domain, range, ...rest }) {
  const n = range.length - 1;
  const sortedDomain = domain.sort((a, b) => a - b);
  const step = (sortedDomain.length - 1) / (n + 1);
  // 求出定义域分隔的范围
  const quantileDomain = Array.from({ length: n }).fill(0).map((_, index) => {
    const i = (index + 1) * step;
    const i0 = Math.floor(i);
    const i1 = i0 + 1;
    // 求出当前值域点在定义域的交界位置
    const v0 = sortedDomain[i0];
    const v1 = sortedDomain[i1];
    // i * (v1 - v0) + i1 * v0 + v1 * i0
    return v0 * (i1 - i) + v1 * (i - i0);
  });
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
