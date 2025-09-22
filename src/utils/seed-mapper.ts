import type { PastedItem } from "@/lib/input-detection";

export type Attachment = {
  id: string;
  kind: PastedItem["kind"];
  content?: string;
  colors?: string[];
  imageData?: string;
};

export type SeedPayload = {
  id: string;
  content: string;
  attachments: Attachment[];
  createdAt: number;
};

export function mapPastedToAttachments(
  items: PastedItem[],
  cap = 300_000,
): Attachment[] {
  return items.map(({ id, kind, content, colors, imageData }) => ({
    id,
    kind,
    content,
    colors,
    imageData: imageData && imageData.length > cap ? undefined : imageData,
  }));
}
