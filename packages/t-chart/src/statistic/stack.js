import { group } from "@tinyvis/t-utils";

export function createStackY() {
  return ({ values, index }) => {
    const { x: X, y: Y } = values;
    const series = X ? Array.from(group(index, i => X[i]).values()) : [index];

    const newY = Array.from({ length: index.length });
    const newY1 = Array.from({ length: index.length });

    for (const I of series) {
      for (let i = 0, py = 0; i < I.length; py = newY[I[i]], i++) {
        const index = I[i];
        newY1[index] = py;
        newY[index] = py + Y[index];
      }
    }

    return {
      index,
      values: { ...values, y: newY, y1: newY1 },
    };
  };
}
