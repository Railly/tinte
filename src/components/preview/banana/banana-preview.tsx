"use client";

import { BananaChat } from "@/components/ui/banana-chat";
import { cn } from "@/lib";
import type { BananaTheme } from "@/lib/providers/banana";

interface BananaPreviewProps {
  theme: { light: BananaTheme; dark: BananaTheme };
  className?: string;
}

export function BananaPreview({ theme, className }: BananaPreviewProps) {
  return (
    <div className={cn("h-full", className)}>
      <BananaChat theme={theme} className="h-full" />
    </div>
  );
}
