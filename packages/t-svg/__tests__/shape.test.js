import { createRenderer } from "@";
import { createDiv, getAttributes, mount } from "@tinyvis/t-utils";
import { describe, expect, it } from "vitest";
import Shape from "@/shape";

describe("shapes", () => {
  it("shape(name, context, attributes) creates SVG elements width specified attributes and mounts it to group.", () => {
    const renderer = createRenderer();
    const context = { group: renderer.group() };
    const shape = new Shape(context);
    const s = shape.shape("circle", {
      cx: 100,
      cy: 100,
      r: 50,
      fill: "red",
      stroke: "yellow",
      strokeWidth: 10,
    });

    mount(createDiv(), renderer.node());

    expect(s.tagName).toBe("CIRCLE");
    expect(s.parentNode).toBe(renderer.group());
    expect(getAttributes(s, ["cx", "cy", "r", "fill", "stroke", "stroke-width"])).toEqual({
      "cx": "100",
      "cy": "100",
      "r": "50",
      "fill": "red",
      "stroke": "yellow",
      "stroke-width": "10",
    });
  });

  it("circle() creates circle element.", () => {
    const renderer = createRenderer();

    const circle = renderer.circle({
      cx: 100,
      cy: 100,
      r: 50,
      fill: "red",
      stroke: "yellow",
      strokeWidth: 10,
    });

    mount(createDiv(), renderer.node());
    expect(circle.tagName).toBe("CIRCLE");
  });

  it("rect() creates rect element and accepts negative width and height.", () => {
    const renderer = createRenderer();

    const rect = renderer.rect({
      x: 100,
      y: 100,
      width: -50,
      height: -50,
    });

    expect(getAttributes(rect, ["x", "y", "width", "height"])).toEqual({
      x: "50",
      y: "50",
      width: "50",
      height: "50",
    });
    mount(createDiv(), renderer.node());
    expect(rect.tagName).toBe("RECT");
  });

  it("line() creates line element.", () => {
    const renderer = createRenderer();
    const line = renderer.line({
      x1: 0,
      y1: 0,
      x2: 50,
      y2: 50,
      stroke: "black",
    });
    mount(createDiv(), renderer.node());
    expect(line.tagName).toBe("LINE");
  });

  it("text() creates text element and sets textContent.", () => {
    const renderer = createRenderer();
    const text = renderer.text({
      x: 100,
      y: 100,
      text: "hello world",
    });
    expect(text.tagName).toBe("TEXT");
    mount(createDiv(), renderer.node());
    expect(text.textContent).toBe("hello world");
  });

  it("path() creates path element and accepts array to specify path.", () => {
    const renderer = createRenderer();
    const d = [["M", 10, 10], ["L", 100, 100], ["L", 100, 10], ["Z"]];
    const path = renderer.path({
      d,
      stroke: "black",
      fill: "red",
    });
    expect(path.tagName).toBe("PATH");
    mount(createDiv(), renderer.node());
    expect(path.getAttribute("d")).toBe("M 10 10 L 100 100 L 100 10 Z");
  });

  // test('ring() creates three circle elements to simulate a ring.', () => {
  //   const renderer = createRenderer();
  //   const ring = renderer.ring({
  //     cx: 100,
  //     cy: 100,
  //     r1: 30,
  //     r2: 60,
  //     strokeWidth: 10,
  //     stroke: 'red',
  //     fill: 'blue',
  //   });
  //   const [c0, c1, c2] = ring;

  //   mount(createDiv(), renderer.node());
  //   expect(c0.tagName).toBe('circle');
  //   expect(getAttributes(c0, ['fill', 'stroke', 'stroke-width', 'r'])).toEqual({
  //     fill: 'transparent',
  //     stroke: 'red',
  //     'stroke-width': '10',
  //     r: '30',
  //   });

  //   expect(c1.tagName).toBe('circle');
  //   expect(getAttributes(c1, ['fill', 'stroke', 'stroke-width', 'r'])).toEqual({
  //     fill: 'transparent',
  //     stroke: 'blue',
  //     'stroke-width': '20',
  //     r: '45',
  //   });

  //   expect(c2.tagName).toBe('circle');
  //   expect(getAttributes(c2, ['fill', 'stroke', 'stroke-width', 'r'])).toEqual({
  //     fill: 'transparent',
  //     stroke: 'red',
  //     'stroke-width': '10',
  //     r: '60',
  //   });

  //   const [c3] = renderer.ring({
  //     cx: 200,
  //     cy: 200,
  //     r1: 30,
  //     r2: 60,
  //     strokeWidth: 10,
  //     fill: 'blue',
  //   });
  //   expect(getAttributes(c3, ['stroke'])).toEqual({
  //     stroke: 'blue',
  //   });
  // });
});
