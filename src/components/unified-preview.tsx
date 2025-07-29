import { TinteTheme } from "@/types/tinte";
import { adapterRegistry } from "@/lib/adapters";
import { useQueryState } from "nuqs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface UnifiedPreviewProps {
  theme: TinteTheme;
  className?: string;
}

export function UnifiedPreview({ theme, className }: UnifiedPreviewProps) {
  const [provider] = useQueryState('provider', { defaultValue: 'shadcn' });
  const { theme: nextTheme, systemTheme } = useTheme();
  const currentAdapter = adapterRegistry.getPreviewable(provider || 'shadcn');
  
  const currentTheme = nextTheme === "system" ? systemTheme : nextTheme;
  const isDark = currentTheme === "dark";

  if (!currentAdapter) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No preview available for {provider}
      </div>
    );
  }

  const converted = adapterRegistry.convert(currentAdapter.id, theme);
  if (!converted) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to convert theme for {currentAdapter.metadata.name}
      </div>
    );
  }

  const PreviewComponent = currentAdapter.preview.component;

  return (
    <div className={cn("space-y-6", className)}>
      <PreviewComponent
        theme={converted}
        isDark={isDark}
        {...(currentAdapter.preview.defaultProps || {})}
      />
    </div>
  );
}