'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowUp, Globe, Image, Palette } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kind, PastedItem, detectKind } from '@/lib/input-detection';
import { usePastedItems } from '@/hooks/use-pasted-items';
import { usePalette } from '@/hooks/use-palette';
import { PastedItemsList } from './pasted-items-list';
import { PasteDialog } from './paste-dialog';
import { ShadcnIcon } from '@/components/shared/icons/shadcn';
import { VSCodeIcon } from '@/components/shared/icons/vscode';
import { TailwindIcon } from '@/components/shared/icons/tailwind';
import { CSSIcon } from '@/components/shared/icons/css';
import { generateTailwindPalette } from '@/lib/palette-generator';
import { cn } from '@/lib';
import { Button } from './ui/button';

interface HeroInputDockProps {
  onSubmit?: (kind: Kind, raw: string) => void;
}

interface PalettePreset {
  name: string;
  baseColor: string;
  description: string;
}

export default function HeroInputDock({
  onSubmit,
}: HeroInputDockProps) {
  const [prompt, setPrompt] = useState('');

  const presets = [
    {
      icon: "🏢",
      text: "Corporate Blue Theme",
      primaryColor: "#1e40af",
      neutralColor: "#64748b",
      backgroundColor: "#ffffff",
      prompt: "Create a professional corporate theme with trustworthy blue tones. Focus on accessibility, clean typography, and a business-appropriate aesthetic. Use blues ranging from navy to lighter shades, with neutral grays for balance. Ensure high contrast for readability and a polished, enterprise-ready appearance."
    },
    {
      icon: "🌅",
      text: "Warm Sunset Palette",
      primaryColor: "#f97316",
      neutralColor: "#a3a3a3",
      backgroundColor: "#fefefe",
      prompt: "Design a warm, inviting theme inspired by golden hour sunsets. Use rich oranges, warm yellows, and soft coral tones. Create a cozy, energetic feeling with gradients that evoke the beauty of a sunset sky. Include complementary warm neutrals and ensure the palette feels optimistic and welcoming."
    },
    {
      icon: "🌙",
      text: "Minimal Dark Mode",
      primaryColor: "#6366f1",
      neutralColor: "#71717a",
      backgroundColor: "#0f0f23",
      prompt: "Create an elegant, minimal dark theme with sophisticated gray tones. Focus on reducing eye strain with carefully balanced contrast ratios. Use deep grays as the foundation with subtle blue or purple undertones. Emphasize clean lines, ample whitespace, and a modern, sleek aesthetic perfect for extended use."
    },
    {
      icon: "⚡",
      text: "Vibrant Neon Colors",
      primaryColor: "#8b5cf6",
      neutralColor: "#737373",
      backgroundColor: "#0a0a0a",
      prompt: "Design an energetic, modern theme with vibrant neon-inspired colors. Use electric purples, bright magentas, and cyber-punk aesthetics. Create high-impact visuals with bold contrasts and glowing effects. Balance the intensity with darker backgrounds to make the neon colors pop while maintaining usability."
    },
    {
      icon: "🌿",
      text: "Natural Green Tones",
      primaryColor: "#10b981",
      neutralColor: "#78716c",
      backgroundColor: "#fafaf9",
      prompt: "Create a calming, nature-inspired theme with organic green tones. Use forest greens, sage, and mint colors that evoke growth, harmony, and sustainability. Include earthy neutrals and natural textures. Design for a peaceful, eco-friendly aesthetic that promotes focus and well-being."
    }
  ];

  const palettePresets: PalettePreset[] = [
    { name: "Ocean Blue", baseColor: "#0ea5e9", description: "Deep ocean vibes" },
    { name: "Forest Green", baseColor: "#10b981", description: "Natural forest tones" },
    { name: "Sunset Orange", baseColor: "#f97316", description: "Warm sunset colors" },
    { name: "Purple Magic", baseColor: "#8b5cf6", description: "Mystical purple shades" },
    { name: "Rose Pink", baseColor: "#ec4899", description: "Soft romantic pinks" },
    { name: "Steel Gray", baseColor: "#6b7280", description: "Modern neutral grays" }
  ];

  const [shadcnEnabled, setShadcnEnabled] = useState(true);
  const [vscodeEnabled, setVscodeEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'url' | 'tailwind' | 'cssvars' | 'palette'>('url');
  const [editingItem, setEditingItem] = useState<PastedItem | null>(null);
  const [customColor, setCustomColor] = useState('');
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { pastedItems, addPastedItem, removePastedItem, updatePastedItem, clearPastedItems } = usePastedItems();
  const { base, setBase, ramp } = usePalette();

  useEffect(() => {
    if (paletteDropdownOpen) {
      setTimeout(() => {
        colorInputRef.current?.focus();
      }, 100);
    }
  }, [paletteDropdownOpen]);

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

  function openDialog(type: 'url' | 'tailwind' | 'cssvars' | 'palette') {
    setDialogType(type);
    setDialogOpen(true);
  }

  function handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          addPastedItem(file.name, 'image', undefined, imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  function handleDialogSubmit(content: string, kind: Kind) {
    if (editingItem) {
      if (kind === 'palette') {
        // For palette editing, regenerate the palette with new base color
        setBase(content);
        const paletteColors = generateTailwindPalette(content);
        const colorsString = paletteColors.map(c => c.value).join(' ');
        updatePastedItem(editingItem.id, `Custom: ${colorsString}`, kind);
      } else {
        updatePastedItem(editingItem.id, content, kind);
      }
      setEditingItem(null);
    } else {
      if (kind === 'palette') {
        // For new palette items
        setBase(content);
        const paletteColors = generateTailwindPalette(content);
        const colorsString = paletteColors.map(c => c.value).join(' ');
        addPastedItem(`Custom: ${colorsString}`, kind, paletteColors.map(c => c.value));
      } else {
        addPastedItem(content, kind);
      }
    }
  }

  function handleEditItem(item: PastedItem) {
    if (['url', 'tailwind', 'cssvars', 'palette'].includes(item.kind)) {
      setEditingItem(item);
      setDialogType(item.kind as 'url' | 'tailwind' | 'cssvars' | 'palette');
      setDialogOpen(true);
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingItem(null);
  }

  function handlePaletteSelect(preset: PalettePreset) {
    setBase(preset.baseColor);
    const paletteColors = generateTailwindPalette(preset.baseColor);
    const colorsString = paletteColors.map(c => c.value).join(' ');
    addPastedItem(`${preset.name}: ${colorsString}`, 'palette', paletteColors.map(c => c.value));
    setPaletteDropdownOpen(false);
  }

  function handleCustomColorSubmit() {
    if (!customColor || !isValidColor(customColor)) return;

    setBase(customColor);
    const paletteColors = generateTailwindPalette(customColor);
    const colorsString = paletteColors.map(c => c.value).join(' ');
    addPastedItem(`Custom: ${colorsString}`, 'palette', paletteColors.map(c => c.value));
    setCustomColor('');
    setPaletteDropdownOpen(false);
  }

  function isValidColor(color: string): boolean {
    return /^#[0-9a-f]{3,8}$/i.test(color);
  }

  function handlePresetClick(preset: typeof presets[0]) {
    setPrompt(preset.prompt);
    // Clear existing palette items and replace with new ones
    const nonPaletteItems = pastedItems.filter(item => item.kind !== 'palette');
    clearPastedItems();
    // Re-add non-palette items
    nonPaletteItems.forEach(item => {
      addPastedItem(item.content, item.kind, item.colors, item.imageData);
    });
    // Add ramped colors for each base color
    const primaryColors = generateTailwindPalette(preset.primaryColor);
    const neutralColors = generateTailwindPalette(preset.neutralColor);
    const backgroundColors = generateTailwindPalette(preset.backgroundColor);

    addPastedItem(`${primaryColors.map(c => c.value).join(' ')}`, 'palette', primaryColors.map(c => c.value));
    addPastedItem(`${neutralColors.map(c => c.value).join(' ')}`, 'palette', neutralColors.map(c => c.value));
    addPastedItem(`${backgroundColors.map(c => c.value).join(' ')}`, 'palette', backgroundColors.map(c => c.value));
  }

  function CustomColorPreview({ color }: { color: string }) {
    if (!color || !isValidColor(color)) {
      return (
        <div className="grid grid-cols-5 gap-0.5 w-10 h-10">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-full rounded-sm bg-muted/30 border border-dashed border-muted-foreground/30"
            />
          ))}
        </div>
      );
    }

    const palette = generateTailwindPalette(color);
    const first10Colors = palette.slice(0, 10);

    return (
      <div className="grid grid-cols-5 gap-0.5 w-10 h-10">
        {first10Colors.map((paletteColor, index) => (
          <div
            key={index}
            className="w-full h-full rounded-sm"
            style={{ backgroundColor: paletteColor.value }}
          />
        ))}
      </div>
    );
  }

  function MiniPalettePreview({ preset }: { preset: PalettePreset }) {
    const palette = generateTailwindPalette(preset.baseColor);
    const first10Colors = palette.slice(0, 10); // Take first 10 colors (omit last one)

    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-5 gap-0.5 w-10 h-10">
          {first10Colors.map((color, index) => (
            <div
              key={index}
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>
    );
  }


  return (

    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative">

        {/* Unified container for textarea and pasted items */}
        <div className={cn(
          "relative transition-shadow",
          pastedItems.length > 0 && "rounded-lg border border-border/70 focus-within:border-border/90 focus-within:shadow-sm"
        )}>
          {/* Textarea container with controls */}
          <div className="relative">
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
              className={cn(
                "w-full resize-none pt-3 pb-14 pr-12 transition-all focus-visible:ring-0",
                pastedItems.length > 0
                  ? "rounded-b-none border-0 focus-visible:border-0"
                  : "border border-border/70 rounded-md focus-visible:border-border/90 focus-visible:shadow-sm"
              )}
              placeholder={
                pastedItems.length > 0
                  ? "Add your prompt here..."
                  : "Describe your theme style..."
              }
              aria-label="Theme input"
              spellCheck={false}
              autoFocus
            />

            {/* Controls positioned absolutely over the textarea only */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <Toggle
                pressed={shadcnEnabled}
                onPressedChange={setShadcnEnabled}
                size="sm"
                className={cn(
                  "transition-all border p-0 min-w-8 w-8 h-8 cursor-pointer hover:bg-primary/10 hover:border-primary/30",
                  !shadcnEnabled && "grayscale",
                  shadcnEnabled && "bg-primary/10 border-primary/30",
                  !shadcnEnabled && "bg-muted/50"
                )}
                aria-label="Toggle Shadcn theme generation"
              >
                <ShadcnIcon className="size-4" />
              </Toggle>
              <Toggle
                pressed={vscodeEnabled}
                onPressedChange={setVscodeEnabled}
                size="sm"
                className={cn(
                  "transition-all border p-0 min-w-8 w-8 h-8 cursor-pointer hover:bg-primary/10 hover:border-primary/30",
                  !vscodeEnabled && "grayscale",
                  vscodeEnabled && "bg-primary/10 border-primary/30",
                  !vscodeEnabled && "bg-muted/50"
                )}
                aria-label="Toggle VSCode theme generation"
              >
                <VSCodeIcon className="size-4" />
              </Toggle>
              <DropdownMenu open={paletteDropdownOpen} onOpenChange={setPaletteDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex cursor-pointer items-center justify-center gap-1 px-2 h-8 rounded-md border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Palette className="size-4" />
                    <span className="text-xs font-medium">Add Palette</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <div className="p-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <CustomColorPreview color={customColor} />
                      <div className="flex-1">
                        <Input
                          ref={colorInputRef}
                          placeholder="#3b82f6"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCustomColorSubmit();
                            }
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        onClick={handleCustomColorSubmit}
                        disabled={!isValidColor(customColor)}
                        className="h-8 text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-1">
                    {palettePresets.map((preset) => (
                      <DropdownMenuItem
                        key={preset.name}
                        onClick={() => handlePaletteSelect(preset)}
                        className="flex items-center gap-3 p-2 cursor-pointer"
                      >
                        <MiniPalettePreview preset={preset} />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="text-xs font-medium truncate">{preset.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{preset.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex cursor-pointer items-center justify-center w-8 h-8 p-0 rounded-md border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Plus className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => openDialog('url')} className="flex items-center gap-2">
                    <Globe className="size-4" />
                    Add web page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImageUpload} className="flex items-center gap-2">
                    <Image className="size-4" />
                    Add image
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

            {/* Submit button positioned absolutely over the textarea only */}
            <motion.button
              onClick={submit}
              disabled
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg bg-primary/50 text-primary-foreground/50 cursor-not-allowed transition-opacity"
            >
              <ArrowUp className="size-4" />
            </motion.button>
          </div>

          {/* Pasted items list below textarea */}
          {pastedItems.length > 0 && (
            <div className="border-t border-border/20">
              <PastedItemsList
                pastedItems={pastedItems}
                onRemoveItem={removePastedItem}
                onEditItem={handleEditItem}
              />
            </div>
          )}
        </div>
      </motion.div>


      {/* Preset buttons */}
      <div className="mt-6">
        {/* Mobile: Single row with all buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:hidden">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-lg transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: preset.primaryColor }}
              />
              <span className="text-center leading-tight">{preset.text}</span>
            </button>
          ))}
        </div>

        {/* Desktop: 2 rows (2 + 3) */}
        <div className="hidden sm:block space-y-3">
          {/* First row - 2 buttons */}
          <div className="flex justify-center gap-3">
            {presets.slice(0, 2).map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-full transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <span>{preset.text}</span>
              </button>
            ))}
          </div>

          {/* Second row - 3 buttons */}
          <div className="flex justify-center gap-3">
            {presets.slice(2, 5).map((preset, index) => (
              <button
                key={index + 2}
                onClick={() => handlePresetClick(preset)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-full transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <span>{preset.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>



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