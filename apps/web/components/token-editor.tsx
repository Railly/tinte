import { cn } from "@/lib/utils";
import { HsvaColor, hexToHsva, hsvaToHex } from "@uiw/color-convert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { IconInfo } from "./ui/icons";
import { getThemeColorDescription } from "@/lib/core/config";
import { Input } from "./ui/input";
import ColorPickerButton from "./color-picker-button";
import { useEffect, useState } from "react";

interface TokenEditorProps {
  colorKey: string;
  colorValue: string;
  onColorChange: (value: string) => void;
  shouldHighlight?: boolean;
  contrastLockEnabled: boolean;
  isProgressionToken?: boolean;
  isUIColor?: boolean;
}

export const TokenEditor: React.FC<TokenEditorProps> = ({
  colorKey,
  colorValue,
  onColorChange,
  shouldHighlight,
  contrastLockEnabled,
  isProgressionToken,
  isUIColor,
}) => {
  const [hsvaColor, setHsvaColor] = useState<HsvaColor>(hexToHsva(colorValue));

  useEffect(() => {
    setHsvaColor(hexToHsva(colorValue));
  }, [colorValue]);

  const handleColorChange = (newColor: HsvaColor) => {
    if (isProgressionToken && contrastLockEnabled) {
      // Implement logic to update all UI colors based on the progression
      // This is a placeholder and should be replaced with your specific logic
      const newHex = hsvaToHex(newColor);
      onColorChange(newHex);
      // Update other UI colors here
    } else {
      onColorChange(hsvaToHex(newColor));
    }
  };

  const isDisabled =
    (contrastLockEnabled && isUIColor && !isProgressionToken) ||
    (!contrastLockEnabled && isProgressionToken);

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        shouldHighlight &&
          "border border-primary dark:border-primary/70 bg-muted rounded-md",
        isDisabled && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={`${colorKey}-text`}
          className="text-xs text-foreground flex items-center gap-1"
        >
          <span>{colorKey}</span>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <IconInfo className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{getThemeColorDescription(colorKey)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </label>
        <Input
          className="font-mono w-[11ch] text-xs"
          value={colorValue}
          onChange={(e) => onColorChange(e.target.value)}
          name={`${colorKey}-text`}
          id={`${colorKey}-text`}
          disabled={isDisabled}
        />
      </div>
      <ColorPickerButton
        color={hsvaColor}
        onChange={handleColorChange}
        disabled={isDisabled}
      />
    </div>
  );
};
