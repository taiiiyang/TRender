import { cartesian, createBand, interval, polar } from "@TRender/t-svg";
import { useEffect } from "react";
import { plot } from "@/utils/plot";

export default function DonutRing() {
  useEffect(() => {
    plot({
      geometry: interval,
      index: [0, 1, 2],
      styles: {
        stroke: "black",
      },
      scales: {
        x: createBand({ domain: [0], range: [0, 1], padding: 0 }),
      },
      channels: {
        fill: ["#5B8FF9", "#5AD8A6", "#5D7092"],
        x: [0, 0, 0],
        y: [0, 1 / 3, 2 / 3],
        y1: [1 / 3, 2 / 3, 1],
      },
      transforms: [
        polar({ startAngle: 0, endAngle: Math.PI * 2, innerRadius: 0.2, outerRadius: 1 }),
        cartesian(),
      ],
    });
  }, []);

  return <div></div>;
}
