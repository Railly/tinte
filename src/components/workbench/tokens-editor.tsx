"use client";

import { useQueryState } from "nuqs";
import { ThemeEditorPanel } from "@/components/shared/theme-editor-panel";

export function TokensEditor() {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });

  if (provider !== "shadcn") {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <h3 className="font-medium mb-2">Provider-Specific Tokens</h3>
        <p>Select shadcn/ui provider to edit tokens</p>
      </div>
    );
  }

  return <ThemeEditorPanel />;
}
