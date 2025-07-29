'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatHeader } from '@/components/shared/chat-header';
import { ProviderDesignPanel } from '@/components/shared/provider-design-panel';
import { popSeed } from '@/utils/anon-seed';
import { PROVIDERS, ThemeMode } from '@/lib/providers';
import type { SeedPayload, Attachment } from '@/utils/seed-mapper';
import { useTheme } from 'next-themes';
import { ThemeData as AppThemeData } from '@/lib/theme-applier';
import { useQueryState } from 'nuqs';
import { useThemeSystem } from '@/hooks/use-theme-system';


export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { setTheme } = useTheme();
  const { mounted, isDark, activeThemeRef, handleThemeSelect, allThemes } = useThemeSystem();
  const [seed, setSeed] = useState<SeedPayload | null>(null);
  const [split, setSplit] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});
  const [provider] = useQueryState('provider');

  useEffect(() => {
    const t = setTimeout(() => setSplit(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    params.then(({ id }) => {
      setChatId(id);
      setSeed(popSeed(id));
      setLoading(false);
    });
  }, [params]);


  const mode: ThemeMode = isDark ? 'dark' : 'light';

  const handleThemeSelectWithReset = useCallback((selectedTheme: AppThemeData) => {
    setEditedTokens({});
    handleThemeSelect(selectedTheme);
  }, [handleThemeSelect]);

  const currentTokens = useMemo(() => {
    if (typeof window === 'undefined') return {};

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const baseTokens = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
      'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring'
    ].reduce((acc, token) => {
      const value = computedStyle.getPropertyValue(`--${token}`).trim();
      if (value) acc[token] = value;
      return acc;
    }, {} as Record<string, string>);

    return { ...baseTokens, ...editedTokens };
  }, [editedTokens, mounted]);

  const currentProvider = provider ? PROVIDERS[provider] : PROVIDERS.shadcn;

  const handleTokenEdit = useCallback((key: string, value: string) => {
    setEditedTokens(prev => ({ ...prev, [key]: value }));

    // Apply token change immediately
    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.style.setProperty(`--${key}`, value);
    });
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader chatId={chatId} />

      <div className="flex">
        <motion.aside
          initial={{ width: '100%' }}
          animate={{ width: split ? 384 : '100%' }} // 24rem
          transition={{ type: 'spring', stiffness: 240, damping: 32 }}
          className="border-r border-border bg-background flex flex-col"
          style={{ willChange: 'width' }}
        >

          <Tabs defaultValue="chat" className="flex flex-col">
            <TabsList className="mx-3 mt-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex flex-1 flex-col mt-0">
              <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
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
                <div className="p-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">Reply box TODO…</div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="design" className="flex flex-col mt-0">
              <ProviderDesignPanel
                activeThemeRef={activeThemeRef}
                allThemes={allThemes}
                mode={mode}
                setTheme={setTheme}
                currentTokens={currentTokens}
                onTokenEdit={handleTokenEdit}
                onThemeSelect={handleThemeSelectWithReset}
              />
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
              className="size-full p-4 overflow-hidden"
            >
              <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_2.5rem)]">
                <currentProvider.Preview theme={activeThemeRef.current || allThemes[0]} mode={mode} />
              </ScrollArea>
            </motion.main>
          )}
        </AnimatePresence>
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