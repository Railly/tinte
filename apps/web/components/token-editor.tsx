import { Input } from "@/components/ui/input";
import { IconPipette } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { createRef } from "react";

interface TokenEditorProps {
  colorKey: string;
  colorValue: string;
  onColorChange: (value: string) => void;
}

export const TokenEditor = ({
  colorKey,
  colorValue,
  onColorChange,
}: TokenEditorProps) => {
  const ref = createRef<HTMLInputElement>();

  return (
    <div className="grid md:grid-cols-[2fr_2fr_3fr] gap-4 items-center">
      <div
        className={cn(
          "relative w-full text-transparent transition-colors duration-200 hover:text-foreground dark:hover:text-foreground/70"
        )}
      >
        <Input
          type="color"
          className={cn(
            "p-1 rounded-full w-full",
            `[&::-webkit-color-swatch]:p-0`,
            `[&::-webkit-color-swatch]:rounded-full`,
            `[&::-webkit-color-swatch]:border-2`,
            `[&::-webkit-color-swatch]:border-black/20`,
            `dark:[&::-webkit-color-swatch]:border-white/20`,
            `[&::-webkit-color-swatch-wrapper]:p-0 border-none`,
            "cursor-pointer"
          )}
          value={colorValue}
          onChange={(e) => onColorChange(e.target.value)}
          name={colorKey}
          id={colorKey}
          ref={ref}
        />
        <IconPipette
          className="absolute top-[calc(50%-0.5rem)] left-[calc(50%-0.5rem)] cursor-pointer"
          onClick={() => {
            if (ref.current) {
              ref.current.click();
            }
          }}
        />
      </div>
      <Input
        className="font-mono"
        value={colorValue}
        onChange={(e) => onColorChange(e.target.value)}
        name={`${colorKey}-text`}
        id={`${colorKey}-text`}
      />
      <label htmlFor={`${colorKey}-text`} className="text-xs text-foreground">
        {colorKey}
      </label>
    </div>
  );
};
