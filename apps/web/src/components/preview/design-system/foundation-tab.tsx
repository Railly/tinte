"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DesignSystemOutput } from "@tinte/providers";
import type { TinteBlock } from "@tinte/core";
import { TypographySection } from "./typography-section";

interface FoundationTabProps {
  theme: DesignSystemOutput;
  currentColors: TinteBlock;
}

export function FoundationTab({ theme, currentColors }: FoundationTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Typography</CardTitle>
          <CardDescription>Font hierarchy and text styles</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <TypographySection theme={theme} />

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Special Text</h3>
            <Alert>
              <AlertDescription>
                This is a blockquote-style alert for quoted content.
              </AlertDescription>
            </Alert>
            <Card
              className="p-3"
              style={{ backgroundColor: currentColors.bg_2 }}
            >
              <pre
                className="text-sm font-mono"
                style={{ color: currentColors.tx }}
              >
                {theme.typography.code.sample}
              </pre>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Colors</CardTitle>
          <CardDescription>Color palette and variables</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-lg overflow-hidden border">
              {theme.colors.primary.colors.map((color, i) => (
                <div
                  key={i}
                  className="aspect-video p-4 flex flex-col justify-end text-white"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="space-y-0.5">
                    <div className="text-lg font-semibold">{color.name}</div>
                    <div className="text-xs opacity-90">
                      <div>HEX - {color.hex}</div>
                      <div>RGB - ({color.rgb})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">CSS Variables</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                {
                  name: "Background",
                  class: "bg-background",
                  text: "text-foreground",
                },
                {
                  name: "Card",
                  class: "bg-card",
                  text: "text-card-foreground",
                },
                {
                  name: "Primary",
                  class: "bg-primary",
                  text: "text-primary-foreground",
                },
                {
                  name: "Secondary",
                  class: "bg-secondary",
                  text: "text-secondary-foreground",
                },
                {
                  name: "Muted",
                  class: "bg-muted",
                  text: "text-muted-foreground",
                },
                {
                  name: "Accent",
                  class: "bg-accent",
                  text: "text-accent-foreground",
                },
                {
                  name: "Destructive",
                  class: "bg-destructive",
                  text: "text-destructive-foreground",
                },
                {
                  name: "Border",
                  class: "bg-border",
                  text: "text-foreground",
                },
              ].map((color, i) => (
                <Card key={i} className={`${color.class} ${color.text}`}>
                  <CardContent className="p-3 space-y-1">
                    <h4 className="font-medium text-sm">{color.name}</h4>
                    <p className="text-xs font-mono opacity-70">{color.class}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Spacing</CardTitle>
          <CardDescription>Padding, margin, and gap system</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Padding</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "p-1", class: "p-1", size: "4px" },
                { name: "p-2", class: "p-2", size: "8px" },
                { name: "p-4", class: "p-4", size: "16px" },
                { name: "p-6", class: "p-6", size: "24px" },
              ].map((space, i) => (
                <div key={i} className="space-y-1">
                  <div className="bg-muted rounded">
                    <div
                      className={`bg-primary text-primary-foreground rounded text-center text-xs ${space.class}`}
                    >
                      {space.name}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {space.size}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Gap</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "gap-2", class: "gap-2", size: "8px" },
                { name: "gap-4", class: "gap-4", size: "16px" },
              ].map((space, i) => (
                <div key={i} className="space-y-1">
                  <div className={`flex ${space.class}`}>
                    <div className="bg-primary text-primary-foreground p-2 rounded text-xs">
                      Item 1
                    </div>
                    <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
                      Item 2
                    </div>
                    <div className="bg-accent text-accent-foreground p-2 rounded text-xs">
                      Item 3
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {space.name} ({space.size})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold">Borders</CardTitle>
          <CardDescription>Border widths and radius</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Widths</h3>
            <div className="space-y-2">
              <Card className="border">
                <CardContent className="p-3">
                  <div className="font-mono text-xs">border (1px)</div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-3">
                  <div className="font-mono text-xs">border-2 (2px)</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Radius</h3>
            <div className="space-y-2">
              <Card className="rounded-sm border">
                <CardContent className="p-3">
                  <div className="font-mono text-xs">rounded-sm</div>
                </CardContent>
              </Card>
              <Card className="rounded-lg border">
                <CardContent className="p-3">
                  <div className="font-mono text-xs">rounded-lg</div>
                </CardContent>
              </Card>
              <Card className="rounded-full border">
                <CardContent className="p-3">
                  <div className="font-mono text-xs text-center">
                    rounded-full
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
