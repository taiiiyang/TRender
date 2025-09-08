export function channelStyles(index, channel) {
  const { stroke: S, fill: F } = channel;
  return {
    ...(S ? { stroke: S[index] } : {}),
    ...(F ? { fill: F[index] } : {}),
  };
}

// 简配版，先只取第一个点的作为一整个的样式
export function groupChannelStyles([index], channels) {
  return channelStyles(index, channels);
}
