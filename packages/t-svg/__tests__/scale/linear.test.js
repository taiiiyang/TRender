import { describe, expect, it } from "vitest";
import { createLinear } from "../../src/scale/linear";

describe("createLinear", () => {
  it("createLinear({ domain, range, interpolate }) returns expected linear scale.", () => {
    const linear = createLinear({ domain: [3, 20], range: [0, 100] });
    linear.nice(3);
    expect(linear.ticks(3)).toEqual([0, 5, 10, 15, 20]);
  });
});
