"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/shared/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateTailwindPalette,
  type PaletteColor,
} from "@/lib/colors";

export function PaletteExtractor() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [hasInitialPalette, setHasInitialPalette] = useState(false);

  const generatePalette = (color: string) => {
    try {
      const generatedPalette = generateTailwindPalette(color);
      setPalette(generatedPalette);
      if (!hasInitialPalette) {
        setHasInitialPalette(true);
      }
    } catch (error) {
      console.error("Error generating palette:", error);
    }
  };

  const handleGeneratePalette = () => {
    generatePalette(baseColor);
  };

  // Auto-generate palette when base color changes (real-time)
  useEffect(() => {
    if (hasInitialPalette) {
      generatePalette(baseColor);
    }
  }, [baseColor, hasInitialPalette, generatePalette]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tailwind CSS 4 Palette Generator</CardTitle>
            <ThemeSwitcher />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-input">Base Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color-input"
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="font-mono flex-1"
                  />
                  <div
                    className="w-12 h-10 rounded border"
                    style={{ backgroundColor: baseColor }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGeneratePalette} className="w-full">
                Generate Palette
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {palette.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {palette.map((color) => (
                    <div
                      key={color.name}
                      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => copyToClipboard(color.value)}
                    >
                      <div
                        className="w-20 h-20 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-muted-foreground">
                          {color.name}
                        </div>
                        <code className="text-xs font-mono text-foreground block mt-1">
                          {color.value}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
                  <CardTitle className="text-lg">
                    Light Mode Suitability
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {palette.map((color) => (
                    <div
                      key={`${color.name}-light`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white border"
                    >
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {color.name}
                          </span>
                          <Badge
                            variant={
                              color.accessibility.textOnWhite
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {color.contrast.white.toFixed(1)}:1
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {color.accessibility.textOnWhite
                            ? "Good for text"
                            : "Poor readability"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-900 border border-gray-600 rounded" />
                  <CardTitle className="text-lg">
                    Dark Mode Suitability
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {palette.map((color) => (
                    <div
                      key={`${color.name}-dark`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-900 border border-gray-700"
                    >
                      <div
                        className="w-8 h-8 rounded border border-gray-600"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-100">
                            {color.name}
                          </span>
                          <Badge
                            variant={
                              color.accessibility.textOnBlack
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {color.contrast.black.toFixed(1)}:1
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">
                          {color.accessibility.textOnBlack
                            ? "Good for text"
                            : "Poor readability"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {palette.map((color) => (
                  <div
                    key={`${color.name}-details`}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{color.name}</span>
                      <Badge
                        variant={
                          color.accessibility.level === "AAA"
                            ? "default"
                            : color.accessibility.level === "AA"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {color.accessibility.level}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Luminance: {color.luminance.toFixed(3)}</div>
                      <div>
                        Contrast vs White: {color.contrast.white.toFixed(2)}
                      </div>
                      <div>
                        Contrast vs Black: {color.contrast.black.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
