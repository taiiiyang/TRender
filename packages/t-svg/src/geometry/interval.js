import { createChannel, createChannels } from "./channel";
import { createGeometry } from "./geometry";
import { rect } from "./shape";
import { channelStyles } from "./style";

const channels = createChannels({
  x: createChannel({ name: "x", scale: "band", optional: false }),
  y1: createChannel({ name: "y1", optional: false }),
  z: createChannel({ name: "z", scale: "band" }),
});

// 可用来实现柱状图、玫瑰图
function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {
    x: 0,
    z: 0,
  };

  const { x, z } = scales;
  const { x: X, y: Y, y1: Y1, z: Z = [] } = values;
  const groupWidth = x.bandWidth(); // groupWidth 为每个分组的宽度
  const intervalWidth = z ? z.bandWidth() : 1; // intervalWidth 为柱状图的一个 x 内部，单独的分组所占宽度占单独一整个 x 的宽度的比值
  const width = groupWidth * intervalWidth; // 所以求每条最小的柱子，需要用这两个值相乘

  return Array.from(I, (i) => {
    const { z: dz, x: dx, ...restDefaults } = defaults;
    // 计算 x 起始偏移量，z 是相对于 一个 group 内部的偏移量
    const offset = (Z[i] ?? dz) * groupWidth;
    const startX = (X[i] ?? dx) + offset;

    return rect(renderer, coordinate, {
      ...restDefaults,
      ...directStyles,
      ...channelStyles(i, values),
      x1: startX,
      y1: Y[i],
      x2: startX + width,
      y2: Y1[i],
    });
  });
}

export const interval = createGeometry(channels, render);
