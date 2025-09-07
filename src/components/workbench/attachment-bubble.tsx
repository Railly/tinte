import { FileCode, Globe, Image, Palette } from "lucide-react";
import { CSSIcon } from "@/components/shared/icons/css";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import type { Attachment } from "@/utils/seed-mapper";

const kindIcons = {
  url: Globe,
  json: FileCode,
  cssvars: CSSIcon,
  tailwind: TailwindIcon,
  palette: Palette,
  image: Image,
  prompt: FileCode,
};

interface AttachmentBubbleProps {
  att: Attachment;
}

export function AttachmentBubble({ att }: AttachmentBubbleProps) {
  const Icon = kindIcons[att.kind] || FileCode;

  switch (att.kind) {
    case "image":
      return (
        <div className="relative rounded-lg overflow-hidden border border-primary-foreground/20 bg-primary-foreground/10 shadow-sm">
          {att.imageData ? (
            <img
              src={att.imageData}
              alt="Uploaded image"
              className="w-full max-h-48 sm:max-h-64 object-cover"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-primary-foreground/60">
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-xs">Image not available</div>
                <div className="text-[10px] opacity-70">
                  (size limit exceeded)
                </div>
              </div>
            </div>
          )}
          {/* Badge overlay */}
          <div className="absolute bottom-2 left-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded border border-white/20">
              <Image className="h-3 w-3 text-white" />
              <span className="text-[10px] font-medium text-white uppercase">
                {att.imageData ? "Image" : "Image (large)"}
              </span>
            </div>
          </div>
        </div>
      );
    case "palette":
      return (
        <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-sm">
          <div className="flex flex-wrap gap-1 mb-3">
            {(att.colors ?? []).slice(0, 11).map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-primary-foreground/20 cursor-pointer hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => navigator.clipboard.writeText(color)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Palette className="h-3 w-3 text-primary-foreground/70" />
              <span className="text-[10px] font-medium text-primary-foreground/70 uppercase">
                Palette
              </span>
            </div>
            <div className="text-[9px] text-primary-foreground/50 font-mono">
              {(att.colors ?? []).length} colors
            </div>
          </div>
        </div>
      );
    case "url":
      return (
        <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-sm">
          <div className="text-xs text-primary-foreground/90 break-all leading-relaxed mb-2">
            {att.content}
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3 text-primary-foreground/70" />
            <span className="text-[10px] font-medium text-primary-foreground/70 uppercase">
              Website
            </span>
          </div>
        </div>
      );
    case "json":
    case "tailwind":
    case "cssvars":
      return (
        <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-sm">
          <div className="bg-black/20 rounded border border-primary-foreground/10 p-2 mb-3 overflow-x-auto">
            <pre className="text-[10px] text-primary-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
              {att.content?.substring(0, 200)}
              {att.content && att.content.length > 200 ? "..." : ""}
            </pre>
          </div>
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-primary-foreground/70" />
            <span className="text-[10px] font-medium text-primary-foreground/70 uppercase">
              {att.kind === "tailwind"
                ? "Tailwind"
                : att.kind === "json"
                  ? "JSON"
                  : "CSS Vars"}
            </span>
          </div>
        </div>
      );
    default:
      return (
        <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-sm">
          <div className="text-xs text-primary-foreground/90 whitespace-pre-wrap leading-relaxed mb-2">
            {att.content?.substring(0, 150)}
            {att.content && att.content.length > 150 ? "..." : ""}
          </div>
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-primary-foreground/70" />
            <span className="text-[10px] font-medium text-primary-foreground/70 uppercase">
              Text
            </span>
          </div>
        </div>
      );
  }
}
