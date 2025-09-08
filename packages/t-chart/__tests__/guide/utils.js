import { createRenderer } from "@tinyvis/t-render";
import { createDiv, mount } from "@tinyvis/t-utils";
import { expect } from "vitest";
import { createCoordinate } from "@/coordinate";

export function renderAxis({ scale, transforms, axis, ...options }) {
  const coordinate = createCoordinate({
    x: 30,
    y: 30,
    width: 540,
    height: 340,
    transforms,
  });
  const renderer = createRenderer();
  mount(createDiv(), renderer.node());
  axis(renderer, scale, coordinate, options);
  return renderer.node();
}

export function firstOf(svg, className) {
  const [node] = svg.getElementsByClassName(className);
  return {
    toBeNull() {
      expect(node).toBeUndefined();
    },
    toEqual({ textContent, ...attributes }) {
      const renderedAttributes = Object.keys(attributes).reduce((obj, key) => {
        obj[key] = node.getAttribute(key);
        return obj;
      }, {});
      expect(renderedAttributes).toEqual(attributes);
      if (textContent) {
        expect(textContent).toBe(node.textContent);
      }
    },
  };
}
