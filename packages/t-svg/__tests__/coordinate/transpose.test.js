import { describe, expect, it } from "vitest";
import { cartesian, createCoordinate, transpose } from "../../src/coordinate";

describe("transpose", () => {
  it("transpose()", () => {
    const c = createCoordinate({
      width: 200,
      height: 300,
      x: 0,
      y: 0,
      transforms: [transpose(), cartesian()],
    });

    expect(c([0.5, 1])).toEqual([0, 150]);
    expect(c([0.4, 1])).toEqual([0, 120]);
    expect(c.isPolar()).toBeFalsy();
    expect(c.isTranspose()).toBeTruthy();
  });
});
