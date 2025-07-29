'use client';

import { useState } from 'react';
import { raysoPresets } from '@/utils/rayso-presets';
import { defaultPresets } from '@/utils/tweakcn-presets';
import { tweakcnToTinte } from '@/lib/tweakcn-to-tinte';
import { tinteToVSCode } from '@/lib/tinte-to-vscode';
import { TinteTheme } from '@/types/tinte';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodePreview } from '@/components/code-preview';
import { MonacoEditorPreview } from '@/components/monaco-editor-preview';

const sampleCode = {
  typescript: `// TypeScript Example
import { NextRequest } from "next/server";
import { validateWebhookSignature } from "@polar-sh/sdk";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("polar-signature");

  if (
    !validateWebhookSignature(
      body,
      signature,
      process.env.POLAR_WEBHOOK_SECRET!
    )
  ) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case "subscription.created":
      // Handle new subscription
      console.log("New subscriber:", event.data);
      break;
    case "subscription.cancelled":
      // Handle cancellation
      console.log("Subscription cancelled:", event.data);
      break;
  }

  return new Response("OK");
}
`,
  javascript: `// JavaScript Example
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    get value() {
      return count;
    },
    reset: () => {
      count = initialValue;
    }
  };
}

const counter = createCounter(5);
console.log(counter.value); // 5
counter.increment();
console.log(counter.value); // 6

// Async/await example
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    
    return {
      ...userData,
      isOnline: Math.random() > 0.5
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to load user');
  }
}`,

  python: `# Python Example
from typing import List, Optional, Dict
import asyncio
import json

class DataProcessor:
    def __init__(self, config: Dict[str, any]):
        self.config = config
        self.processed_items = []
    
    async def process_data(self, items: List[str]) -> List[Dict]:
        """Process a list of items asynchronously"""
        tasks = [self._process_item(item) for item in items]
        results = await asyncio.gather(*tasks)
        
        # Filter out None results
        valid_results = [r for r in results if r is not None]
        self.processed_items.extend(valid_results)
        
        return valid_results
    
    async def _process_item(self, item: str) -> Optional[Dict]:
        try:
            # Simulate async processing
            await asyncio.sleep(0.1)
            
            if len(item) < 3:
                return None
                
            return {
                'original': item,
                'processed': item.upper(),
                'length': len(item),
                'timestamp': asyncio.get_event_loop().time()
            }
        except Exception as e:
            print(f"Error processing {item}: {e}")
            return None

# Usage example
async def main():
    processor = DataProcessor({'batch_size': 10})
    items = ['hello', 'world', 'python', 'async', 'await']
    
    results = await processor.process_data(items)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    asyncio.run(main())`,

  json: `{
  "name": "rayso-to-vscode-theme",
  "version": "1.0.0",
  "description": "A beautiful theme converted from Rayso format",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.7.0",
    "shiki": "^3.8.1",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "tailwindcss": "^3.0.0"
  },
  "keywords": [
    "theme",
    "vscode",
    "rayso",
    "syntax-highlighting"
  ],
  "author": "Theme Generator",
  "license": "MIT"
}`
};

