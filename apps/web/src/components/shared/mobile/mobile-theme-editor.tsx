"use client";

import { motion, stagger, useAnimate } from "motion/react";
import * as React from "react";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShadcnOverrides } from "@/components/workbench/overrides-tab/hooks/use-provider-overrides";
import { useActiveTheme, useThemeTokens } from "@/stores/hooks";

declare global {
  interface Window {
    __TINTE_THEME__?: {
      theme: any;
      mode: string;
      tokens: Record<string, string>;
    };
  }
}

export function MobileThemeEditor() {
  const [scope, animate] = useAnimate();
  const { mounted } = useActiveTheme();
  const { currentTokens } = useThemeTokens();
  const shadcnOverrides = useShadcnOverrides();

  const handleTokenEdit = React.useCallback(
    (key: string, value: string) => {
      shadcnOverrides.setOverride(key, value);
    },
    [shadcnOverrides],
  );

  // List of known color tokens from shadcn.ts
  const colorTokenKeys = React.useMemo(
    () => [
      "accent",
      "accent-foreground",
      "background",
      "border",
      "card",
      "card-foreground",
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
      "destructive",
      "destructive-foreground",
      "foreground",
      "input",
      "muted",
      "muted-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "ring",
      "secondary",
      "secondary-foreground",
      "sidebar",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-ring",
    ],
    [],
  );

  // Filter only known color tokens
  const colorTokens = React.useMemo(() => {
    return Object.entries(currentTokens).filter(([key, value]) => {
      return (
        colorTokenKeys.includes(key) &&
        typeof value === "string" &&
        value.startsWith("#")
      );
    });
  }, [currentTokens, colorTokenKeys]);

  const tokenEntries = colorTokens;

  // Check if we have immediate data available
  const hasImmediateData =
    typeof window !== "undefined" && window.__TINTE_THEME__ && mounted;

  React.useEffect(() => {
    if (tokenEntries.length > 0) {
      animate(
        ".token-item",
        { opacity: [0, 1], y: [8, 0] },
        {
          duration: 0.3,
          delay: stagger(0.05, { startDelay: 0.1 }),
        },
      );
    }
  }, [animate, tokenEntries.length]);

  return (
    <ScrollArea className="h-[70vh]">
      <div className="flex-1 min-h-0" ref={scope}>
        <div className="p-4 space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-4">
            Color Tokens
          </div>
          <div className="space-y-3">
            {tokenEntries.length === 0 && !hasImmediateData ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="h-3 bg-muted/50 rounded w-20"></div>
                    <div className="h-10 bg-muted/30 rounded"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              tokenEntries.map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="token-item space-y-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05 + 0.1,
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground">
                    {key}
                  </div>
                  <ColorPickerInput
                    color={value}
                    onChange={(newValue) => handleTokenEdit(key, newValue)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
