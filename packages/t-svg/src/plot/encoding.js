import { compose, map } from "../utils";
import { categoricalColors } from "./theme";

// origin: encodings:
// {
// x: "genre",
// y: "sales",
// fill: "green"
// }

export const ENCODING_TYPES = {
  VALUE: "value",
  CONSTANTS: "constants",
  FIELD: "field",
  TRANSFORM: "transform",
};

const inferEncodingMap = {
  interval: compose(maybeZeroY1, maybeZeroX, maybeFill),
  line: compose(maybeGroup, maybeFill),
  area: compose(maybeGroup, maybeZeroY1, maybeIdentityX, maybeFill),
  link: compose(maybeIdentityX, maybeStroke),
  point: compose(maybeStroke, maybeZeroY),
  rect: compose(maybeZeroY, maybeZeroY1, maybeZeroX1, maybeFill),
  cell: compose(maybeFill),
};

export function inferEncodings(type, data, encodings) {
  const typedEncodings = map(encodings, (encodingValue, encodingName) => ({
    type: inferType(data, encodingValue, encodingName),
    value: encodingValue,
  }));

  return inferEncodingMap[type]?.(typedEncodings) ?? typedEncodings;
}

// 根据不同类型获取通道值
export function valueOf(data, { type, value }) {
  if (type === ENCODING_TYPES.TRANSFORM)
    return data.map(value);
  if (type === ENCODING_TYPES.VALUE) {
    return data.map(() => value);
  }
  return data.map(d => d[value]);
}

// 推断 encoding 类型
function inferType(data, encoding, name) {
  const encodingType = typeof encoding;
  switch (encodingType) {
    case "function":
      return ENCODING_TYPES.TRANSFORM;
    case "string":
    {
      if (data.length && data[0][encoding] !== "undefined")
        return ENCODING_TYPES.FIELD;
      if (isStyle(name))
        return ENCODING_TYPES.CONSTANTS;
      break;
    }
    default:
      return ENCODING_TYPES.VALUE;
  }
}

function isStyle(name) {
  return ["fill", "stroke"].includes(name);
}

function maybeFill({ fill = color(), ...rest }) {
  return { fill, ...rest };
}

function maybeZeroX({ x = zero(), ...rest }) {
  return { x, ...rest };
}

function maybeIdentityX({ x, x1 = x, ...rest }) {
  return { x, x1, ...rest };
}

function maybeZeroY({ y = zero(), ...rest }) {
  return { y, ...rest };
}

function maybeStroke({ stroke = color(), ...rest }) {
  return { stroke, ...rest };
}

function maybeZeroX1({ x1 = zero(), ...rest }) {
  return { x1, ...rest };
}

function maybeZeroY1({ y1 = zero(), ...rest }) {
  return { y1, ...rest };
}

function maybeGroup({ fill, stroke, z, ...rest }) {
  if (!z)
    z = maybeField(fill);
  if (!z)
    z = maybeField(stroke);

  const group = { fill, stroke, z, ...rest };
  if (group.fill === undefined)
    delete group.fill;
  if (group.stroke === undefined)
    delete group.stroke;
  if (group.z === undefined)
    delete group.z;
  return group;
}

function maybeField(encoding) {
  if (!encoding || encoding.type !== ENCODING_TYPES.FIELD)
    return undefined;
  return encoding;
}

function zero() {
  return { type: ENCODING_TYPES.VALUE, value: 0 };
}

function color() {
  return { type: ENCODING_TYPES.CONSTANTS, value: categoricalColors[0] };
}
