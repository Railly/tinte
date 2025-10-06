import { useQueryState } from "nuqs";
import { useMemo } from "react";
import {
  useVSCodeOverrides,
  useZedOverrides,
} from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { WorkbenchToolbar } from "@/components/workbench/workbench-toolbar";
import { convertTheme, getPreviewableProvider } from "@/lib/providers";
import { convertTinteToVSCode } from "@/lib/providers/vscode";
import { tinteToZed } from "@/lib/providers/zed";
import { cn } from "@/lib/utils";
import type { TinteTheme } from "@/types/tinte";

interface UnifiedPreviewProps {
  theme: TinteTheme;
  className?: string;
}

export function UnifiedPreview({ theme, className }: UnifiedPreviewProps) {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const vscodeOverrides = useVSCodeOverrides();
  const zedOverrides = useZedOverrides();
  const currentProvider = getPreviewableProvider(provider || "shadcn");

  // Use special conversion with overrides for VS Code and Zed
  const converted = useMemo(() => {
    if (!currentProvider) return null;
    if (currentProvider.metadata.id === "vscode") {
      return convertTinteToVSCode(
        theme,
        "Tinte Theme",
        vscodeOverrides.overrides,
      );
    } else if (currentProvider.metadata.id === "zed") {
      // Convert to Zed and apply overrides
      const baseTheme = tinteToZed(
        theme.light,
        theme.dark,
        theme.name || "Custom Theme",
        theme.author || "Tinte",
      );

      // Apply overrides to both light and dark themes
      const themesWithOverrides = baseTheme.themes.map((t) => {
        const mode = t.appearance;
        const modeOverrides = zedOverrides.allOverrides?.[mode] || {};

        // Apply syntax token overrides
        const syntaxWithOverrides: any = { ...t.style.syntax };
        Object.entries(modeOverrides).forEach(([key, value]) => {
          if (typeof value === "string") {
            // Check if it's a syntax token (exists in syntax object)
            if (key in syntaxWithOverrides) {
              syntaxWithOverrides[key] = {
                ...syntaxWithOverrides[key],
                color: value,
              };
            }
          }
        });

        // Apply UI color overrides (for non-syntax properties)
        const styleWithOverrides: any = { ...t.style };
        Object.entries(modeOverrides).forEach(([key, value]) => {
          if (typeof value === "string") {
            // Check if it's a UI property (not in syntax)
            if (key in styleWithOverrides && !(key in syntaxWithOverrides)) {
              styleWithOverrides[key] = value;
            }
          }
        });

        return {
          ...t,
          style: {
            ...styleWithOverrides,
            syntax: syntaxWithOverrides,
          },
        };
      });

      const result = {
        ...baseTheme,
        themes: themesWithOverrides,
      };

      // Debug: log the converted theme
      console.log("Zed conversion with overrides:", {
        overrides: zedOverrides.allOverrides,
        resultSyntax: result.themes[0]?.style?.syntax?.keyword,
      });

      return result;
    } else {
      return convertTheme(currentProvider.metadata.id, theme);
    }
  }, [
    currentProvider,
    theme,
    vscodeOverrides.overrides,
    zedOverrides.allOverrides,
  ]);

  if (!currentProvider || !converted) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {!currentProvider
          ? `No preview available for ${provider}`
          : `Failed to convert theme for ${currentProvider.metadata.name}`}
      </div>
    );
  }

  const PreviewComponent = currentProvider.preview.component;

  // Create a unique key based on overrides to force re-render
  const previewKey =
    currentProvider.metadata.id === "zed"
      ? `zed-${JSON.stringify(zedOverrides.allOverrides)}`
      : currentProvider.metadata.id === "vscode"
        ? `vscode-${JSON.stringify(vscodeOverrides.overrides)}`
        : currentProvider.metadata.id;

  return (
    <div
      className={cn("h-[calc(100dvh-var(--header-height)_-_5rem)]", className)}
    >
      <PreviewComponent key={previewKey} theme={converted} />
    </div>
  );
}
