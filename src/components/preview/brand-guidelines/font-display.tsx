"use client";

import { useEffect, useRef, useState } from "react";

interface FontDisplayProps {
  sample: string;
}

export function FontDisplay({ sample }: FontDisplayProps) {
  const [actualFont, setActualFont] = useState<string>("Geist Sans");
  const fontCheckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFont = () => {
      // Get computed font from the ref element (which inherits from body)
      if (fontCheckRef.current) {
        const computedFont = window.getComputedStyle(
          fontCheckRef.current,
        ).fontFamily;
        // Extract first font name and clean it up
        const fontName = computedFont.split(",")[0].replace(/["']/g, "").trim();
        setActualFont(fontName);
      }
    };

    // Initial font detection
    updateFont();

    // Create observer to watch for font changes
    const observer = new MutationObserver(updateFont);

    if (fontCheckRef.current) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
        subtree: false,
      });
    }

    // Also update on body class/style changes (for theme switches)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={fontCheckRef}>
      <h3 className="font-medium mb-2 text-sm">{actualFont}</h3>
      <div className="space-y-2">
        <div className="text-2xl md:text-3xl leading-tight break-words font-semibold">
          {actualFont}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground whitespace-pre-line leading-relaxed overflow-hidden">
          {sample}
        </div>
      </div>
    </div>
  );
}
