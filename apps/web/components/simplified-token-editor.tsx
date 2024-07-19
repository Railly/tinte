import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex, hexToHsva, hsvaToHsla } from "@uiw/color-convert";
import { IconLock, IconPipette } from "./ui/icons";
import { cn } from "@/lib/utils";

interface SimplifiedTokenEditorProps {
  colorKey: string;
  colorValue: string;
  onColorChange: (value: string) => void;
  shouldHighlight?: boolean;
  advancedMode: boolean;
  isProgressionToken?: boolean;
  isUIColor?: boolean;
}

const getTextColor = (backgroundColor?: string) => {
  if (!backgroundColor) return "#000000";
  const hsla = hsvaToHsla(hexToHsva(backgroundColor));
  return hsla.l > 50 ? "#000000" : "#FFFFFF";
};

export const SimplifiedTokenEditor: React.FC<SimplifiedTokenEditorProps> = ({
  colorKey,
  colorValue,
  onColorChange,
  shouldHighlight = false,
  advancedMode,
  isProgressionToken = false,
  isUIColor = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(() => {
    if (colorValue) {
      return hexToHsva(colorValue);
    }
    return { h: 0, s: 0, v: 0, a: 1 };
  });

  const handleColorChange = (color: { hex: string; hsva: any }) => {
    setLocalColor(color.hsva);
    onColorChange(color.hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setLocalColor(hexToHsva(newHex));
    onColorChange(newHex);
  };

  const handlePipette = async () => {
    if (!window.EyeDropper) {
      console.warn("EyeDropper API is not supported in this browser");
      return;
    }

    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      const newColor = result.sRGBHex;
      setLocalColor(hexToHsva(newColor));
      onColorChange(newColor);
    } catch (e) {
      console.log("EyeDropper was canceled");
    }
  };

  const isDisabled = !advancedMode && isUIColor && !isProgressionToken;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full h-16 text-sm font-medium hover:brightness-[1.20] transition-all relative",
            shouldHighlight && "ring-2 ring-primary",
            isDisabled && "disabled:opacity-30 cursor-not-allowed"
          )}
          style={{
            backgroundColor: colorValue,
            color: getTextColor(colorValue),
          }}
          disabled={isDisabled}
        >
          {colorKey}
          {isDisabled && (
            <div className="absolute top-1 right-1">
              <IconLock className="w-4 h-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <div className="flex flex-col gap-4">
          <Colorful
            color={localColor}
            onChange={handleColorChange}
            disableAlpha
          />
          <div className="flex items-center gap-2">
            <Input
              value={hsvaToHex(localColor)}
              onChange={handleHexInputChange}
              className="w-[16.5ch]"
              disabled={isDisabled}
            />
            <Button
              onClick={handlePipette}
              variant="outline"
              size="icon"
              disabled={isDisabled}
            >
              <IconPipette className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
