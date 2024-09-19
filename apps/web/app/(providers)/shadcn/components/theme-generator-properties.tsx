import React from "react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ColorPickerInput from "@/components/color-picker-input";
import { Theme } from "@/lib/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemeGeneratorPropertiesProps {
  shadcnTheme: Theme;
  setShadcnTheme: React.Dispatch<React.SetStateAction<Theme>>;
  copyCode: (format: "css" | "tailwind" | "json") => void;
}

const radiusValues = ["0", "0.3", "0.5", "0.75", "1.0"];

export function ThemeGeneratorProperties({
  shadcnTheme,
  setShadcnTheme,
  copyCode,
}: ThemeGeneratorPropertiesProps) {
  const { resolvedTheme } = useTheme();

  const handleColorChange =
    (key: keyof Theme["light"] | keyof Theme["dark"]) =>
    (color: { h: number; s: number; l: number; a: number }) => {
      setShadcnTheme((prev) => ({
        ...prev,
        [resolvedTheme === "dark" ? "dark" : "light"]: {
          ...prev[resolvedTheme === "dark" ? "dark" : "light"],
          [key]: color,
        },
      }));
    };

  const handleChartChange =
    (key: keyof Theme["charts"]["light"] | keyof Theme["charts"]["dark"]) =>
    (color: { h: number; s: number; l: number; a: number }) => {
      setShadcnTheme((prev) => ({
        ...prev,
        charts: {
          ...prev.charts,
          [resolvedTheme === "dark" ? "dark" : "light"]: {
            ...prev.charts[resolvedTheme === "dark" ? "dark" : "light"],
            [key]: color,
          },
        },
      }));
    };

  const currentTheme =
    resolvedTheme === "dark" ? shadcnTheme.dark : shadcnTheme.light;
  const currentChartTheme =
    resolvedTheme === "dark"
      ? shadcnTheme.charts.dark
      : shadcnTheme.charts.light;

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 pr-0.5">
        <div className="flex justify-between bg-muted px-4 py-1.5 items-center rounded-t-md w-full">
          <h2 className="text-sm font-bold">Properties</h2>
          <Button variant="outline" size="sm" onClick={() => copyCode("css")}>
            Copy Code
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          <div>
            <Label htmlFor="heading-font">Heading</Label>
            <Select
              value={shadcnTheme.fonts.heading}
              onValueChange={(value) =>
                setShadcnTheme((prev) => ({
                  ...prev,
                  fonts: { ...prev.fonts, heading: value },
                }))
              }
            >
              <SelectTrigger id="heading-font" disabled>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="opensans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="body-font">Body</Label>
            <Select
              value={shadcnTheme.fonts.body}
              onValueChange={(value) =>
                setShadcnTheme((prev) => ({
                  ...prev,
                  fonts: { ...prev.fonts, body: value },
                }))
              }
            >
              <SelectTrigger id="body-font" disabled>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="opensans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-4 pb-3">
          <Label className="text-xs">Radius (rem)</Label>
          <div className="flex gap-2 mt-1">
            {radiusValues.map((value) => (
              <Button
                key={value}
                variant={shadcnTheme.radius === value ? "default" : "outline"}
                size="sm"
                className="flex-1 px-0"
                onClick={() =>
                  setShadcnTheme((prev) => ({ ...prev, radius: value }))
                }
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold bg-muted px-4 py-2.5">
            Theme Colors
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-3">
            {Object.entries(currentTheme).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <Label className="text-xs">{key}</Label>
                <ColorPickerInput
                  color={value}
                  onChange={handleColorChange(key as keyof Theme["light"])}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold bg-muted px-4 py-2.5">
            Chart Colors
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-4">
            {Object.entries(currentChartTheme).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{key}</Label>
                <ColorPickerInput
                  color={value}
                  onChange={handleChartChange(
                    key as keyof Theme["charts"]["light"],
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
