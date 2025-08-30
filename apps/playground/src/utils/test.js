import { createCoordinate, createRenderer } from "@TRender/t-svg";
import { createDiv, mount } from "@/utils/dom";

export function firstOf(svg, className) {
  const [node] = svg.getElementsByClassName(className);
  return node;
}

export function renderAxis({ scale, transforms, axis, ...options }) {
  const coordinate = createCoordinate({
    x: 30,
    y: 30,
    width: 540,
    height: 340,
    transforms,
  });
  const renderer = createRenderer(600, 400);
  mount(createDiv(), renderer.node());
  axis(renderer, scale, coordinate, options);
  return renderer.node();
}
