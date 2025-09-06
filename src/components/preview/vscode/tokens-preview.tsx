"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VSCodeTheme } from "@/lib/providers/vscode";

interface TokensPreviewProps {
  theme: VSCodeTheme;
  mode: "light" | "dark";
}

export function TokensPreview({ theme, mode }: TokensPreviewProps) {
  // Memoize expensive calculations
  const colorEntries = useMemo(
    () => Object.entries(theme.colors || {}).slice(0, 30),
    [theme.colors],
  );

  const tokenColorEntries = useMemo(
    () => (theme.tokenColors || []).slice(0, 20),
    [theme.tokenColors],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full overflow-auto">
      {/* VS Code Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">VS Code Colors ({mode})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {colorEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 p-2 rounded border text-sm"
              >
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-medium">{key}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {value}
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(theme.colors || {}).length > 30 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                ... and {Object.keys(theme.colors || {}).length - 30} more
                colors
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Token Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Token Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tokenColorEntries.map((token, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded border text-sm"
              >
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{
                    backgroundColor: token.settings.foreground || "#000000",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs">
                    {token.name || "Unnamed"}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground truncate">
                    {Array.isArray(token.scope)
                      ? token.scope.join(", ")
                      : token.scope}
                  </div>
                  {token.settings.fontStyle && (
                    <div className="font-mono text-xs text-blue-600">
                      Style: {token.settings.fontStyle}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(theme.tokenColors || []).length > 20 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                ... and {(theme.tokenColors || []).length - 20} more token rules
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Theme Info */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Theme Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Name</div>
              <div className="font-mono">{theme.name || "Untitled Theme"}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Type</div>
              <div className="font-mono">{theme.type || "unknown"}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">
                Display Name
              </div>
              <div className="font-mono">
                {theme.displayName || theme.name || "N/A"}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">
                Colors Count
              </div>
              <div className="font-mono">
                {Object.keys(theme.colors || {}).length}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">
                Token Rules
              </div>
              <div className="font-mono">
                {(theme.tokenColors || []).length}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">UI Theme</div>
              <div className="font-mono">
                {theme.type === "dark" ? "vs-dark" : "vs"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Theme Data */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Raw Theme JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded font-mono">
            {JSON.stringify(theme, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
