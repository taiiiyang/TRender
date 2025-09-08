import { group } from "@tinyvis/t-utils";

export function createSymmetryY() {
  return ({ values, index }) => {
    const { x: X } = values;
    // 对 index 进行分组，以 x 为 key，相同 x 的所有 index 为一组
    const series = X ? Array.from(group(index, i => X[i]).values()) : [index];

    const newValues = Object.fromEntries(
      ["y", "y1"].filter(key => values[key]).map(key => [key, Array.from({ length: index.length })]),
    );

    // 计算每个分组的平均值
    const M = Array.from({ length: series.length });

    for (const [category, I] of Object.entries(series)) {
      const Y = I.flatMap(i => Object.keys(newValues).map(key => values[key][i]));

      const minY = Math.min(...Y);
      const maxY = Math.max(...Y);
      M[category] = (minY + maxY) / 2;
    }

    const maxM = Math.max(...M);

    for (const [category, I] of Object.entries(series)) {
      const offset = maxM - M[category];

      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] + offset;
        }
      }
    }

    return {
      index,
      values: {
        ...values,
        ...newValues,
      },
    };
  };
}
