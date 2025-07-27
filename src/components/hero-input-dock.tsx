'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Textarea } from '@/components/ui/textarea';
import { Kind, Swatch } from '@/lib/input-detection';
import { usePastedItems } from '@/hooks/use-pasted-items';
import { usePalette } from '@/hooks/use-palette';
import { PastedItemsList } from './pasted-items-list';
import { PaletteControls } from './palette-controls';
import { PalettePreview } from './palette-preview';

interface HeroInputDockProps {
  onSubmit?: (kind: Kind, raw: string) => void;
  onApplyPalette?: (ramp: Swatch[]) => void;
}

export default function HeroInputDock({
  onSubmit,
  onApplyPalette,
}: HeroInputDockProps) {
  const [prompt, setPrompt] = useState('');
  const { pastedItems, addPastedItem, removePastedItem } = usePastedItems();
  const { base, setBase, shift, setShift, ramp } = usePalette();

  function handlePaste(e: React.ClipboardEvent) {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText.trim()) return;

    addPastedItem(pastedText);
    e.preventDefault();
  }

  function submit() {
    const allContent = [
      ...pastedItems.map(item => item.content),
      prompt.trim()
    ].filter(Boolean).join('\n\n');

    if (!allContent) return;

    onSubmit?.('prompt', allContent);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl border bg-card/40 p-4 md:p-6 shadow-sm"
    >
      <div className="mb-2 text-sm text-muted-foreground">
        Paste a URL, tokens, or write a prompt
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={4}
        className="w-full resize-y"
        placeholder={
          pastedItems.length > 0
            ? "Add your prompt here..."
            : "vercel.com · { \"colors\": { ... } } · #0ea5e9 #111827 · sleek corporate dark"
        }
        aria-label="Theme input"
      />

      <PastedItemsList
        pastedItems={pastedItems}
        onRemoveItem={removePastedItem}
      />

      <div className="mt-3 flex items-center justify-end">
        <motion.button
          onClick={submit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-95 transition-opacity"
        >
          Generate
        </motion.button>
      </div>

      <PaletteControls
        base={base}
        setBase={setBase}
        shift={shift}
        setShift={setShift}
        ramp={ramp}
        onApplyPalette={onApplyPalette}
      />

      <PalettePreview ramp={ramp} />
    </motion.div>
  );
}