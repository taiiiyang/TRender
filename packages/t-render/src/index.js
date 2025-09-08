import { createRenderer as createCanvasRenderer } from "@tinyvis/t-canvas";
import { createRenderer as createSvgRenderer } from "@tinyvis/t-svg";

export function createRenderer(options = { renderer: "svg" }) {
  const { renderer = "svg", ...otherOptions } = options;

  if (typeof renderer === "object") {
    return renderer;
  }

  switch (renderer) {
    case "svg":
      return createSvgRenderer(otherOptions);
    case "canvas":
      return createCanvasRenderer(otherOptions);
    default:
      throw new Error(`Invalid renderer: ${renderer}`);
  }
}
