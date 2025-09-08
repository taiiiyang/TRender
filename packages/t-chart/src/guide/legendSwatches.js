import { identity } from "@tinyvis/t-utils";

export function legendSwatches(
  renderer,
  scale,
  coordinate,
  {
    x,
    y,
    width = 64, // 两个色块之间的距离
    marginLeft = 12, // 色块和文字的距离
    swatchSize = 10,
    fontSize = 14,
    formatter = identity,
    domain,
    label,
  },
) {
  renderer.save();
  renderer.translate(x, y); // 重置原点

  if (label) {
    renderer.text({
      text: label,
      x: 0,
      y: 0,
      dy: "1em",
      fontWeight: "bold",
      fontSize,
      textAnchor: "start",
    });
  }

  const legendY = label ? swatchSize * 2 : 0;

  for (const [i, label] of Object.entries(domain)) {
    const color = scale(label);
    const legendX = width * i;
    renderer.rect({
      x: legendX,
      y: legendY,
      width: swatchSize,
      height: swatchSize,
      stroke: color,
      fill: color,
    });

    const textX = legendX + marginLeft + swatchSize;
    const textY = legendY + swatchSize;
    renderer.text({
      text: formatter(label),
      x: textX,
      y: textY,
      fontSize,
      fill: "currentColor",
    });
  }

  renderer.restore();
}
