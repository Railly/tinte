import { highlight } from "@code-hike/lighter";
import type { LighterResult, RawTheme } from "@code-hike/lighter";
import type { CalculateMetadataFunction } from "remotion";
import {
  extractThemeColors,
  loadTinteThemeFromJson,
  tinteToRawTheme,
} from "./tinte-theme-bridge";
import oneHunterJson from "../../public/themes/one-hunter.json";
import type { AnimatedIdeProps, ThemeColors } from "../types";

const THEME_MAP: Record<string, Record<string, unknown>> = {
  "one-hunter": oneHunterJson as Record<string, unknown>,
};

export interface CalculatedAnimatedIdeMetadata {
  themeColors: ThemeColors;
  highlightedSteps: Array<{
    highlighted: LighterResult;
    fileName: string;
    filePath: string[];
  }>;
}

type RemotionProps = Record<string, unknown>;

export const calculateAnimatedIdeMetadata: CalculateMetadataFunction<RemotionProps> =
  async ({ props }) => {
    const typedProps = props as unknown as AnimatedIdeProps;
    const { steps, settings, durationPerStep, transitionDuration } = typedProps;
    const { theme, mode } = settings;

    const themeJson = THEME_MAP[theme] ?? THEME_MAP["one-hunter"];
    const tinteTheme = loadTinteThemeFromJson(themeJson);
    const rawTheme = tinteToRawTheme(tinteTheme, mode);
    const themeColors = extractThemeColors(rawTheme);

    const highlightedSteps = await Promise.all(
      steps.map(async (step) => {
        const highlighted = await highlight(
          step.code,
          step.lang,
          rawTheme as RawTheme,
        );
        return {
          highlighted,
          fileName: step.fileName,
          filePath: step.filePath,
        };
      }),
    );

    const totalFrames =
      steps.length * durationPerStep +
      (steps.length - 1) * transitionDuration;

    return {
      durationInFrames: totalFrames,
      fps: 30,
      width: 1920,
      height: 1080,
      props: {
        ...typedProps,
        highlightedSteps,
        themeColors,
      } as RemotionProps,
    };
  };
