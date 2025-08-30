import { bisect, ceil, firstOf, floor, group, identity, max, min, ticks, tickStep } from "../utils";

// 这里我们使用 linear scale 的 ticks 算法
// [3, 6, 7, 12, 13, 12, 13, 13, 16, 17, 18, 23, 33, 30] -> [0, 5, 10, 15, 20, 25, 30, 35]
// 需要先求得原始的，再将原始的进行对齐
// 先将原始的最大最小值进行对齐，再用对齐后的最大最小值求的对齐后的步长，再根据新的步长去计算区间，确保区间准确且已阅读
function bin(values, count = 10, accessor = identity) {
  const minValue = min(values, accessor);
  const maxValue = max(values, accessor);
  const step = tickStep(minValue, maxValue, count);

  const niceMin = floor(minValue, step);
  const niceMax = ceil(maxValue, step);
  const niceStep = tickStep(niceMin, niceMax, count);
  const threshold = ticks(niceMin, niceMax, count);

  return Array.from(new Set([floor(niceMin, niceStep), ...threshold, ceil(niceMax, niceStep)]));
}

export function createBinX({ count = 10, channel, aggregate = values => values.length }) {
  return ({ index, values }) => {
    // 这里取出 channel 和 x1 是为了避免影响内部的计算
    const { [channel]: C, x: X, x1, ...rest } = values;
    const keys = Object.keys(rest);

    const threshold = bin(X, count);
    const n = threshold.length;
    // 分组，通过 x 落在的区间位置，对 index 进行分组
    // 由于找的是区间，所以在二分查找完之后，要 -1 ，确保 x 为区间左边
    // 格式为 { 区间索引: [...原始数据索引] }
    const groups = group(index, i => bisect(threshold, X[i]) - 1);
    // 获得分组，长度为区间 - 1，因为区间长度为n，所以只有 n-1 个区间
    const I = Array.from({ length: n - 1 }).fill(0).map((_, i) => i);
    // 过滤出存在值的区间
    const filtered = I.filter(i => groups.has(i));
    return {
      index: filtered, // 新的区间，只返回有值的区间
      values: Object.fromEntries([
        ...keys.map(key => [
          key,
          I.map((i) => {
            // 这个区间内没有值的话，返回 undefined
            if (!groups.has(i))
              return undefined;
            // [values 对应通道下][该区间内的所有原始索引中的 第一个索引]   做为该通道在 这个区间下的新值
            return values[key][firstOf(groups.get(i))];
          }),
        ]),
        [
          channel,
          I.map((i) => {
            // 先使用计数做为聚合，聚合出每个区间内有多少个值
            // 由于需要自定义聚合，所以要把原始值给返回出去
            if (!groups.has(i))
              return 0;
            return aggregate(groups.get(i));
          }),
        ],
        ["x", threshold.slice(0, -1)],
        ["x1", threshold.slice(1)],
      ]),
    };
  };
}
