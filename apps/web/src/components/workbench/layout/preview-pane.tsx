import { ScrollArea } from "@/components/ui/scroll-area";
import { UnifiedPreview } from "@/components/preview/unified-preview";
import { useActiveTheme } from "@/stores/hooks";
import type { TinteTheme } from "@tinte/core";
import { WorkbenchToolbar } from "../toolbar";

type WorkbenchPreviewPaneProps = {};

function PreviewPaneContent({ theme }: { theme: TinteTheme }) {
  return (
    <ScrollArea
      className="h-[calc(100dvh-var(--header-height)-56px)]"
      showScrollIndicators={true}
      indicatorType="shadow"
    >
      <div className="h-full px-4 pt-4">
        <UnifiedPreview theme={theme} />
      </div>
    </ScrollArea>
  );
}

export function WorkbenchPreviewPane({}: WorkbenchPreviewPaneProps) {
  const { tinteTheme } = useActiveTheme();

  return (
    <main className="flex flex-col overflow-hidden w-full">
      <div className="h-12.5 border-b border-border flex items-center justify-end px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <WorkbenchToolbar />
      </div>
      <PreviewPaneContent theme={tinteTheme} />
    </main>
  );
}
