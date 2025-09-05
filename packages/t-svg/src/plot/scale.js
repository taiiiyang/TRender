import { interpolateColor, interpolateNumber } from "../scale";
import { defined, firstOf, group, lastOf, map } from "../utils";
import { categoricalColors, ordinalColors } from "./theme";

export function applyScales() {

}

export function inferScales() {

}

function scaleName(channelName) {
  if (channelName.startsWith("x"))
    return "x";
  if (channelName.startsWith("y"))
    return "y";
  if (isStyleChannel(channelName))
    return "color";
}

function isStyleChannel(channelName) {
  return ["fill", "stroke"].includes(channelName);
}

function isOrdinal(values) {
  return values.some(value => ["boolean", "string"].includes(typeof value));
}

function isTemporal(values) {
  return values.some(value => value instanceof Date);
}

function isUnique(values) {
  return Array.from(new Set(values)).length === 1;
}

// 去重
function inferDomainC(values) {
  return Array.from(new Set(values.filter(defined)));
}

function inferScaleType(values) {
  if (isUnique(values))
    return "band";
  if (isOrdinal(values))
    return "ordinal";
  if (isTemporal(values))
    return "time";
  return "linear";
}
