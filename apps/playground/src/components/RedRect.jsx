import { useEffect, useRef } from "react";
import { drawRedRect } from "@/utils/drawRedRect.js";

function RedRect() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    const svg = svgRef.current;
    // 绘制红色矩形
    drawRedRect(svg);
  }, [svgRef]);

  return <svg ref={svgRef} width="400" height="300"></svg>;
}

export default RedRect;
