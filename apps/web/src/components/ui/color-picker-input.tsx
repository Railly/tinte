import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import { Colorful } from "@uiw/react-color";
import { hsl as culoriHsl, formatHex, lch, oklch, rgb } from "culori";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ColorPickerInputProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

const formatOklchDisplay = (color: string): string => {
  if (!color || typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }
  const parsed = oklch(color);
  if (!parsed) return color;
  return `oklch(${parsed.l.toFixed(2)} ${parsed.c.toFixed(2)} ${(parsed.h ?? 0).toFixed(0)})`;
};

export function ColorPickerInput({
  color,
  onChange,
  disabled = false,
}: ColorPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const [prevColor, setPrevColor] = useState(color);
  const [activeTab, setActiveTab] = useState("oklch");

  if (color !== prevColor) {
    setPrevColor(color);
    setInputValue(color);
  }

  const contrastColor = useMemo(() => {
    if (
      !color ||
      typeof color !== "string" ||
      !/^#[0-9A-Fa-f]{6}$/.test(color)
    ) {
      return "#000000";
    }
    return getContrastColor(color);
  }, [color]);

  const colorValues = useMemo(() => {
    if (!color || typeof color !== "string") {
      console.warn("ColorPickerInput: Invalid color prop:", color);
      toast.error(`Invalid color prop: ${JSON.stringify(color)}`, {
        description: "Color must be a string",
        duration: 5000,
      });
      return {
        hex: "#000000",
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        oklch: { l: 0, c: 0, h: 0 },
        lch: { l: 0, c: 0, h: 0 },
      };
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      console.warn("ColorPickerInput: Invalid hex color format:", color);
      toast.error(`Invalid hex color format: ${color}`, {
        description: "Expected format: #RRGGBB",
        duration: 5000,
      });
      return {
        hex: "#000000",
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        oklch: { l: 0, c: 0, h: 0 },
        lch: { l: 0, c: 0, h: 0 },
      };
    }

    const rgbColor = rgb(color);
    const hslColor = culoriHsl(color);
    const oklchColor = oklch(color);
    const lchColor = lch(color);

    return {
      hex: color,
      rgb: rgbColor
        ? {
            r: Math.round(rgbColor.r * 255),
            g: Math.round(rgbColor.g * 255),
            b: Math.round(rgbColor.b * 255),
          }
        : { r: 0, g: 0, b: 0 },
      hsl: hslColor
        ? {
            h: Math.round(hslColor.h || 0),
            s: Math.round((hslColor.s || 0) * 100),
            l: Math.round((hslColor.l || 0) * 100),
          }
        : { h: 0, s: 0, l: 0 },
      oklch: oklchColor
        ? {
            l: Math.round((oklchColor.l || 0) * 100),
            c: Math.round((oklchColor.c || 0) * 100),
            h: Math.round(oklchColor.h || 0),
          }
        : { l: 0, c: 0, h: 0 },
      lch: lchColor
        ? {
            l: Math.round(lchColor.l || 0),
            c: Math.round(lchColor.c || 0),
            h: Math.round(lchColor.h || 0),
          }
        : { l: 0, c: 0, h: 0 },
    };
  }, [color]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        onChange(value);
      }
    },
    [onChange],
  );

  const handleInputBlur = useCallback(() => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(color);
    }
  }, [inputValue, color]);

  const handleColorfulChange = useCallback(
    (newColor: { hsva: { h: number; s: number; v: number; a: number } }) => {
      const hex = hsvaToHex(newColor.hsva);
      setInputValue(hex);
      onChange(hex);
    },
    [onChange],
  );

  const handleQuickColorClick = useCallback(
    (quickColor: string) => {
      setInputValue(quickColor);
      onChange(quickColor);
    },
    [onChange],
  );

  const handleColorSpaceChange = useCallback(
    (values: Record<string, number>, colorSpace: string) => {
      let hexColor: string | undefined;

      switch (colorSpace) {
        case "rgb":
          hexColor = formatHex(
            rgb({
              mode: "rgb",
              r: values.r / 255,
              g: values.g / 255,
              b: values.b / 255,
            }),
          );
          break;
        case "hsl":
          hexColor = formatHex(
            culoriHsl({
              mode: "hsl",
              h: values.h,
              s: values.s / 100,
              l: values.l / 100,
            }),
          );
          break;
        case "oklch":
          hexColor = formatHex(
            oklch({
              mode: "oklch",
              l: values.l / 100,
              c: values.c / 100,
              h: values.h,
            }),
          );
          break;
        case "lch":
          hexColor = formatHex(
            lch({ mode: "lch", l: values.l, c: values.c, h: values.h }),
          );
          break;
        default:
          return;
      }

      if (hexColor && /^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
        setInputValue(hexColor);
        onChange(hexColor);
      }
    },
    [onChange],
  );

  const hsvaColor = useMemo(() => {
    if (
      !color ||
      typeof color !== "string" ||
      !/^#[0-9A-Fa-f]{6}$/.test(color)
    ) {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
    return hexToHsva(color);
  }, [color]);

  const quickColors = useMemo(
    () => [
      "#000000",
      "#ffffff",
      "#ef4444",
      "#22c55e",
      "#3b82f6",
      "#f59e0b",
      "#a855f7",
      "#ec4899",
    ],
    [],
  );

  return (
    <Popover
      open={isOpen && !disabled}
      onOpenChange={(open) => !disabled && setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 justify-between font-mono text-sm w-full",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
          style={{
            backgroundColor: color,
            color: contrastColor,
          }}
        >
          <span className="truncate">{formatOklchDisplay(color)}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <Colorful
              color={hsvaColor}
              onChange={handleColorfulChange}
              disableAlpha={true}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
              <TabsTrigger value="oklch">OKLCH</TabsTrigger>
              <TabsTrigger value="lch">LCH</TabsTrigger>
            </TabsList>

            <TabsContent value="hex" className="space-y-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="#000000"
                className="font-mono text-sm"
                disabled={disabled}
              />
            </TabsContent>

            <TabsContent value="rgb" className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">R</Label>
                  <Input
                    type="number"
                    value={colorValues.rgb.r}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.rgb, r: Number(e.target.value) },
                        "rgb",
                      )
                    }
                    min="0"
                    max="255"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">G</Label>
                  <Input
                    type="number"
                    value={colorValues.rgb.g}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.rgb, g: Number(e.target.value) },
                        "rgb",
                      )
                    }
                    min="0"
                    max="255"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">B</Label>
                  <Input
                    type="number"
                    value={colorValues.rgb.b}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.rgb, b: Number(e.target.value) },
                        "rgb",
                      )
                    }
                    min="0"
                    max="255"
                    className="text-xs"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">H</Label>
                  <Input
                    type="number"
                    value={colorValues.hsl.h}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.hsl, h: Number(e.target.value) },
                        "hsl",
                      )
                    }
                    min="0"
                    max="360"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">S</Label>
                  <Input
                    type="number"
                    value={colorValues.hsl.s}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.hsl, s: Number(e.target.value) },
                        "hsl",
                      )
                    }
                    min="0"
                    max="100"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">L</Label>
                  <Input
                    type="number"
                    value={colorValues.hsl.l}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.hsl, l: Number(e.target.value) },
                        "hsl",
                      )
                    }
                    min="0"
                    max="100"
                    className="text-xs"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="oklch" className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">L</Label>
                  <Input
                    type="number"
                    value={colorValues.oklch.l}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.oklch, l: Number(e.target.value) },
                        "oklch",
                      )
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">C</Label>
                  <Input
                    type="number"
                    value={colorValues.oklch.c}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.oklch, c: Number(e.target.value) },
                        "oklch",
                      )
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">H</Label>
                  <Input
                    type="number"
                    value={colorValues.oklch.h}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.oklch, h: Number(e.target.value) },
                        "oklch",
                      )
                    }
                    min="0"
                    max="360"
                    className="text-xs"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lch" className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">L</Label>
                  <Input
                    type="number"
                    value={colorValues.lch.l}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.lch, l: Number(e.target.value) },
                        "lch",
                      )
                    }
                    min="0"
                    max="100"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">C</Label>
                  <Input
                    type="number"
                    value={colorValues.lch.c}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.lch, c: Number(e.target.value) },
                        "lch",
                      )
                    }
                    min="0"
                    max="150"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">H</Label>
                  <Input
                    type="number"
                    value={colorValues.lch.h}
                    onChange={(e) =>
                      handleColorSpaceChange(
                        { ...colorValues.lch, h: Number(e.target.value) },
                        "lch",
                      )
                    }
                    min="0"
                    max="360"
                    className="text-xs"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-8 gap-2">
            {quickColors.map((quickColor) => (
              <button
                key={quickColor}
                type="button"
                className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: quickColor }}
                onClick={() => handleQuickColorClick(quickColor)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPickerInput;
