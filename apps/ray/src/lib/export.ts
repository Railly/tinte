import { toBlob, toPng, toSvg } from "html-to-image";

export async function exportPng(
  node: HTMLElement,
  pixelRatio = 2,
): Promise<string> {
  await toPng(node, { pixelRatio, skipAutoScale: true });
  return toPng(node, { pixelRatio, skipAutoScale: true });
}

export async function exportSvg(node: HTMLElement): Promise<string> {
  await toSvg(node);
  return toSvg(node);
}

export async function copyToClipboard(
  node: HTMLElement,
  pixelRatio = 2,
): Promise<boolean> {
  try {
    await toBlob(node, { pixelRatio, skipAutoScale: true });
    const blob = await toBlob(node, { pixelRatio, skipAutoScale: true });
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

export function supportsClipboard(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "clipboard" in navigator &&
    "write" in navigator.clipboard
  );
}
