"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2 } from "lucide-react";

interface ImportThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (name: string, css: string, makePublic: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function ImportThemeDialog({
  isOpen,
  onOpenChange,
  onImport,
  isLoading = false,
}: ImportThemeDialogProps) {
  const [themeName, setThemeName] = useState("");
  const [themeCSS, setThemeCSS] = useState("");
  const [makePublic, setMakePublic] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    const nameToUse = themeName.trim();
    const cssToUse = themeCSS.trim();

    if (!nameToUse) {
      toast.error("Please enter a theme name");
      return;
    }

    if (!cssToUse) {
      toast.error("Please enter theme CSS");
      return;
    }

    // Basic validation for CSS format
    if (!cssToUse.includes(":root") || !cssToUse.includes(".dark")) {
      toast.error("CSS must contain both :root and .dark sections");
      return;
    }

    setIsImporting(true);
    try {
      await onImport(nameToUse, cssToUse, makePublic);
      toast.success("Theme imported successfully!");
      onOpenChange(false);
      // Reset form
      setThemeName("");
      setThemeCSS("");
      setMakePublic(false);
    } catch (error) {
      console.error("Error importing theme:", error);
      toast.error("Failed to import theme");
    } finally {
      setIsImporting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isImporting || isLoading) return;
    onOpenChange(open);
    if (!open) {
      // Reset form when closing
      setThemeName("");
      setThemeCSS("");
      setMakePublic(false);
    }
  };

  const placeholderCSS = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* and more... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* and more... */
}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Theme
          </DialogTitle>
          <DialogDescription>
            Paste your shadcn CSS variables to create a new theme. A temporary workspace will be created.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Imported Theme"
              disabled={isImporting || isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="theme-css">CSS Variables</Label>
            <Textarea
              id="theme-css"
              value={themeCSS}
              onChange={(e) => setThemeCSS(e.target.value)}
              placeholder={placeholderCSS}
              disabled={isImporting || isLoading}
              className="h-[200px] font-mono text-sm resize-none"
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              Include both :root and .dark sections
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={makePublic}
              onCheckedChange={setMakePublic}
              disabled={isImporting || isLoading}
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
            disabled={isImporting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!themeName.trim() || !themeCSS.trim() || isImporting || isLoading}
            className="min-w-[120px]"
          >
            {isImporting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}