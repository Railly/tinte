import React from "react";
import { useCurrentFrame } from "remotion";

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  accentColor: string;
  backgroundColor: string;
}

export function ProgressBar({
  totalSteps,
  currentStep,
  accentColor,
  backgroundColor,
}: ProgressBarProps) {
  const progress = totalSteps > 1 ? currentStep / (totalSteps - 1) : 1;

  return (
    <div
      style={{
        width: "100%",
        height: 3,
        background: `${backgroundColor}44`,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${progress * 100}%`,
          background: accentColor,
          borderRadius: "0 2px 2px 0",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
