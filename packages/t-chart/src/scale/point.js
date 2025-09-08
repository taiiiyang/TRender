/**
 * padding 始终为 1 ，bandWidth 始终为 0 ；主要用于散点图
 */
import { createBand } from "./band";

export function createPoint({ domain, range }) {
  return createBand({ domain, range, padding: 1 });
}
