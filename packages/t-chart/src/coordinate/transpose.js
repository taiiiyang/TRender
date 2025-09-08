import { curry } from "@tinyvis/t-utils";
import { reflectX, translate, transpose as transposeT } from "./transform";

function coordinate(_transformOptions, _canvasOptions) {
  return [transposeT(), translate(-0.5, -0.5), reflectX(), translate(0.5, 0.5)];
}

export const transpose = curry(coordinate);
