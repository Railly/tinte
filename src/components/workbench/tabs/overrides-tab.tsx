import { useQueryState } from "nuqs";
import { ThemeEditorPanel } from "@/components/shared/theme-editor-panel";
import { VSCodeOverridesPanel } from "@/components/shared/vscode-overrides-panel";

export function OverridesTab() {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });

  if (provider === "shadcn") {
    return <ThemeEditorPanel />;
  }

  if (provider === "vscode") {
    return <VSCodeOverridesPanel />;
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      <h3 className="font-medium mb-2">Provider-Specific Tokens</h3>
      <p>Select shadcn/ui or VS Code provider to edit tokens</p>
    </div>
  );
}
