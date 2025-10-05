"use client";

import { Edit3, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (name: string) => Promise<void>;
  currentName?: string;
  isLoading?: boolean;
}

export function RenameThemeDialog({
  isOpen,
  onOpenChange,
  onRename,
  currentName = "",
  isLoading = false,
}: RenameThemeDialogProps) {
  const [themeName, setThemeName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Use currentName as the actual default, but allow editing
  const currentThemeName = themeName || currentName;

  const handleRename = async () => {
    const nameToUse = currentThemeName.trim();
    if (!nameToUse) return;

    setIsRenaming(true);
    try {
      await onRename(nameToUse);
      onOpenChange(false);
    } catch (error) {
      console.error("Error renaming theme:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isRenaming || isLoading) return;
    onOpenChange(open);
    if (!open) {
      setThemeName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Rename Theme
          </DialogTitle>
          <DialogDescription>
            Enter a new name for your theme.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme-name">Theme name</Label>
            <Input
              id="theme-name"
              value={currentThemeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name..."
              disabled={isRenaming || isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentThemeName.trim()) {
                  handleRename();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isRenaming || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRename}
            disabled={!currentThemeName.trim() || isRenaming || isLoading}
            className="min-w-[100px]"
          >
            {isRenaming || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Renaming...
              </>
            ) : (
              <>
                <Edit3 className="mr-2 h-4 w-4" />
                Rename
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
