// D3 内部 ticks 算法
// 希望 step = (10 ^ n) * (1 | 2 | 5)
const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count);
  const power = Math.floor(Math.log10(step));
  const error = step / 10 ** power;
  const factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = 10 ** -power / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start)
      ++i1;
    if (i2 / inc > stop)
      --i2;
    inc = -inc;
  }
  else {
    inc = 10 ** power * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start)
      ++i1;
    if (i2 * inc > stop)
      --i2;
  }
  if (i2 < i1 && count >= 0.5 && count < 2)
    return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}

export default function ticks(start, stop, count) {
  stop = Number(stop);
  start = Number(start);
  count = Number(count);
  if (!(count > 0))
    return [];
  if (start === stop)
    return [start];
  const reverse = stop < start;
  const [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1))
    return [];
  const n = i2 - i1 + 1;
  const ticks = Array.from({ length: n });
  if (reverse) {
    if (inc < 0) {
      for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
    }
    else {
      for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
    }
  }
  else {
    if (inc < 0) {
      for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
    }
    else {
      for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
    }
  }
  return ticks;
}

export function tickIncrement(start, stop, count) {
  stop = Number(stop);
  start = Number(start);
  count = Number(count);
  return tickSpec(start, stop, count)[2];
}

export function tickStep(start, stop, count) {
  stop = Number(stop);
  start = Number(start);
  count = Number(count);
  const reverse = stop < start;
  const inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}
