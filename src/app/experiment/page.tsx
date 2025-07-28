'use client';

import { useState } from 'react';
import { raysoPresets } from '@/utils/rayso-presets';
import { raysoToShadcn } from '@/lib/rayso-to-shadcn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExperimentPage() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const currentRayso = raysoPresets[selectedTheme];
  const convertedTheme = raysoToShadcn(currentRayso);
  const currentTokens = convertedTheme[mode];

  const applyTheme = (tokens: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const handleApplyTheme = () => {
    applyTheme(currentTokens);
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
      </div>
    </div>
  );

  const ThemePreview = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Nested Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is how muted text looks in this theme.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm">Text colors:</div>
          <div className="text-foreground">Foreground text</div>
          <div className="text-muted-foreground">Muted foreground</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rayso to shadcn Theme Converter</h1>
        <div className="flex gap-2">
          <Button
            variant={mode === 'light' ? 'default' : 'outline'}
            onClick={() => setMode('light')}
          >
            Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'default' : 'outline'}
            onClick={() => setMode('dark')}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {raysoPresets.map((preset, index) => (
              <Button
                key={index}
                variant={selectedTheme === index ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedTheme(index)}
              >
                {preset.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Original Rayso Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Original Rayso ({mode})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(currentRayso[mode]).map(([key, value]) => (
              <ColorSwatch key={key} name={key} value={value} />
            ))}
          </CardContent>
        </Card>

        {/* Converted shadcn Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              shadcn Tokens ({mode})
              <Button size="sm" onClick={handleApplyTheme}>
                Apply Theme
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(currentTokens).map(([key, value]) => (
              <ColorSwatch key={key} name={key} value={value} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Theme Preview */}
      <ThemePreview />

      {/* Raw Data */}
      <Tabs defaultValue="rayso" className="w-full">
        <TabsList>
          <TabsTrigger value="rayso">Rayso Raw</TabsTrigger>
          <TabsTrigger value="shadcn">shadcn Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="rayso">
          <Card>
            <CardHeader>
              <CardTitle>Raw Rayso Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                {JSON.stringify(currentRayso, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shadcn">
          <Card>
            <CardHeader>
              <CardTitle>Converted shadcn Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                {JSON.stringify(convertedTheme, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}