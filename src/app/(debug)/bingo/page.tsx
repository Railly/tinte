"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import type { TinteBlock } from "@/types/tinte";
import { defaultPresets } from "@/utils/tweakcn-presets";

export default function BingoPage() {
  const [selectedTheme, setSelectedTheme] = useState("modern-minimal");
  const [mode, setMode] = useState<"light" | "dark">("light");

  const themeKeys = Object.keys(defaultPresets);
  const currentTweakcn = {
    light:
      defaultPresets[selectedTheme as keyof typeof defaultPresets].styles.light,
    dark: defaultPresets[selectedTheme as keyof typeof defaultPresets].styles
      .dark,
  };

  const convertedRayso = shadcnToTinte(currentTweakcn);
  const currentTokens = convertedRayso[mode];

  const applyTheme = (tokens: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      if (key.startsWith("#")) return; // Skip hex colors
      root.style.setProperty(`--${key}`, value);
    });
  };

  const handleApplyRayso = () => {
    const originalTokens = currentTweakcn[mode];
    applyTheme(originalTokens);
  };

  const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
    <div className="flex items-center gap-2 p-2 rounded border">
      <div
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: value }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-mono">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">{value}</div>
        <Input
          value={value}
          onChange={() => {}}
          className="mt-1 h-6 text-xs"
          readOnly
          onClick={(e) => {
            e.currentTarget.select();
            navigator.clipboard.writeText(value);
          }}
        />
      </div>
    </div>
  );

  const ThemePreview = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Theme Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nested Card Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Este es un ejemplo de texto con muted foreground que muestra cómo
              se ve el tema convertido.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Input example" />
              <Button size="sm">Action</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Typography Samples</Label>
            <div className="text-foreground text-lg font-semibold">
              Primary Text
            </div>
            <div className="text-muted-foreground">Muted text color</div>
            <div className="text-sm text-muted-foreground">
              Small muted text
            </div>
          </div>
          <div className="space-y-2">
            <Label>Interface Elements</Label>
            <div className="p-3 bg-muted rounded border">Muted background</div>
            <div className="p-3 bg-accent text-accent-foreground rounded">
              Accent background
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">TweakCN → Rayso Converter</h1>
          <p className="text-muted-foreground">
            Convierte temas de TweakCN al formato minimal de Rayso
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "light" ? "default" : "outline"}
            onClick={() => setMode("light")}
          >
            Light
          </Button>
          <Button
            variant={mode === "dark" ? "default" : "outline"}
            onClick={() => setMode("dark")}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle>TweakCN Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {themeKeys.map((key) => (
              <Button
                key={key}
                variant={selectedTheme === key ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedTheme(key)}
              >
                <div>
                  <div className="font-medium">
                    {defaultPresets[key as keyof typeof defaultPresets].label}
                  </div>
                  <div className="text-xs text-muted-foreground">{key}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Original TweakCN Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Original TweakCN ({mode})
              <Button size="sm" onClick={handleApplyRayso}>
                Apply Original
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(currentTweakcn[mode])
              .filter(
                ([key]) =>
                  !key.startsWith("font-") &&
                  !key.startsWith("shadow-") &&
                  key !== "radius" &&
                  key !== "spacing" &&
                  key !== "letter-spacing",
              )
              .map(([key, value]) => (
                <ColorSwatch key={key} name={key} value={value} />
              ))}
          </CardContent>
        </Card>

        {/* Converted Rayso Format */}
        <Card>
          <CardHeader>
            <CardTitle>Converted Rayso ({mode})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {/* Display tokens in Flexoki scale order */}
            {[
              // Flexoki continuous scale
              "background",
              "background_2",
              "interface",
              "interface_2",
              "interface_3",
              "text_3",
              "text_2",
              "text",
              // Accent system
              "primary",
              "accent",
              "accent_2",
              "accent_3",
              // Legacy
              "secondary",
            ].map((key) =>
              currentTokens[key as keyof TinteBlock] ? (
                <ColorSwatch
                  key={key}
                  name={key}
                  value={currentTokens[key as keyof TinteBlock]}
                />
              ) : null,
            )}
          </CardContent>
        </Card>
      </div>

      {/* Theme Preview */}
      <ThemePreview />

      {/* Comparison & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flexoki Continuous Scale</CardTitle>
            <p className="text-sm text-muted-foreground">
              bg → bg-2 → ui → ui-2 → ui-3 → tx-3 → tx-2 → tx
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Continuous Progression</h4>
              <div className="ml-2 space-y-1 text-xs">
                <div>
                  <strong>background (bg):</strong> Main surface{" "}
                  {mode === "light" ? "(lightest)" : "(darkest)"}
                </div>
                <div>
                  <strong>background_2 (bg-2):</strong> Secondary surfaces,
                  cards
                </div>
                <div>
                  <strong>interface (ui):</strong> Borders, separators
                </div>
                <div>
                  <strong>interface_2 (ui-2):</strong> Hovered borders
                </div>
                <div>
                  <strong>interface_3 (ui-3):</strong> Active borders, inputs
                </div>
                <div>
                  <strong>text_3 (tx-3):</strong> Faint text, comments
                </div>
                <div>
                  <strong>text_2 (tx-2):</strong> Muted text, punctuation
                </div>
                <div>
                  <strong>text (tx):</strong> Primary text{" "}
                  {mode === "light" ? "(darkest)" : "(lightest)"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Mode Behavior</h4>
              <div className="ml-2 space-y-1 text-xs">
                <div>
                  <strong>Light mode:</strong> bg (light) → tx (dark)
                </div>
                <div>
                  <strong>Dark mode:</strong> bg (dark) → tx (light)
                </div>
                <div className="text-muted-foreground">
                  Uses exponential curve for natural progression
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Distinct Accent Colors</h4>
              <div className="ml-2 space-y-1 text-xs">
                <div>
                  <strong>primary:</strong> Primary actions, links
                </div>
                <div>
                  <strong>accent:</strong> From secondary/accent tokens
                </div>
                <div>
                  <strong>accent_2:</strong> +60° hue rotation, alternative
                  actions
                </div>
                <div>
                  <strong>accent_3:</strong> Complementary/destructive (+180°
                  hue)
                </div>
                <div className="text-muted-foreground mt-1">
                  Uses chart colors when available for variety
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                const data = JSON.stringify(convertedRayso, null, 2);
                navigator.clipboard.writeText(data);
              }}
            >
              📋 Copy Rayso JSON
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const data = JSON.stringify(
                  {
                    name: defaultPresets[
                      selectedTheme as keyof typeof defaultPresets
                    ].label,
                    ...convertedRayso,
                  },
                  null,
                  2,
                );
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${selectedTheme}-rayso.json`;
                a.click();
              }}
            >
              💾 Download JSON
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Raw Data Tabs */}
      <Tabs defaultValue="tweakcn" className="w-full">
        <TabsList>
          <TabsTrigger value="tweakcn">TweakCN Raw</TabsTrigger>
          <TabsTrigger value="rayso">Rayso Raw</TabsTrigger>
          <TabsTrigger value="comparison">Side by Side</TabsTrigger>
        </TabsList>

        <TabsContent value="tweakcn">
          <Card>
            <CardHeader>
              <CardTitle>Original TweakCN Theme Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                {JSON.stringify(currentTweakcn, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rayso">
          <Card>
            <CardHeader>
              <CardTitle>Converted Rayso Format</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                {JSON.stringify(convertedRayso, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>TweakCN ({mode})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                  {JSON.stringify(currentTweakcn[mode], null, 2)}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rayso ({mode})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                  {JSON.stringify(currentTokens, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
