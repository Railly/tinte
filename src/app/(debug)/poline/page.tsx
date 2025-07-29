"use client"
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { TinteThemeSwitcher } from "@/components/shared/tinte-theme-switcher";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { useTinteTheme } from "@/stores/tinte-theme";
import { Poline } from "poline";
import { converter, formatHex, formatHsl, Hsl } from "culori";

const hexToHsl = (hex: string) => {
  const convert = converter('hsl');
  const hslColor = convert(hex);
  return hslColor;
};

const hslToHex = (hsl: Hsl | undefined): string | undefined => {
  if (!hsl) return undefined;
  const hexColor = formatHex({ mode: "hsl", h: hsl.h, s: hsl.s, l: hsl.l })
  return hexColor;
};


export default function PolinePage() {
  const { activeTheme, allThemes, handleThemeSelect, mounted } = useTinteTheme();
  
  const poline = new Poline({
    numPoints: 7,
    anchorColors: [
      [hexToHsl("#3a5894")?.h || 0, hexToHsl("#3a5894")?.s || 0, hexToHsl("#3a5894")?.l || 0],
      [hexToHsl("#be4578")?.h || 0, hexToHsl("#be4578")?.s || 0, hexToHsl("#be4578")?.l || 0],
      [hexToHsl("#000000")?.h || 0, hexToHsl("#000000")?.s || 0, hexToHsl("#000000")?.l || 0],
      [hexToHsl("#ffffff")?.h || 0, hexToHsl("#ffffff")?.s || 0, hexToHsl("#ffffff")?.l || 0],
    ],
  });

  poline.shiftHue(700);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Poline Color Generator</h1>
        <div className="flex items-center gap-4">
          <TinteThemeSwitcher
            themes={allThemes}
            activeId={activeTheme?.id}
            onSelect={handleThemeSelect}
            label="Select Theme"
          />
          <ThemeSwitcher variant="dual" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Poline Colors</h2>
          <div className="grid grid-cols-4 gap-4">
            {poline.colorsCSS.map((color, i) => (
              <div key={i} className="space-y-2">
                <ColorPickerInput
                  color={formatHex(color) || "#000000"}
                  onChange={() => { }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tinte Colors</h2>
          {activeTheme && (
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(activeTheme.colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <ColorPickerInput
                    color={value}
                    onChange={() => { }}
                  />
                  <p className="text-xs text-muted-foreground truncate">{key}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}