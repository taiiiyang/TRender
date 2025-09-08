export function equal([x0, y0], [x1, y1]) {
  return closeTo(x0, x1) && closeTo(y0, y1);
}

export function closeTo(x, y, tol = 1e-5) {
  return Math.abs(x - y) < tol;
}

export function dist([x0, y0], [x1 = 0, y1 = 0] = []) {
  // 通过勾股定理，求两点之间距离
  return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
}

export function sub([x1, y1], [x0, y0]) {
  // 求得相对于原点的坐标
  return [x1 - x0, y1 - y0];
}

// 数学问题
export function angleBetween(v0, v1) {
  // 求得两个角度之差
  const a0 = angle(v0);
  const a1 = angle(v1);
  if (a0 < a1)
    return a1 - a0;
  return Math.PI * 2 - (a0 - a1);
}

export function angle([x, y]) {
  // 返回从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)，也就是 Math.atan2(y,x)
  // 那在一个页面中，原点指的是什么？那就是左上角的顶点，它就是原点。原点到一个点(坐标)的线段逆时针旋转的弧度值就是Math.atan2()的返回值
  const theta = Math.atan2(y, x);
  return theta;
}

export function degree(radian) {
  return (radian * 180) / Math.PI;
}

export function unique(points, x = d => d[0], y = d => d[1]) {
  const overlap = (a, b) => closeTo(x(a), x(b)) && closeTo(y(a), y(b));
  return points.filter((d, index) => points.findIndex(p => overlap(d, p)) === index);
}
