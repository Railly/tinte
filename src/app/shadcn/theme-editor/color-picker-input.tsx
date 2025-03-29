"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Colorful } from "@uiw/react-color";
import { formatHex, oklch, parse } from "culori";
import { ChevronDownIcon, PipetteIcon } from "lucide-react";
import React from "react";

export const getComputedColor = (themeColor: string) => {
  const element = document.querySelector("#shadcn-theme") as HTMLStyleElement;
  if (!element) {
    return undefined;
  }
  return getComputedStyle(element).getPropertyValue(`--color-${themeColor}`);
};

const convertOklchToHex = (oklchColor: string) => {
  const color = parse(oklchColor);
  const hexColor = formatHex(color);
  return hexColor;
};

const convertHexToOklch = (hex: string) => {
  const color = parse(hex);
  const oklchColor = oklch(color, "oklch");
  if (!oklchColor) {
    return "oklch(0 0 0)";
  }
  return `oklch(${oklchColor.l.toFixed(2)} ${oklchColor.c.toFixed(2)} ${
    oklchColor.h?.toFixed(2) ?? 0
  })`;
};

const ColorPickerInput = ({ themeColor }: { themeColor: string }) => {
  const [color, setColor] = React.useState(getComputedColor(themeColor));

  function updateStyleSheet(color: string) {
    const element = document.querySelector("#shadcn-theme") as HTMLStyleElement;
    if (!element) {
      throw new Error("Element not found");
    }
    const styleSheet = element.sheet;
    if (!styleSheet) {
      throw new Error("Style sheet not found");
    }

    const theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    const rules = styleSheet.cssRules;
    const selector = theme === "dark" ? ".dark" : ":root";

    for (const element of rules) {
      console.log(element);
      const rule = element;
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
        const style = rule.style;
        style.setProperty(`--color-${themeColor}`, convertHexToOklch(color));
        console.log(style.getPropertyValue(`--color-${themeColor}`));
        break;
      }
    }
  }
  const handlePipette = async () => {
    // @ts-ignore
    if (!window.EyeDropper) {
      console.warn("EyeDropper API is not supported in this browser");
      return;
    }

    // @ts-expect-error EyeDropper API not yet in TypeScript types
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      updateStyleSheet(result.sRGBHex);
      setColor(convertHexToOklch(result.sRGBHex));
    } catch (e) {
      console.log("EyeDropper was canceled");
    }
  };

  const handleColorChange = (hexColor: string) => {
    const element = document.getElementById("shadcn-theme");

    if (!element) {
      return;
    }
    if (hexColor) {
      updateStyleSheet(hexColor);
      setColor(convertHexToOklch(hexColor));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-between")}>
          <div
            className="size-6 rounded-full"
            style={{ backgroundColor: color }}
          />
          <code>{color}</code>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4">
          <Colorful
            color={convertOklchToHex(color ?? "oklch(0 0 0)")}
            onChange={(newColor) => handleColorChange(newColor.hex)}
            disableAlpha
          />
          <div className="mt-4 flex gap-2">
            <Input
              value={convertOklchToHex(color ?? "oklch(0 0 0)")}
              onChange={(event) => handleColorChange(event.target.value)}
              placeholder="#RRGGBB"
              className="w-[16.5ch]"
            />
            <Button onClick={handlePipette} variant="outline" size="icon">
              <PipetteIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerInput;
