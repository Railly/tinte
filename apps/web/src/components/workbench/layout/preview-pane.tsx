import type { TinteTheme } from "@tinte/core";
import { UnifiedPreview } from "@/components/preview/unified-preview";
import { useActiveTheme } from "@/stores/hooks";
import { WorkbenchToolbar } from "../toolbar";

type WorkbenchPreviewPaneProps = {};

function PreviewPaneContent({ theme }: { theme: TinteTheme }) {
  return (
    <div className="h-[calc(100dvh-var(--header-height)-56px)]">
      <UnifiedPreview theme={theme} />
    </div>
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
