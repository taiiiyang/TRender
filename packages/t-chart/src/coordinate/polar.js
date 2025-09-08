import { curry } from "@tinyvis/t-utils";
import { polar as polarT, reflectY, scale, translate } from "./transform";

/**
 * 开始的角度：startAngle 和结束的角度 endAngle。也可以指定内半径 innerRadius 和外半径 outerRadius （范围都是：[0, 1])。
 * @param {*} transformOptions
 * @param {*} canvasOptions
 * @returns transforms
 */
function coordinate(transformOptions, canvasOptions) {
  const { width, height } = canvasOptions;
  const { innerRadius, outerRadius, startAngle, endAngle } = transformOptions;

  // endAngle - startAngle 是角度范围， 1 - 0 = 1
  // outerRadius - innerRadius 是半径范围， 1 - 0.5 = 0.5
  // 保证最后经过 cartesian 变化之后是一个圆形
  // 需要根据画布宽高去调整
  // 假设画布宽800px，高400px，aspect=2。此时sx=1/2，sy=1。缩放后，X轴方向的单位长度变为原来的1/2，Y轴不变。
  // 这样，绘制圆形时，X和Y的单位长度相同，圆形不会被拉长。 宽度压缩到高度相同
  // 相反情况处理：如果画布是纵向长方形（高>宽），aspect<1。此时sy=aspect，sx=1。
  // 这样Y轴方向的单位长度会被压缩，保持与X轴一致，确保图形比例正确。 高度压缩到宽度相同
  const aspect = width / height;
  const sx = aspect > 1 ? 1 / aspect : 1;
  const sy = aspect > 1 ? 1 : aspect;

  return [
    // 以画布中心沿着 y 方向翻转
    translate(0, -0.5),
    reflectY(),
    translate(0, 0.5),

    // 调整角度和半径的范围
    // 相当于先削掉差的角度，后面再旋转
    scale(endAngle - startAngle, outerRadius - innerRadius),
    translate(startAngle, innerRadius),
    polarT(),

    // 改变大小内切画布
    scale(sx, sy),
    scale(0.5, 0.5),

    // 移动到画布中心
    translate(0.5, 0.5),
  ];
}

export const polar = curry(coordinate);
