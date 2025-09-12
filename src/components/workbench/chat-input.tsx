"use client";

import { ArrowUp, Globe, Image, Plus, Square } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PasteDialog } from "@/components/home/prompt-input/paste-dialog";
import { PastedItemsList } from "@/components/home/prompt-input/pasted-items-list";
import { CSSIcon } from "@/components/shared/icons/css";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { usePastedItems } from "@/hooks/use-pasted-items";
import { cn } from "@/lib";
import { detectKind, type Kind, type PastedItem } from "@/lib/input-detection";

interface ChatInputProps {
  onSubmit?: (content: string, attachments: PastedItem[]) => void;
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function ChatInput({
  onSubmit,
  onStop,
  placeholder = "Type a message...",
  disabled = false,
  isStreaming = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "url" | "tailwind" | "cssvars" | "palette"
  >("url");
  const [editingItem, setEditingItem] = useState<PastedItem | null>(null);

  const {
    pastedItems,
    addPastedItem,
    removePastedItem,
    updatePastedItem,
    clearPastedItems,
  } = usePastedItems();

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

  function handleSubmit() {
    const allContent = [
      ...pastedItems.map((item) => item.content),
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!allContent && pastedItems.length === 0) return;

    onSubmit?.(allContent, pastedItems);
    setMessage("");
    clearPastedItems();
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
      updatePastedItem(editingItem.id, content, kind);
      setEditingItem(null);
    } else {
      addPastedItem(content, kind);
    }
  }

  function handleEditItem(item: PastedItem) {
    if (["url", "tailwind", "cssvars", "palette"].includes(item.kind)) {
      setEditingItem(item);
      setDialogType(item.kind as "url" | "tailwind" | "cssvars" | "palette");
      setDialogOpen(true);
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingItem(null);
  }

  const hasContent = message.trim() || pastedItems.length > 0;

  return (
    <div className="p-3 border-t border-border bg-background">
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className={cn(
                "w-full resize-none pt-3 pb-14 pr-12 focus-visible:ring-0 min-h-[80px] max-h-[200px]",
                pastedItems.length > 0
                  ? "rounded-b-none border-0 focus-visible:border-0"
                  : "border border-border/70 rounded-md focus-visible:border-border/90 focus-visible:shadow-sm",
              )}
              placeholder={
                pastedItems.length > 0
                  ? "Add your message here..."
                  : placeholder
              }
              disabled={disabled}
              rows={3}
            />

            {/* Controls positioned absolutely over the textarea only */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" />
                    <span className="text-xs font-medium">Add</span>
                  </Button>
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

            {/* Submit/Stop button positioned absolutely over the textarea only */}
            <motion.button
              onClick={isStreaming ? onStop : handleSubmit}
              disabled={(!hasContent && !isStreaming) || disabled}
              whileHover={{ scale: hasContent || isStreaming ? 1.05 : 1 }}
              whileTap={{ scale: hasContent || isStreaming ? 0.95 : 1 }}
              className={cn(
                "absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg transition-colors",
                (hasContent || isStreaming) && !disabled
                  ? isStreaming
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    : "bg-primary text-primary-foreground cursor-pointer"
                  : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed",
              )}
            >
              {isStreaming ? (
                <Square className="size-3" />
              ) : (
                <ArrowUp className="size-4" />
              )}
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

      <PasteDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        type={dialogType}
        onSubmit={handleDialogSubmit}
        editMode={!!editingItem}
        initialContent={editingItem?.content}
      />
    </div>
  );
}
