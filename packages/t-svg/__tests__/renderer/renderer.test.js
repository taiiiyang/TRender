import { describe, expect, it } from "vitest";
import { createRenderer } from "../../src/renderer";
import { createDiv, mount } from "../utils";

describe("createRenderer", () => {
  it("createContext(width, height) returns expected context.", () => {
    const renderer = createRenderer(600, 400);
    const node = renderer.node();
    const group = renderer.group();

    expect(node.tagName).toBe("SVG");
    expect(node.getAttribute("width")).toBe("600");
    expect(node.getAttribute("height")).toBe("400");
    expect(node.getAttribute("viewBox")).toBe("0 0 600 400");

    expect(group.tagName).toBe("G");
    expect(group.parentNode).toBe(node);

    mount(createDiv(), node);
  });
});
