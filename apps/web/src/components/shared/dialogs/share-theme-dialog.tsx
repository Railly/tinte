"use client";

import { Check, Copy, Share, Terminal } from "lucide-react";
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
  themeSlug?: string;
}

function CopyableRow({
  id,
  label,
  value,
  disabled,
  mono,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  mono?: boolean;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (disabled || !value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      <div className="flex rounded-md shadow-xs">
        <Input
          id={id}
          value={value}
          readOnly
          disabled={disabled}
          className={cn(
            "-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 text-xs",
            mono && "font-mono",
          )}
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled || !value}
          className="border-input bg-background text-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md border px-3 text-sm font-medium transition-all duration-300 outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden min-w-[72px]"
        >
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              copied
                ? "opacity-0 scale-75 blur-sm"
                : "opacity-100 scale-100 blur-0",
            )}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
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
            <Check className="h-3.5 w-3.5 mr-1" />
            Copied!
          </div>
        </button>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ShareThemeDialog({
  isOpen,
  onOpenChange,
  onTogglePublic,
  shareLink,
  rawThemeLink,
  isPublic = false,
  canTogglePublic = true,
  themeSlug,
}: ShareThemeDialogProps) {
  const installId = useId();
  const fontId = useId();
  const packId = useId();
  const linkId = useId();
  const rawLinkId = useId();

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://tinte.dev";

  const presetUrl = themeSlug ? `${baseUrl}/api/preset/${themeSlug}` : "";
  const installCommand = themeSlug ? `npx shadcn@latest add ${presetUrl}` : "";
  const fontUrl = themeSlug
    ? `${baseUrl}/api/preset/${themeSlug}/font?variable=sans`
    : "";
  const packUrl = themeSlug
    ? `${baseUrl}/api/preset/${themeSlug}?type=pack`
    : "";

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share & Install
          </DialogTitle>
          <DialogDescription>
            Install this preset with one command or share the API endpoints.
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
            <div className="grid gap-0.5">
              <Label htmlFor="make-public" className="text-sm font-normal">
                Make public
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {isPublic
                  ? "Anyone can discover, install, and fork this preset"
                  : "Only you can see this preset"}
              </p>
              {!canTogglePublic && (
                <p className="text-[11px] text-muted-foreground">
                  Only the preset owner can change visibility.
                </p>
              )}
            </div>
          </div>

          {themeSlug && (
            <>
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    shadcn CLI v4
                  </span>
                </div>

                <div className="grid gap-3">
                  <CopyableRow
                    id={installId}
                    label="Install Command"
                    value={installCommand}
                    disabled={!isPublic}
                    mono
                    hint={
                      isPublic
                        ? "Installs colors, radius, and shadows as registry:base"
                        : "Make public to enable install commands"
                    }
                  />

                  <CopyableRow
                    id={fontId}
                    label="Font Command"
                    value={themeSlug ? `npx shadcn@latest add ${fontUrl}` : ""}
                    disabled={!isPublic}
                    mono
                    hint="Installs the preset's font as registry:font (change variable=serif|mono)"
                  />
                </div>
              </div>

              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs font-semibold text-foreground">
                    API Endpoints
                  </span>
                </div>

                <div className="grid gap-3">
                  <CopyableRow
                    id={`${packId}-base`}
                    label="Preset API (registry:base)"
                    value={presetUrl}
                    disabled={!isPublic}
                    mono
                  />

                  <CopyableRow
                    id={packId}
                    label="Preset Pack (base + fonts + commands)"
                    value={packUrl}
                    disabled={!isPublic}
                    mono
                    hint="Returns base preset, all font items, and install commands in one payload"
                  />
                </div>
              </div>
            </>
          )}

          <div className="border-t border-border/50 pt-3">
            <div className="grid gap-3">
              <CopyableRow
                id={linkId}
                label="Workbench Link"
                value={shareLink}
                disabled={!isPublic}
              />

              <CopyableRow
                id={rawLinkId}
                label="Raw JSON"
                value={rawThemeLink}
                disabled={!isPublic}
                mono
              />
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
