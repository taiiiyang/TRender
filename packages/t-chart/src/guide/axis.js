import { identity, lastOf } from "@tinyvis/t-utils";

// 该函数会返回一个绘制坐标轴的函数，它根据当前的坐标系选择不同的刻度、标签和格子绘制函数，从而绘制整个坐标轴。
export function createAxis(components) {
  return (
    renderer,
    scale,
    coordinate,
    {
      tick = true,
      grid = false,
      domain,
      label,
      formatter = identity,
      tickCount = 5,
      tickLength = 5,
      fontSize,
    },
  ) => {
    // 如果是 band 比例尺的话，需要绘制在柱子的中间，所以需要往右移
    const isOrdinal = !!scale.bandWidth;
    const isQuantitative = !!scale.ticks;

    const offset = isOrdinal ? scale.bandWidth() / 2 : 0;
    const values = isQuantitative ? scale.ticks(tickCount) : domain;

    const center = coordinate.center;
    const type = `${+coordinate.isPolar()}${+coordinate.isTranspose()}`;

    const options = { tickLength, fontSize, center, isOrdinal };

    const { grid: Grid, label: Label, ticks: Ticks, start, end } = components[type];

    const ticks = values.map((d) => {
      const [x, y] = coordinate(start(d, scale, offset));
      const text = formatter(d);
      return { x, y, text };
    });

    const labelTick = (() => {
      if (!isOrdinal)
        return lastOf(ticks); // 连续性比例尺，直接取 ticks 的最后一个
      const value = lastOf(values); // 序数比例尺，需要取 domain 的最后一个
      const [x, y] = coordinate(start(value, scale, offset * 2)); // 找到开始值，在视觉属性上即最后一个
      // 因为是最后一个，所以需要加上一个柱子的偏移值
      return { x, y };
    })();

    if (grid && Grid)
      Grid(renderer, ticks, end(coordinate)); // 格子不需要 字体的 样式
    if (tick && Ticks)
      Ticks(renderer, ticks, options);
    if (label && Label)
      Label(renderer, label, labelTick, options);
  };
}
