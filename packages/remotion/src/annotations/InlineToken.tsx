import React from "react";

interface InlineTokenProps {
  children: React.ReactNode;
  color?: string;
  opacity?: number;
}

export function InlineToken({ children, color, opacity = 1 }: InlineTokenProps) {
  return (
    <span
      style={{
        color,
        opacity,
        display: "inline",
        transition: "opacity 0.3s ease, color 0.3s ease",
      }}
    >
      {children}
    </span>
  );
}
