import { applyAttributes, createSVGElement, mount } from "@tinyvis/t-utils";

export default class Shape {
  constructor(context) {
    this.context = context;
  }

  shape(type, attributes) {
    const node = createSVGElement(type);
    const { group } = this.context;
    applyAttributes(node, attributes);
    mount(group, node);
    return node;
  }

  line(attributes) {
    return this.shape("line", attributes);
  }

  rect(attributes) {
    let { x, y, width, height } = attributes;
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    return this.shape("rect", {
      ...attributes,
      width: Math.abs(width),
      height: Math.abs(height),
      x: width > 0 ? x : width + x,
      y: height > 0 ? y : height + y,
    });
  }

  circle(attributes) {
    return this.shape("circle", attributes);
  }

  // text 元素是将展示内容放在标签内部，而不是作为标签的属性
  text(attributes) {
    const { text, ...rest } = attributes;
    const textElement = this.shape("text", rest);
    textElement.textContent = text;
    return textElement;
  }

  // path 的属性 d （路径）是一个字符串，拼接起来比较麻烦，这里我们通过数组去生成
  // [
  //  ['M', 10, 10],
  //  ['L', 100, 100],
  //  ['L', 100, 10],
  //  ['Z'],
  // ];
  // 上面的二维数组会被转换成如下的字符串
  // 'M 10 10 L 100 100 L 100 10 Z'
  path(attributes) {
    const { d } = attributes;
    const path = Array.isArray(d) ? d.flat().join(" ") : d;
    return this.shape("path", { ...attributes, d: path });
  }

  ring(attributes) {
    // r1 是内圆的半径，r2 是外圆的半径 , strokeWidth 是圆环的边框，
    const { cx, cy, r1, r2, ...styles } = attributes;
    const { circle } = this;
    const { stroke, strokeWidth, fill } = styles;
    const defaultStrokeWidth = 1;
    const innerStroke = circle({
      fill: "transparent",
      stroke: stroke || fill,
      strokeWidth,
      cx,
      cy,
      r: r1,
    });
    const ring = circle({
      ...styles,
      // 这里计算实际圆环边框宽度时，需要减去内外两个圆环边框宽度，得到的才是中间圆环的边框宽度
      strokeWidth: r2 - r1 - (strokeWidth || defaultStrokeWidth),
      stroke: fill,
      fill: "transparent",
      cx,
      cy,
      r: (r1 + r2) / 2,
    });
    const outerStroke = circle({
      fill: "transparent",
      stroke: stroke || fill,
      strokeWidth,
      cx,
      cy,
      r: r2,
    });
    return [innerStroke, ring, outerStroke];
  }
}
