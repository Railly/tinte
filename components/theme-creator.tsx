'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';

const providers = [
  { id: 'vscode', name: 'VS Code', icon: '🎨', defaultChecked: true },
  { id: 'cursor', name: 'Cursor', icon: '⚡', defaultChecked: false },
  { id: 'zed', name: 'Zed', icon: '⚪', defaultChecked: false },
  { id: 'vim', name: 'Vim', icon: '📝', defaultChecked: false },
  { id: 'shadcn', name: 'shadcn/ui', icon: '🎪', defaultChecked: false },
];

export function ThemeCreator() {
  const [input, setInput] = useState('');
  const [selectedProviders, setSelectedProviders] = useState(
    new Set(providers.filter(p => p.defaultChecked).map(p => p.id))
  );

  const toggleProvider = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const handleGenerate = () => {
    if (!input.trim()) return;
    
    // TODO: Implement theme generation
    console.log('Generating themes for:', {
      input,
      providers: Array.from(selectedProviders)
    });
  };

  const placeholderText = `Describe the vibe, hexes, or import URL

Examples:
• "Dark cyberpunk theme with neon green accents"
• "#1a1a1a #00ff41 #ff0080 #00d4ff"
• "https://github.com/theme-repo"
• "Warm sunset colors, cozy and readable"`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ask Tinte to build…
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate beautiful themes for your favorite editors in seconds
        </p>
      </div>

      {/* Main Input Card */}
      <Card className="p-8 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
        <div className="space-y-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            className="min-h-[120px] text-base resize-none border-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
          
          {/* Provider Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Generate themes for:
              </h3>
              {selectedProviders.size === 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-600/20">
                  Select at least one provider
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {providers.map((provider) => (
                <Toggle
                  key={provider.id}
                  pressed={selectedProviders.has(provider.id)}
                  onPressedChange={() => toggleProvider(provider.id)}
                  className="h-auto p-4 flex-col gap-2 border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
                >
                  <span className="text-2xl">{provider.icon}</span>
                  <span className="text-sm font-medium">{provider.name}</span>
                </Toggle>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || selectedProviders.size === 0}
              size="lg"
              className="px-8 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Generate Themes ✨
            </Button>
          </div>
        </div>
      </Card>

      {/* Status/Results Area - Initially hidden */}
      {/* This will show generated themes and their status */}
    </div>
  );
}