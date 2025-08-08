import { channelStyles } from "./style";
import { createChannel, createChannels } from "./channel";
import { rect as shapeRect } from "./shape";
import { createGeometry } from "./geometry";

const channels = createChannels({
  x1: createChannel({ name: "x1", optional: false }),
  y1: createChannel({ name: "y1", optional: false }),
});

const render = (renderer, I, scales, values, directStyles, coordinate) => {
  const defaults = {};
  const { x: X, y: Y, x1: X1, y1: Y1 } = values;

  // 每个 i 都代表一个矩形
  return Array.from(I, (i) =>
    shapeRect(renderer, coordinate, {
      ...defaults,
      ...directStyles,
      ...channelStyles(i, values),
      x1: X[i],
      y1: Y[i],
      x2: X1[i],
      y2: Y1[i],
    }),
  );
};

export const rect = createGeometry(channels, render);
