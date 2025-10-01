import { ScrollArea } from "@/components/ui/scroll-area";
import { UnifiedPreview } from "@/components/unified-preview";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { WorkbenchToolbar } from "./workbench-toolbar";

type WorkbenchPreviewPaneProps = {};

function PreviewPaneContent({ theme }: { theme: TinteTheme }) {
  return (
    <ScrollArea
      className="h-[calc(100dvh-var(--header-height)-56px)]"
      showScrollIndicators={true}
      indicatorType="shadow"
    >
      <div className="h-full p-4">
        <UnifiedPreview theme={theme} />
      </div>
    </ScrollArea>
  );
}

export function WorkbenchPreviewPane({}: WorkbenchPreviewPaneProps) {
  const { tinteTheme } = useThemeContext();

  return (
    <main className="flex flex-col overflow-hidden w-full">
      <div className="h-12 border-b border-border flex items-center justify-end px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <WorkbenchToolbar />
      </div>
      <PreviewPaneContent theme={tinteTheme} />
    </main>
  );
}
