import { group } from "@tinyvis/t-utils";

export function createNormalizeY() {
  return ({ index, values }) => {
    const { x: X } = values;
    const series = X ? Array.from(group(index, i => X[i]).values()) : [index];

    // 重定义 y 通道值
    const newValues = Object.fromEntries(
      ["y", "y1"].filter(key => values[key]).map(key => [key, Array.from({ length: index.length })]),
    );

    for (const I of series) {
      const Y = I.flatMap(i => Object.keys(newValues).map(key => values[key][i]));
      const maxY = Math.max(...Y);

      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] / maxY;
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
