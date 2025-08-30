import { cartesian, createCoordinate, createRenderer } from "@TRender/t-svg";
import { createDiv, mount } from "./dom";

export function plot({
  index,
  width = 600,
  height = 400,
  scales,
  channels,
  styles,
  geometry,
  transforms = [cartesian()],
}) {
  const renderer = createRenderer(width, height);
  const coordinate = createCoordinate({
    width,
    height,
    x: 0,
    y: 0,
    transforms,
  });
  geometry(renderer, index, scales, channels, styles, coordinate);
  mount(createDiv(), renderer.node());
}
