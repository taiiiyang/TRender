import { createContext } from "./context.js";
import Shape from "./shape.js";
import Transform from "./transform";

export class Renderer {
  constructor(width, height) {
    this.ctx = createContext(width, height);
    this.shape = new Shape(this.ctx);
    this.transform = new Transform(this.ctx);
  }

  line(options) {
    return this.shape.line(options);
  }

  circle(options) {
    return this.shape.circle(options);
  }

  text(options) {
    return this.shape.text(options);
  }

  rect(options) {
    return this.shape.rect(options);
  }

  path(options) {
    return this.shape.path(options);
  }

  ring(options) {
    return this.shape.ring(options); // 绘制圆
  }

  restore() {
    return this.transform.restore();
  }

  save() {
    return this.transform.save();
  }

  scale(...args) {
    return this.transform.scale(...args);
  }

  rotate(...args) {
    return this.transform.rotate(...args);
  }

  translate(...args) {
    return this.transform.translate(...args);
  }

  node() {
    return this.ctx.node;
  }

  group() {
    return this.ctx.group;
  }
}

export function createRenderer({ width, height } = { width: 600, height: 400 }) {
  return new Renderer(width, height);
}
