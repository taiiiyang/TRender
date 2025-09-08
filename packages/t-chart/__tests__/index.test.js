import { describe, it } from "vitest";

describe("test", () => {
  it("drawRedRect()", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 400);
    svg.setAttribute("height", 400);
    svg.setAttribute("viewBox", [0, 0, 400, 400]);
    document.body.appendChild(svg);
  });
});
