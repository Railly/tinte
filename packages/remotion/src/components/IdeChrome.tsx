import React from "react";
import { FileTab } from "./FileTab";
import type { ThemeColors } from "../types";

interface IdeChromeProps {
  themeColors: ThemeColors;
  fileName: string;
  filePath: string[];
  children: React.ReactNode;
}

export function IdeChrome({
  themeColors,
  fileName,
  filePath,
  children,
}: IdeChromeProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        background: themeColors.editorBackground,
      }}
    >
      <div
        style={{
          background: themeColors.titleBarBackground,
          height: 44,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          gap: 12,
          flexShrink: 0,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <TrafficLights />
        <FileTab
          fileName={fileName}
          filePath={filePath}
          foreground={themeColors.titleBarForeground}
          mutedForeground={themeColors.lineNumberForeground}
        />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function TrafficLights() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#FF5F57",
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#FFBD2E",
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#28C840",
        }}
      />
    </div>
  );
}
