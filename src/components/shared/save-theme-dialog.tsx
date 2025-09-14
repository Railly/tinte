"use client";

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
import { Save, Loader2 } from "lucide-react";

interface SaveThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, makePublic: boolean) => Promise<void>;
  defaultName?: string;
  isLoading?: boolean;
}

export function SaveThemeDialog({
  isOpen,
  onOpenChange,
  onSave,
  defaultName = "My Custom Theme",
  isLoading = false,
}: SaveThemeDialogProps) {
  const [themeName, setThemeName] = useState(defaultName);
  const [makePublic, setMakePublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!themeName.trim()) return;

    setIsSaving(true);
    try {
      await onSave(themeName.trim(), makePublic);
      onOpenChange(false);
      // Reset form
      setThemeName(defaultName);
      setMakePublic(false);
    } catch (error) {
      console.error("Error saving theme:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isSaving || isLoading) return; // Prevent closing while saving
    onOpenChange(open);
    if (!open) {
      // Reset form when closing
      setThemeName(defaultName);
      setMakePublic(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Theme
          </DialogTitle>
          <DialogDescription>
            Give your theme a name and choose whether to make it public.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme-name">Theme name</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name..."
              disabled={isSaving || isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && themeName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={makePublic}
              onCheckedChange={setMakePublic}
              disabled={isSaving || isLoading}
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
            disabled={isSaving || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!themeName.trim() || isSaving || isLoading}
            className="min-w-[100px]"
          >
            {isSaving || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Theme
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}