"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy, Check } from "lucide-react";
import { cn } from "@/lib";
import { useThemeContext } from "@/providers/theme";
import { getShadcnThemeCSS } from "@/lib/shadcn-theme-utils";

interface ViewCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewCodeDialog({
  isOpen,
  onOpenChange,
}: ViewCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const { tinteTheme, activeTheme } = useThemeContext();

  const themeCSS = useMemo(
    () => getShadcnThemeCSS(tinteTheme, activeTheme?.overrides?.shadcn),
    [tinteTheme, activeTheme?.overrides?.shadcn],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(themeCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy CSS:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            View Code
          </DialogTitle>
          <DialogDescription>
            CSS variables for your theme
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            value={themeCSS}
            readOnly
            className="h-[300px] font-mono text-sm resize-none"
            rows={15}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleCopy}
            className="relative overflow-hidden min-w-[100px]"
          >
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                copied ? "opacity-0 scale-75 blur-sm" : "opacity-100 scale-100 blur-0",
              )}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </div>
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300",
                copied ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-75 blur-sm",
              )}
            >
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
