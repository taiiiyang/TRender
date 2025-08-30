import { createAxis } from "./axis";
import { gridCircular, gridHorizontal, gridRay, gridVertical } from "./grid";
import { labelBottomRight, labelLeftDown } from "./label";
import { ticksBottom, ticksCircular, ticksLeft } from "./ticks";

const components = {
  "00": {
    start: (d, scale, offset) => [scale(d) + offset, 1],
    end: coordinate => coordinate([0, 0]),
    ticks: ticksBottom,
    grid: gridVertical,
    label: labelBottomRight,
  },
  "01": {
    start: (d, scale, offset) => [scale(d) + offset, 1], // y 轴取最外面
    end: coordinate => coordinate([0, 0]),
    ticks: ticksLeft,
    grid: gridHorizontal,
    label: labelLeftDown,
  },
  "10": {
    start: (d, scale, offset) => [scale(d) + offset, 0], // 单纯极坐标系下，要以最外面一圈为起始点，也就是 y = 0
    end: coordinate => coordinate.center,
    ticks: ticksCircular,
    grid: gridRay,
  },
  "11": {
    start: (d, scale, offset) => [scale(d) + offset, 1], // 极坐标转置后，开始点的 y 坐标为 1 ，也就是转一圈回到原点。计算从 start 到 end 的距离，也就是半径
    end: coordinate => coordinate.center,
    ticks: ticksLeft,
    grid: gridCircular,
  },
};

export const axisX = createAxis(components);