export default function VSCodePage() {
  const [sourceType, setSourceType] = useState<'rayso' | 'tweakcn'>('rayso');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedTweakcnTheme, setSelectedTweakcnTheme] = useState('modern-minimal');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<keyof typeof sampleCode>('typescript');
  const [previewType, setPreviewType] = useState<'shiki' | 'monaco'>('shiki');

  // Get current theme based on source type
  const getCurrentTheme = () => {
    if (sourceType === 'rayso') {
      const tinteTheme: TinteTheme = {
        light: raysoPresets[selectedTheme].light,
        dark: raysoPresets[selectedTheme].dark
      };
      return tinteToVSCode(tinteTheme, raysoPresets[selectedTheme].name);
    } else {
      const tweakcnTheme = {
        light: defaultPresets[selectedTweakcnTheme as keyof typeof defaultPresets].styles.light,
        dark: defaultPresets[selectedTweakcnTheme as keyof typeof defaultPresets].styles.dark
      };
      const convertedRayso: TinteTheme = tweakcnToTinte(tweakcnTheme);
      const themeName = defaultPresets[selectedTweakcnTheme as keyof typeof defaultPresets].label;
      return tinteToVSCode(convertedRayso, `${themeName} (from TweakCN)`);
    }
  };

  const vsCodeThemes = getCurrentTheme();
  const currentVSCodeTheme = vsCodeThemes[mode];

  const downloadTheme = () => {
    const themeData = JSON.stringify(currentVSCodeTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentVSCodeTheme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rayso → VS Code Theme Generator</h1>
          <p className="text-muted-foreground">
            Convert Rayso themes to VS Code format with live preview
          </p>
        </div>
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

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Type</label>
          <Select value={sourceType} onValueChange={(value: 'rayso' | 'tweakcn') => setSourceType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rayso">Direct Rayso</SelectItem>
              <SelectItem value="tweakcn">TweakCN → Rayso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          {sourceType === 'rayso' ? (
            <Select value={selectedTheme.toString()} onValueChange={(value) => setSelectedTheme(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {raysoPresets.map((preset, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select value={selectedTweakcnTheme} onValueChange={setSelectedTweakcnTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(defaultPresets).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={(value: keyof typeof sampleCode) => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preview Type</label>
          <Select value={previewType} onValueChange={(value: 'shiki' | 'monaco') => setPreviewType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shiki">Shiki</SelectItem>
              <SelectItem value="monaco">Monaco Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {currentVSCodeTheme.displayName} - {language.toUpperCase()} Preview
            </CardTitle>
            <Button onClick={downloadTheme}>
              💾 Download VS Code Theme
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {previewType === 'shiki' ? (
            <CodePreview
              code={sampleCode[language]}
              language={language}
              theme={currentVSCodeTheme}
              className="min-h-[400px]"
            />
          ) : (
            <MonacoEditorPreview
              code={sampleCode[language]}
              language={language}
              theme={currentVSCodeTheme}
              height="500px"
            />
          )}
        </CardContent>
      </Card>

      {/* Theme Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>VS Code Colors ({mode})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(currentVSCodeTheme.colors).slice(0, 20).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 rounded border text-sm">
                  <div
                    className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs">{key}</div>
                    <div className="font-mono text-xs text-muted-foreground">{value}</div>
                  </div>
                </div>
              ))}
              {Object.keys(currentVSCodeTheme.colors).length > 20 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  ... and {Object.keys(currentVSCodeTheme.colors).length - 20} more colors
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Colors Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentVSCodeTheme.tokenColors.slice(0, 15).map((token, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded border text-sm">
                  <div
                    className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: token.settings.foreground }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs">{token.name}</div>
                    <div className="font-mono text-xs text-muted-foreground truncate">
                      {Array.isArray(token.scope) ? token.scope.join(', ') : token.scope}
                    </div>
                  </div>
                </div>
              ))}
              {currentVSCodeTheme.tokenColors.length > 15 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  ... and {currentVSCodeTheme.tokenColors.length - 15} more token rules
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raw Theme Data */}
      <Tabs defaultValue="theme" className="w-full">
        <TabsList>
          <TabsTrigger value="theme">VS Code Theme JSON</TabsTrigger>
          <TabsTrigger value="comparison">Source Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Generated VS Code Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                {JSON.stringify(currentVSCodeTheme, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {sourceType === 'rayso' ? 'Original Rayso' : 'Converted Rayso (from TweakCN)'} ({mode})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                  {JSON.stringify(
                    sourceType === 'rayso'
                      ? raysoPresets[selectedTheme][mode]
                      : tweakcnToTinte({
                        light: defaultPresets[selectedTweakcnTheme as keyof typeof defaultPresets].styles.light,
                        dark: defaultPresets[selectedTweakcnTheme as keyof typeof defaultPresets].styles.dark
                      })[mode],
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VS Code Theme ({mode})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded">
                  {JSON.stringify({
                    colors: currentVSCodeTheme.colors,
                    tokenColors: currentVSCodeTheme.tokenColors.slice(0, 10)
                  }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}