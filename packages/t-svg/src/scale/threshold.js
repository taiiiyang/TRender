/**
 * 阈值比例尺
 * 定义域为阈值，作为数据的分隔值，在相同分隔值内部的都会映射到相同的视觉属性值
 */

export function createThreshold({ domain, range }) {
  const n = Math.min(domain.length, range.length - 1);
  // 取较小值
  return (x) => {
    const index = domain.findIndex(d => x < d);
    // 超出的都显示最大
    return range[index === -1 ? n : index];
  };
}
