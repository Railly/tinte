"use client";

import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { DesignSystemOutput } from "@tinte/providers";

interface TypographySectionProps {
  theme: DesignSystemOutput;
}

export function TypographySection({ theme }: TypographySectionProps) {
  const [actualFont, setActualFont] = useState<string>("Geist Sans");
  const fontCheckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFont = () => {
      if (fontCheckRef.current) {
        const computedFont = window.getComputedStyle(
          fontCheckRef.current,
        ).fontFamily;
        const fontName = computedFont.split(",")[0].replace(/["']/g, "").trim();
        setActualFont(fontName);
      }
    };

    updateFont();

    const observer = new MutationObserver(updateFont);

    if (fontCheckRef.current) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
        subtree: false,
      });
    }

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={fontCheckRef} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold">Headings</h3>
          <span className="text-xs text-muted-foreground">{actualFont}</span>
        </div>
        <div className="space-y-2">
          {theme.typography.heading.sizes.map((heading, i) => (
            <div key={i} className="space-y-1">
              <div
                className="font-semibold"
                style={{
                  fontSize: heading.size,
                }}
              >
                {heading.sample}
              </div>
              <p className="text-xs text-muted-foreground">{heading.usage}</p>
              {i < theme.typography.heading.sizes.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold">Body Text</h3>
        <div className="space-y-2">
          {theme.typography.body.variants.map((variant, i) => (
            <div key={i} className="space-y-1">
              <div style={{ fontSize: variant.size }}>{variant.sample}</div>
              <p className="text-xs text-muted-foreground">{variant.usage}</p>
              {i < theme.typography.body.variants.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
