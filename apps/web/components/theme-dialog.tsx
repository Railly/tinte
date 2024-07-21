import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeConfig } from "@/lib/core/types";
import { ThemeSelector } from "@/components/theme-selector";
import { cn } from "@/lib/utils";

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onSave: (newThemeName: string) => void;
  themes: ThemeConfig[];
  currentTheme: "light" | "dark";
  applyTheme: (themeName: string) => void;
}

export const ThemeDialog: React.FC<ThemeDialogProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onSave,
  themes,
  currentTheme,
  applyTheme,
}) => {
  const [newThemeName, setNewThemeName] = useState("");

  const handleSave = () => {
    onSave(newThemeName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a copy</DialogTitle>
          <DialogDescription>
            Create a copy of this theme by providing a new name
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="newThemeName">New Theme Name</Label>
            <Input
              id="newThemeName"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="Enter new theme name"
            />
          </div>
          <ThemeSelector
            label="Base theme"
            labelClassName="text-foreground"
            themes={themes}
            currentTheme={currentTheme}
            themeConfig={themeConfig}
            onSelectTheme={applyTheme}
          />
          <div>
            <Label>Preview</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
              {Object.entries(themeConfig.palette[currentTheme]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      "h-8 rounded-full",
                      "border-2 border-black/20 dark:border-white/20"
                    )}
                    style={{ backgroundColor: value }}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
