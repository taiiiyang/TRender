import { createCoordinate } from "../coordinate";
import { createRenderer } from "../renderer";
import { assignDefined, bfs, identity, map } from "../utils";
import { createViews } from "../view";
import { create } from "./create";
import { initialize } from "./geometry";
import { inferGuides } from "./guide";
import { applyScales, inferScales } from "./scale";

export function plot(root) {
  const { width = 600, height = 400, renderer: plugin } = root;
  const renderer = createRenderer(width, height, plugin);
  flow(root);
  const views = createViews(root);
  for (const [view, nodes] of views) {
    // view 下的所有 nodes，区域下有配置变换，在每个单独的视图节点下也有配置变换
    // dimensions 为当前区域下的样式配置，包括宽高padding
    const { transform = identity, ...dimensions } = view;
    const geometries = [];
    const guides = {};
    const scales = {};
    let coordinates = [];
    const chartNodes = nodes.filter(isChartNode);
    for (const options of chartNodes) {
      // 获得这个图表视图节点的属性
      const {
        scales: s = {},
        guides: g = {},
        coordinates: c = {},
        transforms = [],
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        ...geometry
      } = options;

      assignDefined(guides, g);
      assignDefined(scales, s);
      assignDefined(dimensions, { paddingBottom, paddingLeft, paddingTop, paddingRight });
      if (c)
        coordinates = c;
      // 整合几何图形
      geometries.push({ ...geometry, transforms: [transform, ...transforms] });
    }
    plotView({ renderer, coordinates, geometries, guides, scales, ...dimensions });
  }

  return renderer.node();
}

function plotView(
  { renderer, coordinates: coordinatesOptions, geometries: geometriesOptions, guides: guidesOptions, scales: scalesOptions, width, height, x, y, paddingLeft = 45, paddingBottom = 45, paddingTop = 65, paddingRight = 45 },
) {
  // x，y 为视图的原点，也就是左上角

  // 对每个几何元素配置调用 initialize，生成标准化的几何对象。
  const geometries = geometriesOptions.map(initialize);
  const channels = geometries.map(geometry => geometry.channels);

  const scalesDescriptor = inferScales(channels, scalesOptions);
  const guidesDescriptor = inferGuides(scalesDescriptor, { x, y, paddingLeft }, guidesOptions);

  // 生成比例尺
  const scales = map(scalesDescriptor, create);
  // 辅助元素
  const guides = map(guidesDescriptor, create);

  const transforms = inferCoordinates(coordinatesOptions).map(create);
  const coordinate = createCoordinate({
    x: x + paddingLeft,
    y: y + paddingTop,
    width: width - paddingLeft - paddingRight,
    height: height - paddingTop - paddingBottom,
    transforms,
  });

  Object.entries(guides).forEach(([key, guide]) => {
    // 获取对应所引出的 比例尺
    const scale = scales[key];
    // 由于柯里化，一些绘图方法已经内置了
    guide(renderer, scale, coordinate);
  });

  geometries.forEach(({ index, channels, styles, geometry }) => {
    const values = applyScales(channels, scales);
    geometry(renderer, index, scales, values, styles, coordinate);
  });
}

function isChartNode(node) {
  return !["layer", "col", "row"].includes(node.type);
}

// 流转父节点的配置到子节点
function flow(root) {
  bfs(root, ({ children, type, ...options }) => {
    if (isChartNode({ type }))
      return;
    if (!children || children.length === 0)
      return;

    const keyDescriptors = [
      "o:encodings",
      "o:scales",
      "o:guides",
      "o:styles",
      "a:coordinates",
      "a:transforms",
      "a:statistics",
      "a:data",
    ];

    const descriptors = keyDescriptors.map(descriptor => descriptor.split(":"));

    for (const child of children) {
      for (const [type, key] of descriptors) {
        if (type === "o") {
          child[key] = { ...options[key], ...child[key] };
        }
        else {
          child[key] = child[key] ?? options[key];
        }
      }
    }
  });
}

function inferCoordinates(coordinates) {
  return [...coordinates, { type: "cartesian" }];
}
