"use client";

import { Check, Copy, Share } from "lucide-react";
import { useId, useState } from "react";
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
import { cn } from "@/lib";

interface ShareThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePublic: (makePublic: boolean) => void;
  shareLink: string;
  rawThemeLink: string;
  isPublic?: boolean;
  canTogglePublic?: boolean;
}

export function ShareThemeDialog({
  isOpen,
  onOpenChange,
  onTogglePublic,
  shareLink,
  rawThemeLink,
  isPublic = false,
  canTogglePublic = true,
}: ShareThemeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const linkId = useId();
  const rawLinkId = useId();

  const handleCopyLink = async () => {
    if (!isPublic || !shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleCopyRawLink = async () => {
    if (!isPublic || !rawThemeLink) return;

    try {
      await navigator.clipboard.writeText(rawThemeLink);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (error) {
      console.error("Failed to copy raw theme link:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCopied(false);
      setCopiedJson(false);
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
            Share your public theme in the workbench or fetch it as raw JSON.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={isPublic}
              onCheckedChange={onTogglePublic}
              disabled={!canTogglePublic}
            />
            <div className="grid gap-1">
              <Label htmlFor="make-public" className="text-sm font-normal">
                Make public
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic
                  ? "Anyone with the link can open it and fetch the JSON export"
                  : "Private themes are only visible to you until you make them public"}
              </p>
              {!canTogglePublic && (
                <p className="text-xs text-muted-foreground">
                  Only the theme owner can change visibility.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={linkId}>Interactive Workbench Link</Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id={linkId}
                value={shareLink}
                readOnly
                className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-mono text-sm"
              />
              <button
                onClick={handleCopyLink}
                disabled={!isPublic || !shareLink}
                className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-all duration-300 outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden min-w-[80px]"
              >
                <div
                  className={cn(
                    "flex items-center transition-all duration-300",
                    copied
                      ? "opacity-0 scale-75 blur-sm"
                      : "opacity-100 scale-100 blur-0",
                  )}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    copied
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-75 blur-sm",
                  )}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </div>
              </button>
            </div>
            {!isPublic && (
              <p className="text-xs text-muted-foreground">
                Make the theme public before sharing the workbench link with
                others.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={rawLinkId}>Raw Theme JSON</Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id={rawLinkId}
                value={rawThemeLink}
                readOnly
                className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-mono text-sm"
              />
              <button
                onClick={handleCopyRawLink}
                disabled={!isPublic || !rawThemeLink}
                className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-all duration-300 outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden min-w-[80px]"
              >
                <div
                  className={cn(
                    "flex items-center transition-all duration-300",
                    copiedJson
                      ? "opacity-0 scale-75 blur-sm"
                      : "opacity-100 scale-100 blur-0",
                  )}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    copiedJson
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-75 blur-sm",
                  )}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Public themes are also available at a friendly `.json` URL for
              programmatic use.
            </p>
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
