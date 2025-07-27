'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowUp, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kind, PastedItem, detectKind } from '@/lib/input-detection';
import { usePastedItems } from '@/hooks/use-pasted-items';
import { usePalette } from '@/hooks/use-palette';
import { PastedItemsList } from './pasted-items-list';
import { PaletteControls } from './palette-controls';
import { PalettePreview } from './palette-preview';
import { PasteDialog } from './paste-dialog';
import { ShadcnIcon } from '@/components/shared/icons/shadcn';
import { VSCodeIcon } from '@/components/shared/icons/vscode';
import { TailwindIcon } from '@/components/shared/icons/tailwind';
import { CSSIcon } from '@/components/shared/icons/css';

interface HeroInputDockProps {
  onSubmit?: (kind: Kind, raw: string) => void;
}

export default function HeroInputDock({
  onSubmit,
}: HeroInputDockProps) {
  const [prompt, setPrompt] = useState('');
  const [shadcnEnabled, setShadcnEnabled] = useState(true);
  const [vscodeEnabled, setVscodeEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'url' | 'tailwind' | 'cssvars'>('url');
  const [editingItem, setEditingItem] = useState<PastedItem | null>(null);
  const { pastedItems, addPastedItem, removePastedItem, updatePastedItem } = usePastedItems();
  const { base, setBase, ramp } = usePalette();

  function handlePaste(e: React.ClipboardEvent) {
    const clipboardData = e.clipboardData;

    // Check for images first
    const items = Array.from(clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          addPastedItem('Image', 'image', undefined, imageData);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
        return;
      }
    }

    // Handle text
    const pastedText = clipboardData.getData('text');
    if (!pastedText.trim()) return;

    // Detect the kind of content
    const detectedKind = detectKind(pastedText);
    
    // If it's a URL, CSS vars, Tailwind config, or palette, create a paste item
    if (['url', 'cssvars', 'tailwind', 'palette'].includes(detectedKind)) {
      addPastedItem(pastedText, detectedKind);
      e.preventDefault();
      return;
    }

    // If text is long (over 200 chars), add as pasted item
    if (pastedText.length >= 200) {
      addPastedItem(pastedText, 'prompt');
      e.preventDefault();
      return;
    }

    // For short text that's not special content, let default paste behavior happen
  }

  function submit() {
    const allContent = [
      ...pastedItems.map(item => item.content),
      prompt.trim()
    ].filter(Boolean).join('\n\n');

    if (!allContent) return;

    onSubmit?.('prompt', allContent);
  }

  function openDialog(type: 'url' | 'tailwind' | 'cssvars') {
    setDialogType(type);
    setDialogOpen(true);
  }

  function handleDialogSubmit(content: string, kind: Kind) {
    if (editingItem) {
      updatePastedItem(editingItem.id, content, kind);
      setEditingItem(null);
    } else {
      addPastedItem(content, kind);
    }
  }

  function handleEditItem(item: PastedItem) {
    if (['url', 'tailwind', 'cssvars'].includes(item.kind)) {
      setEditingItem(item);
      setDialogType(item.kind as 'url' | 'tailwind' | 'cssvars');
      setDialogOpen(true);
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingItem(null);
  }

  return (

    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative">
        <Textarea
          id="hero-input-dock"
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
          className="w-full resize-none pt-3 pb-14 pr-12"
          placeholder={
            pastedItems.length > 0
              ? "Add your prompt here..."
              : "vercel.com · { \"colors\": { ... } } · #0ea5e9 #111827 · sleek corporate dark"
          }
          aria-label="Theme input"
          spellCheck={false}
        />

        {/* Bottom controls inside textarea */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Toggle
            pressed={shadcnEnabled}
            onPressedChange={setShadcnEnabled}
            size="sm"
            className={`
              ${!shadcnEnabled ? 'grayscale opacity-50' : 'opacity-100'} 
              ${shadcnEnabled ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'}
              transition-all border p-0 min-w-8 w-8 h-8
            `}
            aria-label="Toggle Shadcn theme generation"
          >
            <ShadcnIcon className="size-4" />
          </Toggle>
          <Toggle
            pressed={vscodeEnabled}
            onPressedChange={setVscodeEnabled}
            size="sm"
            className={`
              ${!vscodeEnabled ? 'grayscale opacity-50' : 'opacity-100'} 
              ${vscodeEnabled ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'}
              transition-all border p-0 min-w-8 w-8 h-8
            `}
            aria-label="Toggle VSCode theme generation"
          >
            <VSCodeIcon className="size-4" />
          </Toggle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center w-8 h-8 p-0 rounded-md border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Plus className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => openDialog('url')} className="flex items-center gap-2">
                <Globe className="size-4" />
                Add web page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog('tailwind')} className="flex items-center gap-2">
                <TailwindIcon className="size-4" />
                Add Tailwind config
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog('cssvars')} className="flex items-center gap-2">
                <CSSIcon className="size-4" />
                Add globals.css
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Submit button */}
        <motion.button
          onClick={submit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 right-3 inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg bg-primary text-primary-foreground hover:opacity-95 transition-opacity"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      </motion.div>

      <PastedItemsList
        pastedItems={pastedItems}
        onRemoveItem={removePastedItem}
        onEditItem={handleEditItem}
      />

      {/* <PaletteControls
        base={base}
        setBase={setBase}
        ramp={ramp}
      /> */}

      {/* <PalettePreview ramp={ramp} /> */}

      <PasteDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        type={dialogType}
        onSubmit={handleDialogSubmit}
        editMode={!!editingItem}
        initialContent={editingItem?.content}
      />
    </>
  );
}