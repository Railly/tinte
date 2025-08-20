import { ScrollArea } from '@/components/ui/scroll-area';
import { UnifiedPreview } from '@/components/unified-preview';
import { useThemeContext } from '@/providers/theme';
import type { TinteTheme } from '@/types/tinte';

interface WorkbenchPreviewPaneProps { }

function PreviewPaneContent({ theme }: { theme: TinteTheme }) {
  return (
    <ScrollArea
      className="h-[calc(100dvh-var(--header-height))]"
      showScrollIndicators={true}
      indicatorType="shadow"
    >
      <div className="h-full p-4">
        <UnifiedPreview
          theme={theme}
        />
      </div>
    </ScrollArea>
  );
}

export function WorkbenchPreviewPane({ }: WorkbenchPreviewPaneProps) {
  // Get own data - no prop drilling
  const { tinteTheme } = useThemeContext();
  return (
    <main className="flex flex-col overflow-hidden w-full">
      <PreviewPaneContent theme={tinteTheme} />
    </main>
  );
}