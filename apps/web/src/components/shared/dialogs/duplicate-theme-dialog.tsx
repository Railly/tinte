"use client";

import { Copy, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

interface DuplicateThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: (name: string, makePublic: boolean) => Promise<void>;
  defaultName?: string;
  isLoading?: boolean;
  isBuiltInTheme?: boolean;
}

export function DuplicateThemeDialog({
  isOpen,
  onOpenChange,
  onDuplicate,
  defaultName = "Copy of Theme",
  isLoading = false,
  isBuiltInTheme = false,
}: DuplicateThemeDialogProps) {
  const [themeName, setThemeName] = useState("");
  const [makePublic, setMakePublic] = useState(true);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Use defaultName as the actual default, but allow editing
  const currentThemeName = themeName || defaultName;

  const handleDuplicate = async () => {
    const nameToUse = currentThemeName.trim();
    if (!nameToUse) return;

    setIsDuplicating(true);
    try {
      await onDuplicate(nameToUse, makePublic);
      onOpenChange(false);
      setThemeName("");
      setMakePublic(true);
    } catch (error) {
      console.error("Error duplicating theme:", error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isDuplicating || isLoading) return;
    onOpenChange(open);
    if (!open) {
      setThemeName("");
      setMakePublic(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {isBuiltInTheme ? "Save Theme" : "Duplicate Theme"}
          </DialogTitle>
          <DialogDescription>
            {isBuiltInTheme
              ? "Save this built-in theme to your collection with a custom name."
              : "Create a copy of this theme with a new name."}
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
              disabled={isDuplicating || isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentThemeName.trim()) {
                  handleDuplicate();
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={makePublic}
              onCheckedChange={setMakePublic}
              disabled={isDuplicating || isLoading}
            />
            <Label htmlFor="make-public" className="text-sm font-normal">
              Make theme public (others can see and use it)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDuplicating || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDuplicate}
            disabled={!currentThemeName.trim() || isDuplicating || isLoading}
            className="min-w-[100px]"
          >
            {isDuplicating || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isBuiltInTheme ? "Saving..." : "Duplicating..."}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {isBuiltInTheme ? "Save Theme" : "Duplicate"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
