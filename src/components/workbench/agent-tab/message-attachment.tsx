"use client";

import { FileCode, Globe, Image as ImageIcon, Palette } from "lucide-react";
import { CSSIcon, TailwindIcon } from "@/components/shared/icons";

interface MessageAttachmentProps {
  file: any;
}

const kindIcons: Record<string, any> = {
  url: Globe,
  cssvars: CSSIcon,
  tailwind: TailwindIcon,
  palette: Palette,
};

export function MessageAttachment({ file }: MessageAttachmentProps) {
  const isImage =
    (file.type === "file" && file.mediaType?.startsWith("image/")) ||
    (file.type === "file" && file.url?.startsWith("data:image/")) ||
    file.imageData?.startsWith("data:image/");

  const imageUrl = file.url || file.imageData;
  const filename = file.filename || file.name || file.content || "Attachment";

  if (isImage && imageUrl) {
    return (
      <div className="inline-flex items-center gap-2 p-2 bg-muted/30 border border-border/40 rounded-md text-xs max-w-xs">
        <img
          src={imageUrl}
          alt={filename}
          className="w-8 h-8 rounded object-cover border border-border/20"
        />
        <div className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground truncate">
            {filename === imageUrl ? "Image" : filename}
          </span>
        </div>
      </div>
    );
  }

  const Icon = kindIcons[file.kind] || FileCode;

  return (
    <div className="inline-flex items-center gap-2 p-2 bg-muted/30 border border-border/40 rounded-md text-xs max-w-xs">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground truncate">{filename}</span>
    </div>
  );
}
