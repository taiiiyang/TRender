// 值域和定义域都是序数，主要用于将序数属性映射为同为序数属性的视觉属性，比如颜色，形状等
import { equal } from "./utils";

export function createOrdinal({ domain, range }) {
  return (x) => {
    const index = domain.findIndex(d => equal(d, x));
    // 取模的目的是为了应对 domain.length > range.length 的情况
    return range[index % range.length];
  };
}
