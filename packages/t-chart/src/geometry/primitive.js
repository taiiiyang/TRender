import { area as pathArea, line as pathLine, ring as pathRing } from "./d";

// 绘制极坐标系 等高线
export function contour(renderer, { points, ...styles }) {
  const end = points.length;
  const mid = end / 2;
  // 绘出轮廓
  const contour = renderer.path({ d: pathArea(points), ...styles, stroke: "none" });
  // 外轮廓
  const outerStroke = renderer.path({ d: pathLine(points.slice(0, mid)), ...styles, fill: "none" });
  // 内轮廓
  const innerStroke = renderer.path({
    d: pathLine(points.slice(mid, end)),
    ...styles,
    fill: "none",
  });

  return [innerStroke, contour, outerStroke];
}

export function ring(renderer, { cx, cy, r1, r2, ...styles }) {
  const ring = renderer.path({
    d: pathRing([
      [cx, cy],
      [r1, r2],
    ]),
    ...styles,
    stroke: "none",
  });

  // 绘制两个圆来模拟边框
  const innerStroke = renderer.circle({ ...styles, fill: "none", cx, cy, r: r1 });
  const outerStroke = renderer.circle({ ...styles, fill: "none", cx, cy, r: r2 });

  return [innerStroke, ring, outerStroke];
}
