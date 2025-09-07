import { plot } from "@TRender/t-svg";
import { useEffect } from "react";
import { sports } from "@/constants/data";
import { createDiv, mount } from "@/utils/dom";

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
