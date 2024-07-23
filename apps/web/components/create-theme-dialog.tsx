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
import { toast } from "sonner";
import { useThemeGenerator } from "@/lib/hooks/use-theme-generator";
import { IconLoading } from "./ui/icons";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

interface CreateThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (newThemeName: string) => void;
  themeConfig: ThemeConfig;
  themes: ThemeConfig[];
  applyTheme: (themeName: string) => void;
  title: string;
  description: string;
  saveButtonContent: React.ReactNode;
  loadingButtonText: string;
}

export const CreateThemeDialog: React.FC<CreateThemeDialogProps> = ({
  isOpen,
  onClose,
  onSelectTheme,
  themeConfig,
  themes,
  applyTheme,
  title,
  description,
  saveButtonContent,
  loadingButtonText,
}) => {
  const { saveTheme, isSaving } = useThemeGenerator();
  const [newThemeName, setNewThemeName] = useState("");
  const { currentTheme } = useBinaryTheme();

  const handleSave = async () => {
    try {
      if (!newThemeName) {
        toast.error("Please enter a theme name");
        return;
      }
      await saveTheme({
        ...themeConfig,
        displayName: newThemeName,
      });
      onSelectTheme(newThemeName);
      toast.success("Theme saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
    }
  };
  console.log({
    themeConfig,
    currentTheme,
    ga: themeConfig.palette[currentTheme],
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="newThemeName">Theme Name</Label>
            <Input
              id="newThemeName"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="Enter theme name"
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
          <Button onClick={handleSave} disabled={isSaving || !newThemeName}>
            {isSaving ? (
              <>
                <IconLoading className="w-4 h-4 mr-2 animate-spin" />
                {loadingButtonText}
              </>
            ) : (
              <>{saveButtonContent}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
