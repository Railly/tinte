"use client";

import { Globe, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { CSSIcon } from "@/components/shared/icons/css";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Kind } from "@/lib/input-detection";

interface PasteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "url" | "tailwind" | "cssvars" | "palette";
  onSubmit: (content: string, kind: Kind) => void;
  editMode?: boolean;
  initialContent?: string;
}

const typeConfig = {
  url: {
    title: "Add Web Page",
    icon: Globe,
    placeholder: "https://example.com",
    defaultContent: "https://",
    isTextarea: false,
    kind: "url" as Kind,
  },
  tailwind: {
    title: "Add Tailwind Config",
    icon: TailwindIcon,
    placeholder: "Paste your Tailwind configuration...",
    defaultContent: `module.exports = {
  theme: {
    colors: {
      // Add your colors here
    }
  }
}`,
    isTextarea: true,
    kind: "tailwind" as Kind,
  },
  cssvars: {
    title: "Add CSS Variables",
    icon: CSSIcon,
    placeholder: "Paste your CSS custom properties...",
    defaultContent: `:root {
  /* CSS custom properties */
  --primary: #000;
  --secondary: #666;
  --accent: #0ea5e9;
  --background: #fff;
  --foreground: #000;
}`,
    isTextarea: true,
    kind: "cssvars" as Kind,
  },
  palette: {
    title: "Edit Color Palette",
    icon: Palette,
    placeholder: "#3b82f6",
    defaultContent: "#3b82f6",
    isTextarea: false,
    kind: "palette" as Kind,
  },
};

export function PasteDialog({
  open,
  onOpenChange,
  type,
  onSubmit,
  editMode = false,
  initialContent,
}: PasteDialogProps) {
  const config = typeConfig[type];
  const [content, setContent] = useState("");
  const [hasUserInput, setHasUserInput] = useState(false);

  // Initialize content properly for palette editing
  useEffect(() => {
    if (type === "palette" && initialContent) {
      // Extract the first hex color from the palette content for editing
      const colorMatch = initialContent.match(/#[0-9a-f]{6}/i);
      setContent(colorMatch ? colorMatch[0] : config.defaultContent);
      setHasUserInput(true);
    } else {
      setContent(initialContent || config.defaultContent);
      setHasUserInput(!!initialContent);
    }
  }, [initialContent, type, config.defaultContent]);

  useEffect(() => {
    if (open && !editMode && type !== "palette") {
      setContent(config.defaultContent);
      setHasUserInput(false);
    }
  }, [open, editMode, config.defaultContent, type]);

  function handlePaste(e: React.ClipboardEvent) {
    if (!editMode) {
      const pastedText = e.clipboardData.getData("text");
      if (pastedText.trim()) {
        setContent(pastedText);
        setHasUserInput(true);
        // Auto-submit and close for new items
        setTimeout(() => {
          onSubmit(pastedText, config.kind);
          onOpenChange(false);
        }, 100);
      }
    }
  }

  function handleChange(value: string) {
    setContent(value);
    setHasUserInput(true);
  }

  function handleSubmit() {
    if (content.trim()) {
      onSubmit(content, config.kind);
      onOpenChange(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleCancel() {
    onOpenChange(false);
    if (!editMode) {
      setContent(config.defaultContent);
      setHasUserInput(false);
    }
  }

  const Icon = config.icon;
  const showButtons = editMode || hasUserInput;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="size-5" />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {config.isTextarea ? (
            <Textarea
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder={config.placeholder}
              rows={8}
              className="font-mono text-sm max-h-80 resize-none"
            />
          ) : (
            <Input
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={config.placeholder}
              className="font-mono"
            />
          )}

          {!editMode && !hasUserInput && (
            <p className="text-sm text-muted-foreground">
              Paste your content above and it will be added automatically.
            </p>
          )}
        </div>

        {showButtons && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
