'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { popSeed } from '@/utils/anon-seed';
import type { SeedPayload, Attachment } from '@/utils/seed-mapper';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [seed, setSeed] = useState<SeedPayload | null>(null);
  const [split, setSplit] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex">
      <motion.aside
        initial={{ width: '100%' }}
        animate={{ width: split ? 384 : '100%' }} // 24rem
        transition={{ type: 'spring', stiffness: 240, damping: 32 }}
        className="border-r border-border bg-background flex flex-col"
      >
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="font-medium text-sm truncate">Chat {chatId.slice(0, 8)}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Theme Preview</h2>
                <p className="text-sm text-muted-foreground">Appears after the first chat moment.</p>
              </div>
              <div className="grid gap-3">
                <div className="h-10 rounded-md border" />
                <div className="h-32 rounded-md border" />
                <div className="h-20 rounded-md border" />
              </div>
              {/* <DashboardPreview /> */}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
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