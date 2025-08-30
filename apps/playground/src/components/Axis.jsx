import { axisX, cartesian, createLinear, transpose } from "@TRender/t-svg";
import { renderAxis } from "@/utils/test";

const domain = [0, 10];
const scale = createLinear({
  domain,
  range: [0, 1],
});

export default function Axis() {
  renderAxis({
    scale,
    domain,
    transforms: [transpose(), cartesian()],
    axis: axisX,
    label: "val",
    grid: true,
  });

  return <></>;
}
