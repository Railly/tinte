"use client";

import { useEffect } from "react";
import { loadGoogleFont } from "@/utils/fonts";

interface FontPreviewProps {
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
}

export function FontPreview({ fonts }: FontPreviewProps) {
  useEffect(() => {
    if (fonts) {
      try {
        // Load fonts for preview
        loadGoogleFont(fonts.sans, ["400"]);
        loadGoogleFont(fonts.serif, ["400"]);
        loadGoogleFont(fonts.mono, ["400"]);
      } catch (error) {
        console.warn("Failed to load preview fonts:", error);
      }
    }
  }, [fonts]);

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">
        Typography
      </span>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Sans</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.sans}", sans-serif` }}
          >
            {fonts.sans}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Serif</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.serif}", serif` }}
          >
            {fonts.serif}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Mono</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.mono}", monospace` }}
          >
            {fonts.mono}
          </span>
        </div>
      </div>
    </div>
  );
}
