"use client";

import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ThemeData } from "@/lib/theme-tokens";
import type { PastedItem } from "@/lib/input-detection";

interface ThemeSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themes: ThemeData[];
  onThemeSelect: (theme: ThemeData, item: PastedItem) => void;
  item: PastedItem | null;
}

export function ThemeSelectorDialog({
  open,
  onOpenChange,
  themes,
  onThemeSelect,
  item,
}: ThemeSelectorDialogProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);

  // Reset selected theme when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTheme(null);
    }
  }, [open]);

  function handleThemeSelect(theme: ThemeData) {
    setSelectedTheme(theme);
  }

  function handleConfirm() {
    if (selectedTheme && item) {
      onThemeSelect(selectedTheme, item);
      onOpenChange(false);
      setSelectedTheme(null);
    }
  }

  function handleCancel() {
    onOpenChange(false);
    setSelectedTheme(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Replace Theme
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a new theme to replace the current one:
          </p>
          
          <ThemeSelector
            themes={themes}
            activeId={selectedTheme?.id}
            onSelect={handleThemeSelect}
            label="Select Theme"
            popoverWidth="w-72"
            triggerClassName="w-full"
          />

          {selectedTheme && (
            <div className="p-2 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">Selected theme:</p>
              <p className="text-sm font-medium">{selectedTheme.name}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTheme}>
            Replace Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}