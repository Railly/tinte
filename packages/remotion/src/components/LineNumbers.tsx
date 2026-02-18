import React from "react";
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from "../lib/font";

interface LineNumbersProps {
  count: number;
  foreground: string;
  startLine?: number;
}

export function LineNumbers({
  count,
  foreground,
  startLine = 1,
}: LineNumbersProps) {
  const lineHeightPx = FONT_SIZE * LINE_HEIGHT;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingRight: 16,
        paddingLeft: 12,
        userSelect: "none",
        flexShrink: 0,
        minWidth: 48,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            lineHeight: `${lineHeightPx}px`,
            color: foreground,
            display: "block",
          }}
        >
          {startLine + i}
        </span>
      ))}
    </div>
  );
}
