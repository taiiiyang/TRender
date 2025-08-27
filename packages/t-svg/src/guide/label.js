export function labelLeftUp(renderer, label, tick, { fontSize }) {
  const { x, y } = tick;
  renderer.text({
    x,
    y,
    text: `↑ ${label}`,
    fontSize,
    textAnchor: "end",
    dy: "-1em",
    class: "label ",
  });
}

export function labelLeftDown(renderer, label, tick, { fontSize }) {
  const { x, y } = tick;
  renderer.text({
    x,
    y,
    text: `↓ ${label}`,
    fontSize,
    textAnchor: "end",
    dy: "2em",
    class: "label",
  });
}

export function labelBottomRight(renderer, label, tick, { fontSize, tickLength }) {
  const { x, y } = tick;
  const y1 = y + tickLength;
  renderer.text({
    x,
    y: y1,
    text: `${label} →`,
    dy: "2em",
    textAnchor: "end",
    class: "label",
    fontSize,
  });
}

export function labelTopRight(renderer, label, tick, { fontSize, tickLength }) {
  const { x, y } = tick;
  const y1 = y - tickLength;
  renderer.text({
    x,
    y: y1,
    text: `${label} →`,
    dy: "-1.2em",
    textAnchor: "end",
    fontSize,
    class: "label",
  });
}
