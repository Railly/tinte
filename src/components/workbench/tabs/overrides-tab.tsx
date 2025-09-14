"use client";

import { useQueryState } from "nuqs";
import * as React from "react";
import { ThemeEditorPanel } from "@/components/shared/theme-editor-panel";
import { TokenSearch } from "@/components/shared/token-search";
import { VSCodeOverridesPanel } from "@/components/shared/vscode-overrides-panel";

export function OverridesTab() {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const [searchQuery, setSearchQuery] = React.useState("");

  const getSearchPlaceholder = () => {
    if (provider === "shadcn") {
      return "Search tokens...";
    }
    if (provider === "vscode") {
      return "Search by name, key, or scope...";
    }
    return "Search tokens...";
  };

  if (provider === "shadcn") {
    return (
      <ThemeEditorPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={getSearchPlaceholder()}
      />
    );
  }

  if (provider === "vscode") {
    return (
      <VSCodeOverridesPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={getSearchPlaceholder()}
      />
    );
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      <h3 className="font-medium mb-2">Provider-Specific Tokens</h3>
      <p>Select shadcn/ui or VS Code provider to edit tokens</p>
    </div>
  );
}
