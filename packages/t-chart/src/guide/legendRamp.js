import { identity } from "@tinyvis/t-utils";
import { createLinear } from "../scale";
import { ticksBottom } from "./ticks";
// 针对连续比例尺

export function legendRamp(
  renderer,
  scale, // 将 值 映射为 颜色
  coordinate,
  {
    x,
    y,
    width = 120,
    height = 10,
    domain,
    tickCount = 5,
    tickLength = height + 5,
    formatter = identity,
    fontSize = 10,
    label,
  },
) {
  renderer.save();
  renderer.translate(x, y); // 重置原点

  // 标签
  if (label) {
    renderer.text({
      text: label,
      x: 0,
      y: 0,
      fontSize,
      fontWeight: "bold",
      textAnchor: "start",
      dy: "1em",
    });
  }

  // 渐变线
  // 使用一堆竖着的线连在一起

  const value = createLinear({ domain: [0, width], range: domain });
  const legendY = label ? height * 2 : 0;
  for (let i = 0; i < width; i++) {
    renderer.line({ x1: i, x2: i, y1: legendY, y2: legendY + height, stroke: scale(value(i)) });
  }

  // ticks
  const linear = createLinear({ domain, range: [0, width] });
  const values = linear.ticks(tickCount);
  const ticks = values.map(value => ({
    x: value,
    y: legendY,
    text: formatter(value),
  }));

  ticksBottom(renderer, ticks, { fontSize, tickLength });

  renderer.restore();
}
