import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  splitRatio?: number;
  gap?: number;
  animateIn?: boolean;
}

export function SplitView({
  left,
  right,
  splitRatio = 0.6,
  gap = 16,
  animateIn = false,
}: SplitViewProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = animateIn
    ? spring({ frame, fps, config: { damping: 20, stiffness: 80 } })
    : 1;

  const rightOpacity = interpolate(slideProgress, [0, 1], [0, 1]);
  const rightTranslate = interpolate(slideProgress, [0, 1], [40, 0]);

  const leftPercent = splitRatio * 100;
  const rightPercent = (1 - splitRatio) * 100;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap,
      }}
    >
      <div
        style={{
          width: `${leftPercent}%`,
          height: "100%",
          flexShrink: 0,
        }}
      >
        {left}
      </div>
      <div
        style={{
          width: `${rightPercent}%`,
          height: "100%",
          opacity: rightOpacity,
          transform: `translateX(${rightTranslate}px)`,
        }}
      >
        {right}
      </div>
    </div>
  );
}
