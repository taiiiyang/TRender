export function createChannel({ name, optional = true, ...options }) {
  return { name, optional, ...options };
}

export function createChannels(options = {}) {
  return {
    x: createChannel({ name: "x", optional: false }),
    y: createChannel({ name: "y", optional: false }),
    stroke: createChannel({ name: "stroke" }),
    fill: createChannel({ name: "fill" }),
    ...options,
  };
}
