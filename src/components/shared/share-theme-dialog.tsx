"use client";

import { useState, useId } from "react";
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
import { Share, Copy, Check } from "lucide-react";
import { cn } from "@/lib";

interface ShareThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePublic: (makePublic: boolean) => void;
  shareLink: string;
  isPublic?: boolean;
}

export function ShareThemeDialog({
  isOpen,
  onOpenChange,
  onTogglePublic,
  shareLink,
  isPublic = false,
}: ShareThemeDialogProps) {
  const [copied, setCopied] = useState(false);
  const linkId = useId();

  const handleCopyLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
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
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Theme
          </DialogTitle>
          <DialogDescription>
            Share your theme with others via link.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={isPublic}
              onCheckedChange={onTogglePublic}
            />
            <div className="grid gap-1">
              <Label htmlFor="make-public" className="text-sm font-normal">
                Make public
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic
                  ? "Featured in community gallery"
                  : "Only people with the link"}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={linkId}>Share Link</Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id={linkId}
                value={shareLink}
                readOnly
                className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-mono text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-all duration-300 outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden min-w-[80px]"
              >
                <div
                  className={cn(
                    "flex items-center transition-all duration-300",
                    copied ? "opacity-0 scale-75 blur-sm" : "opacity-100 scale-100 blur-0",
                  )}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    copied ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-75 blur-sm",
                  )}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="w-full"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}