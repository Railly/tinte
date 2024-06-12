import { DarkLightPalette } from "@/lib/core/types";
import { cn } from "@/lib/utils";

interface CircularGradientProps {
  className?: string;
  presetName: string;
  currentTheme: "light" | "dark";
  presets: Record<string, DarkLightPalette>;
}

export const CircularGradient = ({
  className,
  presets,
  presetName,
  currentTheme,
}: CircularGradientProps) => {
  return (
    <span
      className={cn("w-4 h-4 rounded-full flex", className)}
      style={{
        backgroundImage:
          currentTheme &&
          `linear-gradient(140deg, ${presets[presetName]?.[currentTheme].primary}, ${presets[presetName]?.[currentTheme].accent})`,
      }}
    />
  );
};
