'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowUp, Globe, Image, Palette } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Kind, PastedItem, detectKind } from '@/lib/input-detection';
import { usePastedItems } from '@/hooks/use-pasted-items';
import { usePalette } from '@/hooks/use-palette';
import { PastedItemsList } from './pasted-items-list';
import { PasteDialog } from './paste-dialog';
import { TailwindIcon } from '@/components/shared/icons/tailwind';
import { CSSIcon } from '@/components/shared/icons/css';
import { generateTailwindPalette } from '@/lib/palette-generator';
import { cn } from '@/lib';
import { Button } from '../../ui/button';
import { Search } from 'lucide-react';
import { useTinteTheme } from '@/providers/tinte-theme-provider';
import TweakCNIcon from '@/components/shared/icons/tweakcn';
import RaycastIcon from '@/components/shared/icons/raycast';
import Logo from '@/components/shared/logo';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { writeSeed } from '@/utils/anon-seed';
import { mapPastedToAttachments } from '@/utils/seed-mapper';

interface PromptInputProps {
  onSubmit?: (kind: Kind, raw: string) => void;
}

interface PalettePreset {
  name: string;
  baseColor: string;
  description: string;
}

interface ThemePreset {
  id: string;
  name: string;
  provider: 'tweakcn' | 'rayso' | 'tinte';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

export default function PromptInput({
  onSubmit,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

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
    { name: "Blue", baseColor: "#3b82f6", description: "Classic blue" },
    { name: "Green", baseColor: "#10b981", description: "Fresh green" },
    { name: "Purple", baseColor: "#8b5cf6", description: "Rich purple" },
    { name: "Orange", baseColor: "#f97316", description: "Vibrant orange" },
    { name: "Pink", baseColor: "#ec4899", description: "Bright pink" },
    { name: "Red", baseColor: "#ef4444", description: "Bold red" },
    { name: "Yellow", baseColor: "#eab308", description: "Sunny yellow" },
    { name: "Teal", baseColor: "#14b8a6", description: "Cool teal" },
    { name: "Gray", baseColor: "#6b7280", description: "Neutral gray" }
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'url' | 'tailwind' | 'cssvars' | 'palette'>('url');
  const [editingItem, setEditingItem] = useState<PastedItem | null>(null);
  const [customColor, setCustomColor] = useState('');
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const themeSearchRef = useRef<HTMLInputElement>(null);
  const { pastedItems, addPastedItem, removePastedItem, updatePastedItem, clearPastedItems } = usePastedItems();
  const { setBase } = usePalette();
  const { allThemes } = useTinteTheme();


  useEffect(() => {
    if (paletteDropdownOpen) {
      setTimeout(() => {
        colorInputRef.current?.focus();
      }, 100);
    }
  }, [paletteDropdownOpen]);

  useEffect(() => {
    if (themeDropdownOpen) {
      setTimeout(() => {
        themeSearchRef.current?.focus();
      }, 100);
    }
  }, [themeDropdownOpen]);

  // Get themes from provider (already includes provider field)
  const allThemePresets = allThemes;

  // Filter themes based on search query
  const filteredThemes = allThemePresets.filter(theme =>
    theme.name.toLowerCase().includes(themeSearchQuery.toLowerCase()) ||
    theme.provider.toLowerCase().includes(themeSearchQuery.toLowerCase())
  );

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

    if (!allContent && pastedItems.length === 0) return;

    const chatId = nanoid();
    const attachments = mapPastedToAttachments(pastedItems, 300_000);
    writeSeed(chatId, {
      id: chatId,
      content: allContent,
      attachments,
      createdAt: Date.now(),
    });

    router.push(`/chat/${chatId}`);
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

  function handleThemeSelect(theme: ThemePreset) {
    // Clear existing palette items and replace with new theme colors
    const nonPaletteItems = pastedItems.filter(item => item.kind !== 'palette');
    clearPastedItems();

    // Re-add non-palette items
    nonPaletteItems.forEach(item => {
      addPastedItem(item.content, item.kind, item.colors, item.imageData);
    });

    // Add each color from the theme as separate palette items
    const colors = Object.entries(theme.colors);

    colors.forEach(([colorName, colorValue]) => {
      if (colorValue && colorValue.startsWith('#')) {
        const paletteColors = generateTailwindPalette(colorValue);
        const colorsString = paletteColors.map(c => c.value).join(' ');
        addPastedItem(
          `${theme.name} ${colorName}: ${colorsString}`,
          'palette',
          paletteColors.map(c => c.value)
        );
      }
    });

    setThemeDropdownOpen(false);
    setThemeSearchQuery('');
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

  function ThemeColorPreview({ theme }: { theme: ThemePreset }) {
    const colorEntries = Object.entries(theme.colors).filter(([_, value]) => value && value.startsWith('#'));
    const displayColors = colorEntries.slice(0, 5); // Show up to 5 colors

    return (
      <div className="flex gap-0.5">
        {displayColors.map(([name, color], index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-sm border border-border/20"
            style={{ backgroundColor: color }}
            title={`${name}: ${color}`}
          />
        ))}
      </div>
    );
  }

  function getProviderIcon(provider: 'tweakcn' | 'rayso' | 'tinte') {
    switch (provider) {
      case 'tweakcn':
        return <TweakCNIcon className="w-3 h-3" />;
      case 'rayso':
        return <RaycastIcon className="w-3 h-3" />;
      case 'tinte':
        return <Logo size={12} />;
      default:
        return null;
    }
  }


  return (

    <>
      <div className="relative">

        {/* Unified container for textarea and pasted items */}
        <div className={cn(
          "relative",
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
              className={cn(
                "w-full resize-none pt-3 pb-14 pr-12 focus-visible:ring-0",
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
              <DropdownMenu open={paletteDropdownOpen} onOpenChange={setPaletteDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Palette className="size-4" />
                    <span className="text-xs font-medium">Colors</span>
                  </Button>
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
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2">
                      {palettePresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handlePaletteSelect(preset)}
                          className="group relative rounded-lg overflow-hidden border border-border/50 hover:border-border hover:scale-105 p-2 flex items-center justify-center"
                          title={preset.description}
                        >
                          <MiniPalettePreview preset={preset} />
                        </button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover open={themeDropdownOpen} onOpenChange={setThemeDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Search className="size-4" />
                    <span className="text-xs font-medium">Themes</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80 p-0">
                  <div className="p-2 border-b border-border/50 sticky top-0 z-50">
                    <Input
                      ref={themeSearchRef}
                      placeholder="Search themes..."
                      value={themeSearchQuery}
                      onChange={(e) => setThemeSearchQuery(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight: '320px',
                      height: filteredThemes.length === 0 ? '64px' : `${Math.min(filteredThemes.length * 50 + (filteredThemes.length - 1) * 4 + 8, 320)}px`
                    }}
                  >
                    <div className="flex flex-col gap-1 p-1">
                      {filteredThemes.slice(0, 20).map((theme) => (
                        <button
                          key={`${theme.provider}-${theme.id}`}
                          onClick={() => handleThemeSelect(theme)}
                          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm w-full text-left"
                        >
                          <ThemeColorPreview theme={theme} />
                          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <div className="text-xs font-medium truncate">{theme.name}</div>
                            <div className="flex items-center gap-1">
                              {getProviderIcon(theme.provider)}
                              <span className="text-xs text-muted-foreground capitalize">{theme.provider}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                      {filteredThemes.length === 0 && (
                        <div className="p-2 text-xs text-muted-foreground text-center">
                          No themes found
                        </div>
                      )}
                      {filteredThemes.length > 20 && (
                        <div className="p-2 text-xs text-muted-foreground text-center">
                          Showing first 20 of {filteredThemes.length} themes
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex cursor-pointer items-center justify-center w-8 h-8 p-0 rounded-md border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground">
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
              disabled={!prompt.trim() && pastedItems.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg",
                (prompt.trim() || pastedItems.length > 0)
                  ? "bg-primary text-primary-foreground cursor-pointer"
                  : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
              )}
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
                onClearAll={clearPastedItems}
              />
            </div>
          )}
        </div>
      </div>


      {/* Preset buttons */}
      <div className="mt-6">
        {/* Mobile: Single row with all buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:hidden">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-lg"
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
                className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-full"
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
                className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 hover:bg-muted border border-border/50 hover:border-border/70 rounded-full"
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