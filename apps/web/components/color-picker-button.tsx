import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex, hsvaToHsla } from "@uiw/color-convert";
import { IconChevronDown } from "./ui/icons";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface ColorPickerButtonProps {
  color: { h: number; s: number; v: number; a: number };
  onChange: (color: { h: number; s: number; v: number; a: number }) => void;
  disabled?: boolean;
}
const getTextColorFromHSL = (l: number) => {
  return l > 50 ? "#000000" : "#FFFFFF";
};

const ColorPickerButton = ({
  color,
  onChange,
  disabled,
}: ColorPickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);

  const debouncedOnChange = useDebounce(
    (newColor: { h: number; s: number; v: number; a: number }) => {
      onChange(newColor);
    },
    100
  );

  const handleColorChange = (newColor: {
    hsva: { h: number; s: number; v: number; a: number };
  }) => {
    setLocalColor(newColor.hsva);
    debouncedOnChange(newColor.hsva);
  };

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const hsla = hsvaToHsla(localColor);
  const hslString = `${Math.round(hsla.h)}° ${Math.round(hsla.s)}% ${Math.round(hsla.l)}%`;

  const backgroundColor = hsvaToHex(localColor);
  const textColor = getTextColorFromHSL(hsla.l);

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
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          style={{ backgroundColor, color: textColor }}
        >
          <code>{hslString}</code>
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Colorful
          color={localColor}
          onChange={handleColorChange}
          disableAlpha
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerButton;
