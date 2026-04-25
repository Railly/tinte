import sharp from "sharp";

export async function applyWatermark(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 900;
  const fontSize = Math.max(24, Math.round(width * 0.032));
  const padding = Math.max(28, Math.round(width * 0.035));
  const label = "Made with kit.tinte.dev";
  const textWidth = Math.round(label.length * fontSize * 0.56);
  const badgeWidth = textWidth + padding * 2;
  const badgeHeight = Math.round(fontSize * 2.4);
  const x = Math.max(0, width - badgeWidth - padding);
  const y = Math.max(0, height - badgeHeight - padding);
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${x}" y="${y}" width="${badgeWidth}" height="${badgeHeight}" rx="${Math.round(badgeHeight * 0.28)}" fill="rgba(12,12,11,0.62)"/>
      <text x="${x + padding}" y="${y + Math.round(badgeHeight * 0.62)}" fill="rgba(244,241,232,0.78)" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700">${label}</text>
    </svg>
  `;

  return image
    .composite([{ input: Buffer.from(svg), gravity: "southeast" }])
    .png()
    .toBuffer();
}
