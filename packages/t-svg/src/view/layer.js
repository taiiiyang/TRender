export function computeLayerViews(box, node) {
  const { children = [] } = node;
  return Array.from({ length: children.length }).fill(0).map(() => ({ ...box }));
}
