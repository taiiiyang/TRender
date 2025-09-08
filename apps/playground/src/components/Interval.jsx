import { plot } from "@tinyvis/t-chart";
import { createDiv, mount } from "@tinyvis/t-utils";
import { useEffect } from "react";
import { sports } from "@/constants/data";

export default function Interval() {
  useEffect(() => {
    const chart = plot({
      type: "interval",
      data: sports,
      encodings: {
        x: "genre",
        y: "sold",
        fill: "genre",
      },
      guides: {
        color: { width: 80 },
      },
    });
    mount(createDiv(), chart);
  }, []);
  return <></>;
}
