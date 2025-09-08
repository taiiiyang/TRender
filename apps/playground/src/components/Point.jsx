import {
  cartesian,
  createCoordinate,
  createLinear,
  point,
  transpose,
} from "@tinyvis/t-chart";
import { createRenderer } from "@tinyvis/t-render";
import { useEffect, useRef } from "react";

export default function Point() {
  const svgRef = useRef();

  useEffect(() => {
    const width = 8000;
    const height = 4000;

    const renderer = createRenderer({ width, height });

    // 希望绘制一个散点图来看下面数据的分布
    const data = [
      { height: 180, weight: 150 },
      { height: 163, weight: 94 },
      { height: 173, weight: 130 },
    ];

    // 将对应的值提取出来
    const H = data.map(d => d.height);
    const W = data.map(d => d.weight);
    const I = data.map((_, index) => index);
    const extent = d => [Math.min(...d), Math.max(...d)];

    // 将数据的 height 映射为点的 x 属性（这里注意 range 是 [0, 1]）
    const scaleX = createLinear({
      domain: extent(H),
      range: [0, 1],
    });

    // 将数据的 width 映射为点的 y 属性（这里注意 range 是 [0, 1]）
    const scaleY = createLinear({
      domain: extent(W),
      range: [0, 1],
    });

    // 创建一个坐标系
    const coordinate = createCoordinate({
      // 指定画布的起点和宽高
      x: 0,
      y: 0,
      width: 600,
      height: 400,
      // 一系列坐标系变换
      transforms: [transpose(), cartesian()],
    });

    // 使用比例尺映射数据
    const values = {
      x: H.map(scaleX),
      y: W.map(scaleY),
    };

    const scales = {
      x: scaleX,
      y: scaleY,
    };

    // 设置样式
    const styles = {
      fill: "red",
      stroke: "steelblue",
    };

    const channels = {
      stroke: ["#5B8FF9", "#5AD8A6", "#5D7092"],
      x: values.x,
      y: values.y,
      r: [20, 5, 30],
    };

    // 绘制点
    const p = point(renderer, I, scales, channels, styles, coordinate);

    const fragment = document.createDocumentFragment();
    p.forEach(node => fragment.appendChild(node));

    // 一次性添加所有节点
    svgRef.current?.appendChild(fragment);
  }, [svgRef]);

  return <svg ref={svgRef} width="600" height="600"></svg>;
}
