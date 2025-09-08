// 创建 SVG 元素
export function createSVGElement(type) {
  return document.createElementNS("http://www.w3.org/2000/svg", type);
}

// 将 child 节点挂载到 parent 节点上面
export function mount(parent, child) {
  if (parent) {
    parent.appendChild(child);
  }
}

export function applyAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    // 这里需要把类似 strokeWidth 的属性转换成 stroke-width 的形式
    const kebabCaseKey = key.replace(/[A-Z]/g, d => `-${d.toLocaleLowerCase()}`);
    element.setAttribute(kebabCaseKey, value);
  }
}

export function applyTransform(element, transform) {
  let oldTransform = element.getAttribute("transform") || "";
  oldTransform = oldTransform.trim();
  element.setAttribute("transform", `${oldTransform} ${transform}`);
}

export function createDiv() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return div;
}

export function getAttributes(node, attributes) {
  return attributes.reduce((total, cur) => {
    total[cur] = node.getAttribute(cur);
    return total;
  }, {});
}
