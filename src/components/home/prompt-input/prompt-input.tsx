"use client";

import { ArrowUp, Globe, Image, Palette, Plus } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CSSIcon } from "@/components/shared/icons/css";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { ThemeSelector } from "@/components/shared/theme-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePalette } from "@/hooks/use-palette";
import { usePastedItems } from "@/hooks/use-pasted-items";
import { cn } from "@/lib";
import { detectKind, type Kind, type PastedItem } from "@/lib/input-detection";
import { generateTailwindPalette } from "@/lib/palette-generator";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { writeSeed } from "@/utils/anon-seed";
import { mapPastedToAttachments } from "@/utils/seed-mapper";
import { Button } from "../../ui/button";
import {
  type PalettePreset,
  PROMPT_INPUT_PALETTE_PRESETS,
  PROMPT_INPUT_PRESETS,
} from "./constants";
import { PasteDialog } from "./paste-dialog";
import { PastedItemsList } from "./pasted-items-list";
import { ThemeSelectorDialog } from "./theme-selector-dialog";

interface PromptInputProps {
  onSubmit?: (kind: Kind, raw: string) => void;
}

export default function PromptInput({ onSubmit }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "url" | "tailwind" | "cssvars" | "palette"
  >("url");
  const [editingItem, setEditingItem] = useState<PastedItem | null>(null);
  const [customColor, setCustomColor] = useState("");
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [selectedThemeItem, setSelectedThemeItem] = useState<PastedItem | null>(
    null,
  );
  const colorInputRef = useRef<HTMLInputElement>(null);
  const {
    pastedItems,
    addPastedItem,
    removePastedItem,
    updatePastedItem,
    clearPastedItems,
  } = usePastedItems();
  const { setBase } = usePalette();
  const { allThemes } = useThemeContext();

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
    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          addPastedItem("Image", "image", undefined, imageData);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
        return;
      }
    }

    // Handle text
    const pastedText = clipboardData.getData("text");
    if (!pastedText.trim()) return;

    // Detect the kind of content
    const detectedKind = detectKind(pastedText);

    // If it's a URL, CSS vars, Tailwind config, or palette, create a paste item
    if (["url", "cssvars", "tailwind", "palette"].includes(detectedKind)) {
      addPastedItem(pastedText, detectedKind);
      e.preventDefault();
      return;
    }

    // If text is long (over 200 chars), add as pasted item
    if (pastedText.length >= 200) {
      addPastedItem(pastedText, "prompt");
      e.preventDefault();
      return;
    }

    // For short text that's not special content, let default paste behavior happen
  }

  function submit() {
    const allContent = [
      ...pastedItems.map((item) => item.content),
      prompt.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!allContent && pastedItems.length === 0) return;

    // For simple prompts, just go to workbench/new with prompt in URL
    // For complex cases with attachments, use the seed system
    if (pastedItems.length > 0) {
      const chatId = nanoid();
      const attachments = mapPastedToAttachments(pastedItems, 1_000_000);
      writeSeed(chatId, {
        id: chatId,
        content: allContent,
        attachments,
        createdAt: Date.now(),
      });
      router.push(`/workbench/${chatId}?tab=agent`);
    } else {
      router.push(
        `/workbench/new?tab=agent&prompt=${encodeURIComponent(allContent)}`,
      );
    }
    onSubmit?.("prompt", allContent);
  }

  function openDialog(type: "url" | "tailwind" | "cssvars" | "palette") {
    setDialogType(type);
    setDialogOpen(true);
  }

  function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          addPastedItem(file.name, "image", undefined, imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  function handleDialogSubmit(content: string, kind: Kind) {
    if (editingItem) {
      if (kind === "palette") {
        // For palette editing, regenerate the palette with new base color
        setBase(content);
        const paletteColors = generateTailwindPalette(content);
        const colorsString = paletteColors.map((c) => c.value).join(" ");
        updatePastedItem(editingItem.id, `Custom: ${colorsString}`, kind);
      } else {
        updatePastedItem(editingItem.id, content, kind);
      }
      setEditingItem(null);
    } else {
      if (kind === "palette") {
        // For new palette items
        setBase(content);
        const paletteColors = generateTailwindPalette(content);
        const colorsString = paletteColors.map((c) => c.value).join(" ");
        addPastedItem(
          `Custom: ${colorsString}`,
          kind,
          paletteColors.map((c) => c.value),
        );
      } else {
        addPastedItem(content, kind);
      }
    }
  }

  function handleEditItem(item: PastedItem) {
    // Check if this is a theme item (palette with theme name pattern)
    if (item.kind === "palette" && item.content.includes(" theme")) {
      setSelectedThemeItem(item);
      setThemeSelectorOpen(true);
    } else if (["url", "tailwind", "cssvars", "palette"].includes(item.kind)) {
      setEditingItem(item);
      setDialogType(item.kind as "url" | "tailwind" | "cssvars" | "palette");
      setDialogOpen(true);
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingItem(null);
  }

  function handleThemeReplace(theme: ThemeData, item: PastedItem) {
    const validColors = Object.entries(theme.colors || {})
      .filter(([_, colorValue]) => colorValue?.startsWith("#"))
      .map(([_, colorValue]) => colorValue);

    if (validColors.length > 0) {
      // Create content with colors included so extractColors can pick them up
      const contentWithColors = `${theme.name} theme: ${validColors.join(" ")}`;
      updatePastedItem(item.id, contentWithColors, "palette");
    }
  }

  function handlePaletteSelect(preset: PalettePreset) {
    setBase(preset.baseColor);
    const paletteColors = generateTailwindPalette(preset.baseColor);
    const colorsString = paletteColors.map((c) => c.value).join(" ");
    addPastedItem(
      `${preset.name}: ${colorsString}`,
      "palette",
      paletteColors.map((c) => c.value),
    );
    setPaletteDropdownOpen(false);
  }

  function handleThemeSelect(theme: ThemeData) {
    // Add the theme as a single pasted item (accumulate, don't replace)
    const validColors = Object.entries(theme.colors || {})
      .filter(([_, colorValue]) => colorValue?.startsWith("#"))
      .map(([_, colorValue]) => colorValue);

    if (validColors.length > 0) {
      // Create content with colors included so they show visually
      const contentWithColors = `${theme.name} theme: ${validColors.join(" ")}`;
      addPastedItem(contentWithColors, "palette", validColors);
    }
  }

  function handleCustomColorSubmit() {
    if (!customColor || !isValidColor(customColor)) return;

    setBase(customColor);
    const paletteColors = generateTailwindPalette(customColor);
    const colorsString = paletteColors.map((c) => c.value).join(" ");
    addPastedItem(
      `Custom: ${colorsString}`,
      "palette",
      paletteColors.map((c) => c.value),
    );
    setCustomColor("");
    setPaletteDropdownOpen(false);
  }

  function isValidColor(color: string): boolean {
    return /^#[0-9a-f]{3,8}$/i.test(color);
  }

  function handlePresetClick(preset: (typeof PROMPT_INPUT_PRESETS)[0]) {
    setPrompt(preset.prompt);
    // Clear existing palette items and replace with new ones
    const nonPaletteItems = pastedItems.filter(
      (item) => item.kind !== "palette",
    );
    clearPastedItems();
    // Re-add non-palette items
    nonPaletteItems.forEach((item) => {
      addPastedItem(item.content, item.kind, item.colors, item.imageData);
    });
    // Add ramped colors for each base color
    const primaryColors = generateTailwindPalette(preset.primaryColor);
    const neutralColors = generateTailwindPalette(preset.neutralColor);
    const backgroundColors = generateTailwindPalette(preset.backgroundColor);

    addPastedItem(
      `${primaryColors.map((c) => c.value).join(" ")}`,
      "palette",
      primaryColors.map((c) => c.value),
    );
    addPastedItem(
      `${neutralColors.map((c) => c.value).join(" ")}`,
      "palette",
      neutralColors.map((c) => c.value),
    );
    addPastedItem(
      `${backgroundColors.map((c) => c.value).join(" ")}`,
      "palette",
      backgroundColors.map((c) => c.value),
    );
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
      <div className="relative">
        {/* Unified container for textarea and pasted items */}
        <div
          className={cn(
            "relative",
            pastedItems.length > 0 &&
              "rounded-lg border border-border/70 focus-within:border-border/90 focus-within:shadow-sm",
          )}
        >
          {/* Textarea container with controls */}
          <div className="relative">
            <Textarea
              id="hero-input-dock"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              className={cn(
                "w-full resize-none pt-3 pb-14 pr-12 focus-visible:ring-0",
                pastedItems.length > 0
                  ? "rounded-b-none border-0 focus-visible:border-0"
                  : "border border-border/70 rounded-md focus-visible:border-border/90 focus-visible:shadow-sm",
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
              <DropdownMenu
                open={paletteDropdownOpen}
                onOpenChange={setPaletteDropdownOpen}
              >
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
                            if (e.key === "Enter") {
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
                      {PROMPT_INPUT_PALETTE_PRESETS.map((preset) => (
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
              <ThemeSelector
                themes={allThemes}
                activeId={null}
                onSelect={handleThemeSelect}
                triggerClassName="h-8"
                label="Themes"
                popoverWidth="w-72"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex cursor-pointer items-center justify-center w-8 h-8 p-0 rounded-md border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground">
                    <Plus className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => openDialog("url")}
                    className="flex items-center gap-2"
                  >
                    <Globe className="size-4" />
                    Add web page
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleImageUpload}
                    className="flex items-center gap-2"
                  >
                    <Image className="size-4" />
                    Add image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDialog("tailwind")}
                    className="flex items-center gap-2"
                  >
                    <TailwindIcon className="size-4" />
                    Add Tailwind config
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDialog("cssvars")}
                    className="flex items-center gap-2"
                  >
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
                prompt.trim() || pastedItems.length > 0
                  ? "bg-primary text-primary-foreground cursor-pointer"
                  : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed",
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

      {/* Preset buttons - 4 inline */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {PROMPT_INPUT_PRESETS.slice(0, 4).map((preset, index) => (
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

      <PasteDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        type={dialogType}
        onSubmit={handleDialogSubmit}
        editMode={!!editingItem}
        initialContent={editingItem?.content}
      />

      <ThemeSelectorDialog
        open={themeSelectorOpen}
        onOpenChange={setThemeSelectorOpen}
        themes={allThemes}
        onThemeSelect={handleThemeReplace}
        item={selectedThemeItem}
      />
    </>
  );
}
