'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatHeader } from '@/components/shared/chat-header';
import { popSeed } from '@/utils/anon-seed';
import { tintePresets } from '@/utils/tinte-presets';
import { raysoPresets } from '@/utils/rayso-presets';
import { defaultPresets } from '@/utils/tweakcn-presets';
import { tinteToShadcn } from '@/lib/tinte-to-shadcn';
import { tweakcnToTinte } from '@/lib/tweakcn-to-tinte';
import { PROVIDERS, ThemeSpec, ThemeMode, ThemeDensity } from '@/lib/providers';
import type { SeedPayload, Attachment } from '@/utils/seed-mapper';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [seed, setSeed] = useState<SeedPayload | null>(null);
  const [split, setSplit] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('tinte-0');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [density, setDensity] = useState<ThemeDensity>('comfort');
  const [activeProvider, setActiveProvider] = useState('shadcn');
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    params.then(({ id }) => {
      setChatId(id);
      setSeed(popSeed(id));
      setLoading(false);
    });
  }, [params]);
  useEffect(() => {
    const t = setTimeout(() => setSplit(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const allThemes = [
    ...tintePresets.map((theme, index) => ({ id: `tinte-${index}`, name: theme.name, theme, type: 'tinte' as const })),
    ...raysoPresets.map((theme, index) => ({ id: `rayso-${index}`, name: theme.name, theme, type: 'rayso' as const })),
    ...Object.entries(defaultPresets).map(([key, preset]) => ({
      id: `tweakcn-${key}`,
      name: preset.label,
      theme: preset.styles,
      type: 'tweakcn' as const
    }))
  ];

  const currentThemeData = allThemes.find(t => t.id === selectedTheme) || allThemes[0];

  const getConvertedTheme = () => {
    switch (currentThemeData.type) {
      case 'tinte':
        return tinteToShadcn(currentThemeData.theme);
      case 'rayso':
        return tinteToShadcn(currentThemeData.theme);
      case 'tweakcn':
        const tinte = tweakcnToTinte(currentThemeData.theme);
        return tinteToShadcn(tinte);
      default:
        return { light: {}, dark: {} };
    }
  };

  const convertedTheme = getConvertedTheme();
  const currentTokens = { ...convertedTheme[mode], ...editedTokens };

  const themeSpec: ThemeSpec = {
    light: convertedTheme.light as any, // shadcn tokens to tinte mapping
    dark: convertedTheme.dark as any,   // will be handled by provider adapters
    meta: {
      name: currentThemeData.name,
      author: 'Tinte',
      version: '1.0.0'
    }
  };

  const currentProvider = PROVIDERS[activeProvider];

  const applyTheme = (tokens: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const handleTokenEdit = (key: string, value: string) => {
    const newTokens = { ...editedTokens, [key]: value };
    setEditedTokens(newTokens);
    applyTheme({ ...convertedTheme[mode], ...newTokens });
  };

  const handleApplyTheme = () => {
    applyTheme(currentTokens);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader chatId={chatId} />

      <div className="flex-1 flex">
        <motion.aside
          initial={{ width: '100%' }}
          animate={{ width: split ? 384 : '100%' }} // 24rem
          transition={{ type: 'spring', stiffness: 240, damping: 32 }}
          className="border-r border-border bg-background flex flex-col"
        >

          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="mx-3 mt-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-sm text-muted-foreground">Loading chat...</div>
                    </div>
                  ) : (
                    <>
                      {seed?.content && (
                        <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground p-3 ml-auto">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{seed.content}</p>
                        </div>
                      )}
                      {seed?.attachments?.length ? (
                        <div className="space-y-3">
                          {seed.attachments.map((att) => <AttachmentBubble key={att.id} att={att} />)}
                        </div>
                      ) : null}
                      {!seed && (
                        <div className="text-xs text-muted-foreground text-center py-8">
                          No draft found. (Anon mode, no persistence yet.)
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border">
                <div className="text-xs text-muted-foreground">Reply box TODO…</div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="flex-1 flex flex-col mt-0">
              <div className="flex-1 flex">
                <ProviderDesignPanel
                  allThemes={allThemes}
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  mode={mode}
                  setMode={setMode}
                  density={density}
                  setDensity={setDensity}
                  activeProvider={activeProvider}
                  setActiveProvider={setActiveProvider}
                  currentTokens={currentTokens}
                  onTokenEdit={handleTokenEdit}
                  onApplyTheme={handleApplyTheme}
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.aside>

        <AnimatePresence>
          {split && (
            <motion.main
              key="preview"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className="flex-1 p-6 overflow-y-auto"
            >
              <div className="">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Theme Preview</h2>
                    <p className="text-sm text-muted-foreground">Live preview of {currentThemeData.name} theme in {mode} mode.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">Provider:</div>
                    <div className="flex rounded-lg border p-1">
                      {Object.entries(PROVIDERS).map(([id, provider]) => (
                        <button
                          key={id}
                          onClick={() => setActiveProvider(id)}
                          className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${activeProvider === id ? 'bg-muted' : 'hover:bg-muted/50'
                            }`}
                        >
                          <provider.icon className="w-4 h-4" />
                          {provider.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <currentProvider.Preview theme={themeSpec} mode={mode} density={density} />
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ThemePreview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UI Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>

          <div className="space-y-2">
            <Input placeholder="Type something..." />
            <div className="text-foreground">Primary text</div>
            <div className="text-muted-foreground">Muted text</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nested Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This nested card demonstrates how the theme colors work together across different surfaces and text elements.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded border">
              <div className="text-sm font-medium">Muted Background</div>
              <div className="text-xs text-muted-foreground mt-1">With muted text</div>
            </div>
            <div className="p-3 bg-accent text-accent-foreground rounded">
              <div className="text-sm font-medium">Accent Background</div>
              <div className="text-xs opacity-80 mt-1">With accent text</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-background border rounded text-center">background</div>
            <div className="p-2 bg-muted border rounded text-center">muted</div>
            <div className="p-2 bg-primary text-primary-foreground rounded text-center">primary</div>
            <div className="p-2 bg-secondary text-secondary-foreground rounded text-center">secondary</div>
            <div className="p-2 bg-accent text-accent-foreground rounded text-center">accent</div>
            <div className="p-2 bg-destructive text-destructive-foreground rounded text-center">destructive</div>
            <div className="p-2 border rounded text-center">border</div>
            <div className="p-2 bg-card border rounded text-center">card</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProviderDesignPanel({
  allThemes,
  selectedTheme,
  setSelectedTheme,
  mode,
  setMode,
  density,
  setDensity,
  activeProvider,
  setActiveProvider,
  currentTokens,
  onTokenEdit,
  onApplyTheme,
}: {
  allThemes: Array<{ id: string; name: string; theme: any; type: 'tinte' | 'rayso' | 'tweakcn' }>;
  selectedTheme: string;
  setSelectedTheme: (id: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  density: ThemeDensity;
  setDensity: (density: ThemeDensity) => void;
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  currentTokens: Record<string, string>;
  onTokenEdit: (key: string, value: string) => void;
  onApplyTheme: () => void;
}) {
  return (
    <div className="grid grid-cols-[60px,1fr] gap-4 flex-1">
      {/* Provider rail */}
      <aside className="flex flex-col gap-2 p-2 border-r">
        {Object.entries(PROVIDERS).map(([id, provider]) => (
          <button
            key={id}
            onClick={() => setActiveProvider(id)}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${activeProvider === id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
              }`}
            title={provider.title}
          >
            <provider.icon className="w-5 h-5" />
          </button>
        ))}
      </aside>

      {/* Main editor */}
      <div className="flex flex-col">
        {/* Controls */}
        <div className="p-3 space-y-3 border-b">
          <div className="flex gap-2">
            <Button
              variant={mode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              className="flex-1"
            >
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              className="flex-1"
            >
              Dark
            </Button>
          </div>

          {PROVIDERS[activeProvider]?.supports?.density && (
            <div className="flex gap-2">
              <Button
                variant={density === 'comfort' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDensity('comfort')}
                className="flex-1"
              >
                Comfort
              </Button>
              <Button
                variant={density === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDensity('compact')}
                className="flex-1"
              >
                Compact
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Theme</div>
            <ScrollArea className="h-32">
              <div className="space-y-1 pr-3">
                {allThemes.map((themeData) => (
                  <Button
                    key={themeData.id}
                    variant={selectedTheme === themeData.id ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => setSelectedTheme(themeData.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="truncate">{themeData.name}</span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase">
                        {themeData.type}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Button size="sm" onClick={onApplyTheme} className="w-full">
            Apply Theme
          </Button>
        </div>

        {/* Token editor */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Tokens ({mode})</div>
            {Object.entries(currentTokens).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-mono text-muted-foreground">{key}</div>
                <div className="flex gap-2">
                  <div
                    className="w-4 h-4 rounded border border-border flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: value }}
                  />
                  <Input
                    value={value}
                    onChange={(e) => onTokenEdit(key, e.target.value)}
                    className="h-6 text-xs font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function AttachmentBubble({ att }: { att: Attachment }) {
  switch (att.kind) {
    case 'image':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-2 mr-auto border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {att.imageData ? (
            <img src={att.imageData} alt="" className="rounded-md max-h-64 w-full object-cover" />
          ) : (
            <div className="text-xs text-muted-foreground p-4 text-center">[image omitted]</div>
          )}
        </div>
      );
    case 'palette':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-2">Color Palette</div>
          <div className="grid grid-cols-10 gap-1">
            {(att.colors ?? []).slice(0, 10).map((c, i) => (
              <div
                key={i}
                className="h-4 w-full rounded-sm border border-border/20 shadow-sm"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono truncate">
            {(att.colors ?? []).join(' ')}
          </div>
        </div>
      );
    case 'url':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-1">URL</div>
          <div className="text-sm break-all">{att.content}</div>
        </div>
      );
    case 'tailwind':
    case 'cssvars':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {att.kind === 'tailwind' ? 'Tailwind Config' : 'CSS Variables'}
          </div>
          <pre className="text-[10px] whitespace-pre-wrap text-muted-foreground bg-background/50 p-2 rounded border">
            {att.content}
          </pre>
        </div>
      );
    default:
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <pre className="text-[11px] whitespace-pre-wrap text-muted-foreground">{att.content}</pre>
        </div>
      );
  }
} 