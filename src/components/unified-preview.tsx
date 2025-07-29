import { TinteTheme } from "@/types/tinte";
import { adapterRegistry } from "@/lib/adapters";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

interface UnifiedPreviewProps {
  theme: TinteTheme;
  className?: string;
  onExport?: (adapterId: string, filename: string, content: string) => void;
}

export function UnifiedPreview({ theme, className, onExport }: UnifiedPreviewProps) {
  const [provider] = useQueryState('provider', { defaultValue: 'shadcn' });
  const currentAdapter = adapterRegistry.getPreviewable(provider || 'shadcn');

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
        {...(currentAdapter.preview.defaultProps || {})}
      />
    </div>
  );
}