import { group } from "../utils";
import { createChannel, createChannels } from "./channel";
import { createGeometry } from "./geometry";
import { line as shapeLine } from "./shape";
import { groupChannelStyles } from "./style";

const channels = createChannels({
  z: createChannel({ name: "z" }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, z: Z } = values;
  const series = Z ? group(I, i => Z[i]).values() : [I];
  return Array.from(series, I =>
    shapeLine(renderer, coordinate, {
      ...defaults,
      ...directStyles,
      ...groupChannelStyles(I, values),
      X,
      Y,
      I,
      fill: "none",
    }));
}

export const line = createGeometry(channels, render);
