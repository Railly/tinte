import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { UnifiedPreview } from '@/components/unified-preview';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import { useThemeAdapters } from '@/hooks/use-theme-adapters';
import { useQueryState } from 'nuqs';
import type { TinteTheme } from '@/types/tinte';
import { downloadFile } from '@/lib/file-download';

interface WorkbenchPreviewPaneProps {
  theme: TinteTheme;
  onExportAll: () => void;
  onExportTinte: () => void;
}

function PreviewPaneHeader({
  onExportAll,
  onExportTinte,
}: {
  onExportAll: () => void;
  onExportTinte: () => void;
}) {
  const [provider] = useQueryState('provider', { defaultValue: 'shadcn' });
  const { getPreviewableAdapter } = useThemeAdapters();
  const currentAdapter = getPreviewableAdapter(provider || 'shadcn');

  const Icon = currentAdapter?.metadata?.icon;
  const name = currentAdapter?.metadata?.name || 'Theme Preview';
  const description = currentAdapter?.metadata?.description;
  const category = currentAdapter?.metadata?.category;

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5" />}
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>
        {category && (
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportAll}>
              Export All Formats
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportTinte}>
              Export Tinte JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function PreviewPaneContent({ theme }: { theme: TinteTheme }) {
  const handleExport = (_: string, filename: string, content: string) => {
    downloadFile({ content, filename, mimeType: 'text/plain' });
  };

  return (
    <ScrollArea className="p-4 h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      <UnifiedPreview
        theme={theme}
      />
    </ScrollArea>
  );
}

export function WorkbenchPreviewPane({
  theme,
  onExportAll,
  onExportTinte,
}: WorkbenchPreviewPaneProps) {
  return (
    <main
      className="flex flex-col overflow-hidden w-full"
    >
      <PreviewPaneHeader
        onExportAll={onExportAll}
        onExportTinte={onExportTinte}
      />

      <Separator />

      <PreviewPaneContent theme={theme} />
    </main>
  );
}