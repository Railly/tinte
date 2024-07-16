import React, { useState } from "react";
import { ThemeConfig, Palette } from "@/lib/core/types";
import { tokenToScopeMapping } from "@/lib/core/config";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { IconGenerate, IconRandom, IconSpace, IconSparkles } from "./ui/icons";
import { hexToRgba } from "@uiw/react-color";
import { SimplifiedTokenEditor } from "./simplified-token-editor";

interface ConfigurationProps {
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  colorPickerShouldBeHighlighted: {
    key: string;
    value: boolean;
  };
  onGenerateTheme: (description: string) => void;
  advancedMode: boolean;
}

function calculateProgression(
  startColor: string,
  endColor: string,
  steps: number
): string[] {
  const startRgba = hexToRgba(startColor);
  const endRgba = hexToRgba(endColor);

  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const r = Math.round(startRgba.r + (endRgba.r - startRgba.r) * t);
    const g = Math.round(startRgba.g + (endRgba.g - startRgba.g) * t);
    const b = Math.round(startRgba.b + (endRgba.b - startRgba.b) * t);
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  });
}

function adjustUIProgression(
  palette: Palette,
  mode: "light" | "dark"
): Palette {
  const steps = 8;

  let progression: string[];

  if (mode === "dark") {
    progression = calculateProgression(palette.text, palette.background, steps);
  } else {
    progression = calculateProgression(palette.background, palette.text, steps);
  }

  const safeProgression = [
    ...progression,
    ...Array(8).fill(progression[progression.length - 1] || "#000000"),
  ].slice(0, 8);

  return {
    ...palette,
    text: safeProgression[0],
    "text-2": safeProgression[1],
    "text-3": safeProgression[2],
    "interface-3": safeProgression[3],
    "interface-2": safeProgression[4],
    interface: safeProgression[5],
    "background-2": safeProgression[6],
    background: safeProgression[7],
  };
}

export const Configuration: React.FC<ConfigurationProps> = ({
  themeConfig,
  currentTheme,
  onPaletteColorChange,
  colorPickerShouldBeHighlighted,
  advancedMode,
  onGenerateTheme,
}) => {
  const shouldHighlight = (tokenType: string) => {
    for (const [key, scopes] of Object.entries(tokenToScopeMapping)) {
      if (
        Array.isArray(scopes) &&
        scopes.includes(colorPickerShouldBeHighlighted.key)
      ) {
        return (
          themeConfig.tokenColors[key as keyof typeof tokenToScopeMapping] ===
            tokenType && colorPickerShouldBeHighlighted.value
        );
      } else if (scopes === tokenType) {
        return (
          themeConfig.tokenColors[key as keyof typeof tokenToScopeMapping] ===
            tokenType && colorPickerShouldBeHighlighted.value
        );
      }
    }
    return false;
  };

  const isUIColor = (colorKey: string) => {
    return [
      "background",
      "background-2",
      "interface",
      "interface-2",
      "interface-3",
      "text",
      "text-2",
      "text-3",
    ].includes(colorKey);
  };

  const orderedKeys = [
    "primary",
    "secondary",
    "ui-progression",
    "accent",
    "accent-2",
    "accent-3",
    "text",
    "text-2",
    "text-3",
    "interface",
    "interface-2",
    "interface-3",
    "background",
    "background-2",
  ];

  const [themeDescription, setThemeDescription] = useState("");

  const handleUIProgressionChange = (value: string) => {
    const updatedPalette = adjustUIProgression(
      themeConfig.palette[currentTheme],
      currentTheme
    );
    Object.entries(updatedPalette).forEach(([key, value]) => {
      if (isUIColor(key)) {
        onPaletteColorChange(key as keyof Palette, value);
      }
    });
  };

  return (
    <div className="h-max w-full overflow-y-auto">
      <div className="border rounded-md mb-2">
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">Color Palette</h2>
          <Button
            className="pr-1"
            variant="outline"
            onClick={() => onGenerateTheme(themeDescription)}
          >
            <IconRandom />
            <span className="ml-2">Shuffle</span>
            <span className="ml-4 hidden md:flex items-center border py-0.5 px-1 rounded-md">
              <kbd className="text-xs">Space</kbd>
              <IconSpace className="w-4 h-4 ml-1" />
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {orderedKeys.map((key, index) => {
            if (key === "") {
              return <div key={`empty-${index}`} />;
            }

            if (key === "ui-progression") {
              return (
                <SimplifiedTokenEditor
                  key={key}
                  colorKey={key}
                  colorValue={themeConfig.palette[currentTheme].background}
                  onColorChange={handleUIProgressionChange}
                  advancedMode={advancedMode}
                  isUIColor={true}
                  isProgressionToken={true}
                />
              );
            }

            const colorValue =
              themeConfig.palette[currentTheme][key as keyof Palette];

            return (
              <SimplifiedTokenEditor
                key={key}
                colorKey={key}
                shouldHighlight={shouldHighlight(key)}
                colorValue={colorValue}
                onColorChange={(value) =>
                  onPaletteColorChange(key as keyof Palette, value)
                }
                advancedMode={advancedMode}
                isUIColor={isUIColor(key)}
              />
            );
          })}
        </div>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">Theme Generator</h2>
          <Button
            variant="outline"
            onClick={() => onGenerateTheme(themeDescription)}
          >
            <IconGenerate />
            <span className="ml-2">Generate Theme</span>
          </Button>
        </div>

        <div className="p-2 relative">
          <Textarea
            placeholder="Describe your theme here..."
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            className="resize-none w-full !h-32 !pb-10"
            minLength={3}
            maxLength={150}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="absolute bottom-4 left-4 text-muted-foreground hover:text-foreground"
          >
            <IconSparkles className="w-4 h-4 mr-1" />
            Enhance Prompt
          </Button>
          <span className="absolute bottom-4 right-4 text-muted-foreground text-sm">
            {themeDescription.length}/150
          </span>
        </div>
      </div>
    </div>
  );
};
