import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Colorful } from "@uiw/react-color";
import {
  hsvaToHsla,
  hslaToHsva,
  hexToHsva,
  hsvaToHex,
} from "@uiw/color-convert";
import { IconChevronDown, IconPipette } from "./ui/icons";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface ColorPickerButtonProps {
  color: { h: number; s: number; l: number; a: number };
  onChange: (color: { h: number; s: number; l: number; a: number }) => void;
  disabled?: boolean;
}

const getTextColorFromHSLA = (l: number, a: number) => {
  return l > 50 || a < 0.5 ? "#000000" : "#FFFFFF";
};

const ColorPickerInput = ({
  color,
  onChange,
  disabled,
}: ColorPickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [hexInput, setHexInput] = useState(hsvaToHex(hslaToHsva(color)));

  const debouncedOnChange = useDebounce(
    (newColor: { h: number; s: number; l: number; a: number }) => {
      onChange(newColor);
    },
    100,
  );

  const handleColorChange = (newColor: {
    hsva: { h: number; s: number; v: number; a: number };
  }) => {
    const hsla = hsvaToHsla(newColor.hsva);
    setLocalColor(hsla);
    setHexInput(hsvaToHex(newColor.hsva));
    debouncedOnChange(hsla);
  };

  useEffect(() => {
    setLocalColor(color);
    setHexInput(hsvaToHex(hslaToHsva(color)));
  }, [color]);

  const handlePipette = async () => {
    if (!window.EyeDropper) {
      console.warn("EyeDropper API is not supported in this browser");
      return;
    }

    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      const newColor = hsvaToHsla(hexToHsva(result.sRGBHex));
      setLocalColor(newColor);
      setHexInput(result.sRGBHex);
      debouncedOnChange(newColor);
    } catch (e) {
      console.log("EyeDropper was canceled");
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const newColor = hsvaToHsla(hexToHsva(value));
      setLocalColor(newColor);
      debouncedOnChange(newColor);
    }
  };

  const hslString = `${Math.round(localColor.h)}° ${Math.round(localColor.s)}% ${Math.round(localColor.l)}%`;

  const hslaString = `hsla(${Math.round(localColor.h)}, ${Math.round(localColor.s)}%, ${Math.round(localColor.l)}%, ${localColor.a.toFixed(2)})`;

  const backgroundColor = hslaString;
  const textColor = getTextColorFromHSLA(localColor.l, localColor.a);

  return (
    <Popover
      open={isOpen && !disabled}
      onOpenChange={(open) => !disabled && setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
          style={{ backgroundColor, color: textColor }}
        >
          <code>{hslString}</code>
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4">
          <Colorful
            color={hslaToHsva(localColor)}
            onChange={handleColorChange}
            disableAlpha
          />
          <div className="flex mt-4 gap-2">
            <Input
              value={hexInput}
              onChange={handleHexInputChange}
              placeholder="#RRGGBB"
              className="w-[16.5ch]"
              disabled={disabled}
            />
            <Button
              onClick={handlePipette}
              variant="outline"
              size="icon"
              disabled={disabled}
            >
              <IconPipette className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerInput;
