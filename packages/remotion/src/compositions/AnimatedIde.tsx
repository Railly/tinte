import React from "react";
import type { LighterResult } from "@code-hike/lighter";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { IdeChrome } from "../components/IdeChrome";
import { CodePanel } from "../components/CodePanel";
import { ProgressBar } from "../components/ProgressBar";
import {
  extractThemeColors,
  loadTinteThemeFromJson,
  tinteToRawTheme,
} from "../lib/tinte-theme-bridge";
import type { AnimatedIdeProps, ThemeColors } from "../types";
import oneHunterJson from "../../public/themes/one-hunter.json";

const THEME_MAP: Record<string, Record<string, unknown>> = {
  "one-hunter": oneHunterJson as Record<string, unknown>,
};

interface AnimatedIdeInternalProps extends AnimatedIdeProps {
  highlightedSteps?: Array<{
    highlighted: LighterResult;
    fileName: string;
    filePath: string[];
  }>;
  themeColors?: ThemeColors;
}

function makeFallbackHighlighted(
  code: string,
  foreground: string,
  background: string,
): LighterResult {
  return {
    lines: code.split("\n").map((line) => [
      {
        content: line,
        style: { color: foreground },
      },
    ]),
    lang: "tsx" as LighterResult["lang"],
    style: {
      color: foreground,
      background,
      colorScheme: "dark",
    },
  };
}

export function AnimatedIde({
  steps,
  settings,
  durationPerStep,
  transitionDuration,
  highlightedSteps: preHighlightedSteps,
  themeColors: preThemeColors,
}: AnimatedIdeInternalProps) {
  const frame = useCurrentFrame();

  const resolvedThemeColors: ThemeColors = React.useMemo(() => {
    if (preThemeColors) return preThemeColors;
    const themeJson = THEME_MAP[settings.theme] ?? THEME_MAP["one-hunter"];
    const tinteTheme = loadTinteThemeFromJson(themeJson);
    const rawTheme = tinteToRawTheme(tinteTheme, settings.mode);
    return extractThemeColors(rawTheme);
  }, [preThemeColors, settings.theme, settings.mode]);

  const stepPeriod = durationPerStep + transitionDuration;
  const stepIndex = Math.min(
    Math.floor(frame / stepPeriod),
    steps.length - 1,
  );

  const stepStart = stepIndex * stepPeriod;
  const frameInStep = frame - stepStart;

  const isTransitioning =
    frameInStep > durationPerStep && stepIndex < steps.length - 1;
  const transitionFrame = frameInStep - durationPerStep;
  const transitionProgress = isTransitioning
    ? Math.min(transitionFrame / transitionDuration, 1)
    : 1;

  const displayStepIndex = isTransitioning ? stepIndex + 1 : stepIndex;
  const displayStep = steps[displayStepIndex] ?? steps[stepIndex];

  if (!displayStep) return null;

  const fromIndex = isTransitioning ? stepIndex : stepIndex - 1;
  const fromEntry = fromIndex >= 0 ? preHighlightedSteps?.[fromIndex] : null;
  const toEntry = preHighlightedSteps?.[displayStepIndex];

  const fromHighlighted = fromEntry?.highlighted ?? null;
  const toHighlighted =
    toEntry?.highlighted ??
    makeFallbackHighlighted(
      displayStep.code,
      resolvedThemeColors.editorForeground,
      resolvedThemeColors.editorBackground,
    );

  const progress = isTransitioning ? transitionProgress : 1;

  return (
    <AbsoluteFill
      style={{
        background: resolvedThemeColors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IdeChrome
          themeColors={resolvedThemeColors}
          fileName={displayStep.fileName}
          filePath={displayStep.filePath}
        >
          <CodePanel
            fromHighlighted={fromHighlighted}
            toHighlighted={toHighlighted}
            progress={progress}
            themeColors={resolvedThemeColors}
            showLineNumbers
          />
        </IdeChrome>
        <div style={{ marginTop: 8 }}>
          <ProgressBar
            totalSteps={steps.length}
            currentStep={stepIndex}
            accentColor={resolvedThemeColors.progressBarBackground}
            backgroundColor={resolvedThemeColors.editorForeground}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}
