import { compose } from "../utils";

export function createCoordinate({ transforms: coordinates = [], ...canvasOptions }) {
  const transforms = coordinates.flatMap(coordinate => coordinate(canvasOptions));
  const { x, y, width, height } = canvasOptions;
  const output = compose(...transforms);

  output.types = transforms.map(transform => transform.type());

  output.isPolar = () => output.types.includes("polar");

  // 判断是否转置
  // 只有是奇数个 'transpose' 的时候才是转置
  // 这里使用了异或：a ^ b， 只有当 a 和 b 值不相同的时候才为 true，否者为 false
  output.isTranspose = () => output.types.reduce((is, type) => is ^ (type === "transpose"), false);

  output.center = [x + width / 2, y + height / 2];

  return output;
}
