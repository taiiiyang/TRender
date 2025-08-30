// VRender 内部 ticks 算法
function generateTicks(start, stop, step, reverse) {
  const ticks = [];
  let ptr = start;
  while (ptr <= stop) {
    ticks.push(ptr);
    ptr += step;
  }
  if (reverse) {
    ticks.reverse();
  }

  return ticks;
}

/**
 * 根据start、stop、count进行分割，不要求count完全准确，但是保证均匀，输出为整数数组
 * @param start
 * @param stop
 * @param count
 * @param allowExcessive 如果为true，实际输出的tick数 >= count，否则实际输出的tick数 <= count
 * @returns ticks
 */
export function ticks(start, stop, count, allowExcessive) {
  let step;

  stop = Math.floor(+stop);
  start = Math.floor(+start);
  count = Math.floor(+count);
  if (!count) {
    return [];
  }
  if (start === stop) {
    return [start];
  }
  const reverse = stop < start;

  if (reverse) {
    const n = start;
    start = stop;
    stop = n;
  }

  let expectedCount = clamper(1, stop - start + 1)(count);
  step = Math.floor((stop - start + 1) / expectedCount);
  if (!allowExcessive) {
    while (
      Math.ceil((stop - start + 1) / step) > count // 估算实际的tick数量，根据数量调整step
      && expectedCount > 1
    ) {
      expectedCount -= 1;
      step = Math.floor((stop - start) / expectedCount);
    }
  }

  return generateTicks(start, stop, step, reverse);
}

/**
 * 给定step的ticks分割
 * @param start
 * @param stop
 * @param step
 * @returns ticks
 */
export function stepTicks(start, stop, step) {
  stop = Math.floor(+stop);
  start = Math.floor(+start);
  step = clamper(1, stop - start + 1)(Math.floor(+step));
  const reverse = stop < start;
  if (reverse) {
    const n = start;
    start = stop;
    stop = n;
  }
  return generateTicks(start, stop, step, reverse);
}

export function clamper(a, b) {
  let t;
  if (a > b) {
    t = a;
    a = b;
    b = t;
  }
  return (x) => {
    return Math.max(a, Math.min(b, x));
  };
}
