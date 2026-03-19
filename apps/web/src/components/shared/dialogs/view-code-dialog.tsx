"use client";

import { convertTinteToShiki, getCodexVariantString } from "@tinte/providers";
import { getShadcnThemeCSS } from "@tinte/providers/provider-utils/shadcn-utils";
import { Check, Code, Copy, Moon, Sun } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib";
import { useActiveTheme } from "@/stores/hooks";

interface ViewCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  providerId?: string;
}

function generateShikiCss(
  theme: any,
  overrides?: { light?: Record<string, string>; dark?: Record<string, string> },
): string {
  const lightVariables = {
    ...theme.light.variables,
    ...(overrides?.light || {}),
  };
  const darkVariables = {
    ...theme.dark.variables,
    ...(overrides?.dark || {}),
  };

  const lightVars = Object.entries(lightVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(darkVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `:root {
${lightVars}
}

.dark {
${darkVars}
}

/* Shiki CSS Variables Theme Styles */
.shiki-css-container {
  background: var(--shiki-background);
  color: var(--shiki-foreground);
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.shiki-css-container pre {
  background: transparent !important;
  margin: 0;
  padding: 0;
}

.shiki-css-container code {
  font-family: inherit;
}`;
}

export function ViewCodeDialog({
  isOpen,
  onOpenChange,
  providerId,
}: ViewCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [codexVariant, setCodexVariant] = useState<"light" | "dark">("light");
  const { tinteTheme, activeTheme } = useActiveTheme();
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const currentProviderId = providerId || provider;
  const isCodex = currentProviderId === "codex";

  const themeCode = useMemo(() => {
    if (isCodex) {
      return getCodexVariantString(tinteTheme, codexVariant);
    }
    if (currentProviderId === "shiki") {
      const shikiTheme = convertTinteToShiki(tinteTheme);
      const shikiOverrides = activeTheme?.overrides?.shiki as
        | { light?: Record<string, string>; dark?: Record<string, string> }
        | undefined;
      return generateShikiCss(shikiTheme, shikiOverrides);
    }
    return getShadcnThemeCSS(tinteTheme, activeTheme?.overrides?.shadcn);
  }, [
    currentProviderId,
    isCodex,
    codexVariant,
    tinteTheme,
    activeTheme?.overrides?.shadcn,
    activeTheme?.overrides?.shiki,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(themeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCopied(false);
    }
  };

  const dialogDescription = isCodex
    ? `Codex theme string (${codexVariant} variant) — paste in Codex Settings > Appearance`
    : "Tailwind v4-ready CSS variables for your current theme";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            View Code
          </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {isCodex && (
          <div className="flex gap-1 p-1 bg-muted rounded-md w-fit">
            <Button
              variant={codexVariant === "light" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => {
                setCodexVariant("light");
                setCopied(false);
              }}
            >
              <Sun className="h-3 w-3 mr-1.5" />
              Light
            </Button>
            <Button
              variant={codexVariant === "dark" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => {
                setCodexVariant("dark");
                setCopied(false);
              }}
            >
              <Moon className="h-3 w-3 mr-1.5" />
              Dark
            </Button>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <Textarea
            value={themeCode}
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
                copied
                  ? "opacity-0 scale-75 blur-sm"
                  : "opacity-100 scale-100 blur-0",
              )}
            >
              <Copy className="h-4 w-4 mr-2" />
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
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
