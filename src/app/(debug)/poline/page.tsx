"use client"
import { ColorPickerInput } from "@/components/ui/color-picker-input";
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
  // const ga = hexToHsl("#000000")
  // const ga2 = hslToHex(ga)
  // console.log({ ga, ga2 })
  const poline = new Poline({
    numPoints: 7,
    anchorColors: [
      // [220, 0.44, 0.40],
      // [335, 0.48, 0.51],
      // #3a5894
      [hexToHsl("#3a5894")?.h || 0, hexToHsl("#3a5894")?.s || 0, hexToHsl("#3a5894")?.l || 0],
      [hexToHsl("#be4578")?.h || 0, hexToHsl("#be4578")?.s || 0, hexToHsl("#be4578")?.l || 0],
      [hexToHsl("#000000")?.h || 0, hexToHsl("#000000")?.s || 0, hexToHsl("#000000")?.l || 0],
      [hexToHsl("#ffffff")?.h || 0, hexToHsl("#ffffff")?.s || 0, hexToHsl("#ffffff")?.l || 0],
    ],
  });

  poline.shiftHue(700)

  return (
    <div className="grid grid-cols-5 gap-4 p-8">
      {poline.colorsCSS.map((color, i) => (
        <div key={i} className="space-y-2">
          <ColorPickerInput
            color={formatHex(color) || "#000000"}
            onChange={() => { }}
          />
        </div>
      ))}
    </div>
  );
}