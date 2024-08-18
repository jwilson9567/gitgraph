const TEXT_COLOR = "#000000";
export function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
const clusterColors = {
  "7PK": "#1f77b4",
  CERT: "#ff7f0e",
  CISQ: "#2ca02c",
  "Comprehensive Categorization": "#d62728",
  ICS: "#9467bd",
  OWASP: "#8c564b",
  "SEI CERT": "#e377c2",
  SFP: "#bcbd22",
  "The CERT": "#17becf",
  Uncategorized: "#7f7f7f"
};
export function drawHover(context, data, settings) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const subLabelSize = size - 2;
  const label = data.label;
  const subLabel = data.tag !== "unknown" ? data.tag : "";
  const clusters = data.clusters;
  context.beginPath();
  context.fillStyle = "#fff";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = "#000";
  context.font = `${weight} ${size}px ${font}`;
  const labelWidth = context.measureText(label).width;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const subLabelWidth = subLabel ? context.measureText(subLabel).width : 0;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const clusterLabelWidth = clusters ? context.measureText(clusters).width : 0;
  const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth);
  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  const hLabel = Math.round(size / 2 + 4);
  const hSubLabel = subLabel ? Math.round(subLabelSize / 2 + 9) : 0;
  const hClusterLabel = Math.round(subLabelSize / 2 + 9);
  drawRoundRect(context, x, y - hSubLabel - 12, w, hClusterLabel + hLabel + hSubLabel + 12, 5);
  context.closePath();
  context.fill();
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
  context.fillStyle = TEXT_COLOR;
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(label, data.x + data.size + 3, data.y + size / 3);
  if (subLabel) {
    context.fillStyle = TEXT_COLOR;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    context.fillText(subLabel, data.x + data.size + 3, data.y - 2 * size / 3 - 2);
  }
  if (clusters) {
    const clusterNames = clusters.split(",");
    let offsetX = 0;
    for (let i = 0; i < clusterNames.length; i++) {
      const cluster = clusterNames[i];
      const clusterKey = cluster.trim();
      context.fillStyle = clusterKey in clusterColors ? clusterColors[clusterKey] : "#000000";
      context.font = `${weight} ${subLabelSize}px ${font}`;
      const clusterWidth = context.measureText(cluster).width;
      context.fillText(cluster, data.x + data.size + 3 + offsetX, data.y + size / 3 + 3 + subLabelSize);
      offsetX += clusterWidth;
      if (i < clusterNames.length - 1) {
        context.fillStyle = TEXT_COLOR;
        const commaWidth = context.measureText(",").width;
        context.fillText(",", data.x + data.size + 3 + offsetX, data.y + size / 3 + 3 + subLabelSize);
        offsetX += commaWidth;
      }
    }
  }
}
export function drawLabel(context, data, settings) {
  if (!data.label)
    return;
  const size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
  context.font = `${weight} ${size}px ${font}`;
  const width = context.measureText(data.label).width + 8;
  context.fillStyle = "#ffffffcc";
  context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 20);
  context.fillStyle = "#000";
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
