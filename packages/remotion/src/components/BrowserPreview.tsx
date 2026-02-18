import React from "react";
import { FONT_FAMILY } from "../lib/font";

interface BrowserPreviewProps {
  url?: string;
  background?: string;
  foreground?: string;
  children?: React.ReactNode;
}

export function BrowserPreview({
  url = "localhost:3000",
  background = "#1e1e1e",
  foreground = "#d4d4d4",
  children,
}: BrowserPreviewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background,
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          gap: 8,
          background: `${background}cc`,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <NavButton label="←" foreground={foreground} />
          <NavButton label="→" foreground={foreground} />
          <NavButton label="↺" foreground={foreground} />
        </div>
        <div
          style={{
            flex: 1,
            background: `rgba(255,255,255,0.06)`,
            borderRadius: 4,
            padding: "3px 10px",
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            color: foreground,
            opacity: 0.7,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function NavButton({
  label,
  foreground,
}: {
  label: string;
  foreground: string;
}) {
  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        color: foreground,
        opacity: 0.5,
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}
