import React from "react";
import { LineNumbers } from "./LineNumbers";
import { CodeTransition } from "./CodeTransition";
import type { ThemeColors } from "../types";
import type { LighterResult } from "@code-hike/lighter";

interface CodePanelProps {
  fromHighlighted: LighterResult | null;
  toHighlighted: LighterResult;
  progress: number;
  themeColors: ThemeColors;
  showLineNumbers?: boolean;
}

export function CodePanel({
  fromHighlighted,
  toHighlighted,
  progress,
  themeColors,
  showLineNumbers = true,
}: CodePanelProps) {
  const lineCount = toHighlighted.lines?.length ?? 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        background: themeColors.editorBackground,
        overflow: "hidden",
      }}
    >
      {showLineNumbers && (
        <LineNumbers
          count={lineCount}
          foreground={themeColors.lineNumberForeground}
        />
      )}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CodeTransition
          fromHighlighted={fromHighlighted}
          toHighlighted={toHighlighted}
          progress={progress}
          background={themeColors.editorBackground}
          foreground={themeColors.editorForeground}
        />
      </div>
    </div>
  );
}
