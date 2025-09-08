import { applyTransform, createSVGElement, mount } from "@tinyvis/t-utils";

export default class Transform {
  constructor(context) {
    this.context = context;
  }

  transform(type, ...params) {
    const { context } = this;
    const { group } = context;
    applyTransform(group, `${type}(${params.join(", ")})`);
  }

  translate(tx, ty) {
    this.transform("translate", tx, ty);
  }

  rotate(theta) {
    this.transform("rotate", theta);
  }

  scale(sx, sy) {
    this.transform("scale", sx, sy);
  }

  restore() {
    const { context } = this;
    const { group } = context;
    const { parentNode } = group;
    context.group = parentNode;
  }

  save() {
    const { context } = this;
    const { group } = context;
    const newG = createSVGElement("g");
    mount(group, newG);
    context.group = newG;
  }
}
