import { Palette } from "@/lib/core/types";
import { cn } from "@/lib/utils";

interface CircularGradientProps {
  className?: string;
  palette: Palette;
}

export const CircularGradient = ({
  className,
  palette,
}: CircularGradientProps) => {
  return (
    <span
      className={cn("w-4 h-4 rounded-full flex", className)}
      style={{
        backgroundImage:
          palette && palette.primary && palette.accent
            ? `linear-gradient(140deg, ${palette.primary}, ${palette.accent})`
            : undefined,
      }}
    />
  );
};
