import { compose } from "@tinyvis/t-utils";
import { describe, expect, it } from "vitest";
import { cartesian } from "@/coordinate/cartesian";

// 流程就是想通过 scale 将作用域 归一化，在后续通过基本变换映射到画布坐标
describe("coordinate", () => {
  it("cartesian", () => {
    const canvasOptions = {
      x: 0,
      y: 0,
      width: 600,
      height: 400,
    };

    // cartesian 不需要 transformOptions
    const transforms = cartesian()(canvasOptions);

    // 合成一个函数
    const map = compose(...transforms);

    expect(map([0, 0])).toEqual([0, 0]);
    expect(map([0.5, 0.5])).toEqual([300, 200]);
    expect(map([1, 1])).toEqual([600, 400]);
  });
});
