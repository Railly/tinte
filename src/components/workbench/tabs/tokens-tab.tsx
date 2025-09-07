import { ThemeEditorPanel } from "@/components/shared/theme-editor-panel";
import { useQueryState } from "nuqs";

export function TokensTab() {
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