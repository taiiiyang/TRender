// geometry 调用时，会去校验是否已经传入了对应的通道值
export function createGeometry(channels, render) {
  /**
   * @param {render} renderer 渲染引擎
   * @param {number []} I 索引数组
   * @param {[key:string] Scale} scales 每个通道用到的 scale
   * @param {[key:string]: number[]} values 每个通道需要渲染的值
   * @param {[key: string]: string} directStyles 图形的和通道无关的样式
   * @param {Coordinate} coordinate 使用的坐标系
   * @returns 渲染的 SVG 元素
   */
  const geometry = (renderer, I, scales, values, directStyles, coordinate) => {
    Object.entries(channels).forEach(([key, { optional, scale }]) => {
      if (optional)
        return;
      if (!values[key])
        throw new Error(`missing Channels: ${key}`);
      if (!scaleValidator(scale, scales, key))
        throw new Error(`${key} channels need a scale`);
    });

    return render(renderer, I, scales, values, directStyles, coordinate);
  };

  geometry.channels = () => channels;

  return geometry;
}

function scaleValidator(scale, scales, key) {
  switch (scale) {
    case "band":
      return scales[key] && scales[key].bandWidth;
    default:
      return true;
  }
}
