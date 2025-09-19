"use client";

import { useState, useId } from "react";
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
import { Share, Loader2, Copy } from "lucide-react";

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
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const commandId = useId();
  const linkId = useId();

  const handleTogglePublic = (checked: boolean) => {
    onTogglePublic(checked);
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("🔗 Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCommand = async () => {
    if (!shareLink) return;

    const command = `npx shadcn@latest add ${shareLink}`;
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
      toast.success("📋 Install command copied!");
    } catch (error) {
      console.error("Failed to copy command:", error);
      toast.error("Failed to copy command");
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCopiedLink(false);
      setCopiedCommand(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Theme
          </DialogTitle>
          <DialogDescription>
            Share your theme with others by generating a shareable link.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="make-public"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
            />
            <div className="grid gap-1">
              <Label htmlFor="make-public" className="text-sm font-normal">
                Make theme public
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic
                  ? "✨ Theme will be showcased in the community gallery for everyone to discover"
                  : "🔗 Only people with the link can install your theme"}
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
                className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={commandId}>Install Command</Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id={commandId}
                value={`npx shadcn@latest add ${shareLink}`}
                readOnly
                className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-mono text-sm"
              />
              <button
                onClick={handleCopyCommand}
                className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copiedCommand ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Others can install your theme by running this command
            </p>
          </div>

          {isPublic && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-sm font-medium text-primary">
                ✨ Community Theme
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your theme is public and will be featured in the community gallery
              </p>
            </div>
          )}
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