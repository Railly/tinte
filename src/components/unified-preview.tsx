import { TinteTheme } from "@/types/tinte";
import { getPreviewableProvider, convertTheme } from "@/lib/providers";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Dock } from "./shared/dock";

interface UnifiedPreviewProps {
  theme: TinteTheme;
  className?: string;
}

export function UnifiedPreview({ theme, className }: UnifiedPreviewProps) {
  const [provider] = useQueryState('provider', { defaultValue: 'shadcn' });
  const currentProvider = getPreviewableProvider(provider || 'shadcn');

  if (!currentProvider) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No preview available for {provider}
      </div>
    );
  }

  const converted = convertTheme(currentProvider.metadata.id, theme);
  if (!converted) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to convert theme for {currentProvider.metadata.name}
      </div>
    );
  }

  const PreviewComponent = currentProvider.preview.component;

  return (
    <div className={cn("h-[calc(100dvh-var(--header-height)_-_2rem)] space-y-6 relative", className)}>
      <PreviewComponent
        theme={converted}
      />

      <Dock
        theme={theme}
        providerId={currentProvider.metadata.id}
        providerName={currentProvider.metadata.name}
      />
    </div>
  );
}