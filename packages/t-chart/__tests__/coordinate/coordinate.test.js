import { describe, expect, it } from "vitest";
import { createCoordinate } from "@/coordinate";

describe("coordinate", () => {
  it("createCoordinate(options) returns a identity function without transforms", () => {
    const c = createCoordinate({
      transforms: [],
    });

    expect(c(1)).toBe(1);
    expect(c(2)).toBe(2);
  });
});
