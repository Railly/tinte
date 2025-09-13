import { useQueryState } from "nuqs";
import { convertTheme, getPreviewableProvider } from "@/lib/providers";
import { convertTinteToVSCode } from "@/lib/providers/vscode";
import { cn } from "@/lib/utils";
import { useVSCodeOverrides } from "@/providers/vscode-overrides";
import type { TinteTheme } from "@/types/tinte";
import { Dock } from "./shared/dock";

interface UnifiedPreviewProps {
  theme: TinteTheme;
  className?: string;
}

export function UnifiedPreview({ theme, className }: UnifiedPreviewProps) {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const { overrides } = useVSCodeOverrides();
  const currentProvider = getPreviewableProvider(provider || "shadcn");

  if (!currentProvider) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No preview available for {provider}
      </div>
    );
  }

  // Use special conversion for VS Code with overrides
  let converted;
  if (currentProvider.metadata.id === "vscode") {
    converted = convertTinteToVSCode(theme, "Tinte Theme", overrides);
  } else {
    converted = convertTheme(currentProvider.metadata.id, theme);
  }
  
  if (!converted) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to convert theme for {currentProvider.metadata.name}
      </div>
    );
  }

  const PreviewComponent = currentProvider.preview.component;

  return (
    <div
      className={cn(
        "h-[calc(100dvh-var(--header-height)_-_2rem)] relative",
        className,
      )}
    >
      <PreviewComponent theme={converted} />

      <Dock
        theme={theme}
        providerId={currentProvider.metadata.id}
        providerName={currentProvider.metadata.name}
      />
    </div>
  );
}
