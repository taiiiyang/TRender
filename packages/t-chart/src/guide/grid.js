import { dist } from "@tinyvis/t-utils";

export function gridVertical(renderer, ticks, end) {
  const [, y2] = end;
  ticks.forEach(({ x, y }) =>
    renderer.line({ x1: x, y1: y, x2: x, y2, stroke: "#eee", class: "grid" }),
  );
}

export function gridHorizontal(renderer, ticks, end) {
  const [x2] = end;
  ticks.forEach(({ x, y }) =>
    renderer.line({ x1: x, y1: y, x2, y2: y, stroke: "#eee", class: "grid" }),
  );
}

export function gridRay(renderer, ticks, end) {
  // end 为圆心
  const [x2, y2] = end;
  ticks.forEach(({ x, y }) =>
    renderer.line({ x1: x, y1: y, x2, y2, stroke: "#eee", class: "grid" }),
  );
}

export function gridCircular(renderer, ticks, end) {
  const [cx, cy] = end;
  ticks.forEach(({ x, y }) => {
    const r = dist(end, [x, y]);
    renderer.circle({ r, cx, cy, stroke: "#eee", class: "grid", fill: "none" });
  });
}
