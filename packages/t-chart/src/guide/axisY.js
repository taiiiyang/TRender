import { createAxis } from "./axis";
import { gridCircular, gridHorizontal, gridRay, gridVertical } from "./grid";
import { labelLeftUp, labelTopRight } from "./label";
import { ticksCircular, ticksLeft, ticksTop } from "./ticks";

const components = {
  "00": {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: coordinate => coordinate([1, 0]),
    ticks: ticksLeft,
    grid: gridHorizontal,
    label: labelLeftUp,
  },
  "01": {
    start: (d, scale, offset) => [0, scale(d) + offset], // x 轴取最里面
    end: coordinate => coordinate([1, 0]),
    ticks: ticksTop,
    grid: gridVertical,
    label: labelTopRight,
  },
  "10": {
    start: (d, scale, offset) => [0, scale(d) + offset], // 跟 X 轴 相反
    end: coordinate => coordinate.center,
    ticks: ticksLeft,
    grid: gridCircular,
  },
  "11": {
    start: (d, scale, offset) => [0, scale(d) + offset], // 跟 X 轴 相反
    end: coordinate => coordinate.center,
    ticks: ticksCircular,
    grid: gridRay,
  },
};

export const axisY = createAxis(components);
