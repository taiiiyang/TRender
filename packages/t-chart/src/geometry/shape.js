import { dist, equal, sub } from "@tinyvis/t-utils";
import { area as pathArea, line as pathLine, sector as pathSector } from "./d";
import { contour, ring } from "./primitive";

export function circle(renderer, coordinate, { cx, cy, ...styles }) {
  const [x, y] = coordinate([cx, cy]);
  return renderer.circle({ cx: x, cy: y, ...styles });
}

export function text(renderer, coordinate, { x, y, rotate, text, ...styles }) {
  const [px, py] = coordinate([x, y]);
  renderer.save();
  renderer.translate(px, py);
  renderer.rotate(rotate);

  const textEle = renderer.text({ x: 0, y: 0, text, ...styles });
  renderer.restore();
  return textEle;
}

export function link(renderer, coordinate, { x1, y1, x2, y2, ...style }) {
  const [p0, p1] = [
    [x1, y1],
    [x2, y2],
  ].map(coordinate);

  return renderer.line({
    x1: p0[0],
    y1: p0[1],
    x2: p1[0],
    y2: p1[1],
    ...style,
  });
}

export function line(renderer, coordinate, { X, Y, I: I0, ...style }) {
  // 极坐标系下需要闭合，所以要把最后一个节点加上去
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0;
  const points = I.map(i => coordinate([X[i], Y[i]]));
  const path = pathLine(points);
  return renderer.path({ d: path, ...style });
}

export function area(renderer, coordinate, { X1, Y1, X2, Y2, I: I0, ...style }) {
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0;
  // 需要围成一个圈
  const points = [...I.map(i => [X1[i], Y1[i]]), ...I.map(i => [X2[i], Y2[i]]).reverse()].map(
    coordinate,
  );
  if (coordinate.isPolar()) {
    return contour(renderer, { points, ...style });
  }

  return renderer.path({ d: pathArea(points), ...style });
}

export function rect(renderer, coordinate, { x1, y1, x2, y2, ...styles }) {
  const v0 = [x1, y1];
  const v1 = [x2, y1];
  const v2 = [x2, y2];
  const v3 = [x1, y2];
  const vs = coordinate.isTranspose() ? [v3, v0, v1, v2] : [v0, v1, v2, v3];
  const ps = vs.map(coordinate);

  const [p0, p1, p2, p3] = ps;

  if (!coordinate.isPolar()) {
    const [width, height] = sub(p2, p0);
    const [x, y] = p0;
    return renderer.rect({ x, y, width, height, ...styles });
  }

  const center = coordinate.center;
  const [cx, cy] = center;

  if (!(equal(p0, p1) && equal(p2, p3))) {
    return renderer.path({ d: pathSector([center, ...ps]), ...styles });
  }

  // 绘制圆环
  const r2 = dist(center, p2); // 内半径
  const r1 = dist(center, p0); // 外半径

  return ring(renderer, { cx, cy, r1, r2, ...styles });
}

export function path(renderer, coordinate, attributes) {
  return renderer.path(attributes);
}
