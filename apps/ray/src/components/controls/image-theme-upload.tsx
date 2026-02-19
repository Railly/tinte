"use client";

import type { TinteBlock } from "@tinte/core";
import {
  ImageIcon,
  Loader2,
  Zap,
  Scale,
  Gem,
  Upload,
  Check,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnthropicLogo } from "@/components/logos/anthropic";
import { GoogleLogo } from "@/components/logos/google";
import { cn } from "@/lib/utils";

const EXTRACTION_MODES = [
  {
    id: null as ModelId | null,
    label: "Color extraction",
    description: "Fast, free, picks dominant colors",
    icon: Zap,
    Logo: null,
  },
  {
    id: "google/gemini-2.5-flash-lite" as ModelId | null,
    label: "AI enhanced",
    description: "Smarter palette mapping",
    icon: Zap,
    Logo: GoogleLogo,
  },
  {
    id: "anthropic/claude-haiku-4.5" as ModelId | null,
    label: "AI balanced",
    description: "Best quality/speed ratio",
    icon: Scale,
    Logo: AnthropicLogo,
  },
  {
    id: "anthropic/claude-sonnet-4.5" as ModelId | null,
    label: "AI quality",
    description: "Highest fidelity",
    icon: Gem,
    Logo: AnthropicLogo,
  },
] as const;

type ModelId = "google/gemini-2.5-flash-lite" | "anthropic/claude-haiku-4.5" | "anthropic/claude-sonnet-4.5";

interface ThemeResult {
  dark: TinteBlock;
  light: TinteBlock;
  gradient: string;
  name: string;
}

interface ImageThemeUploadProps {
  onThemeExtracted: (data: ThemeResult) => void;
}

export function ImageThemeUpload({ onThemeExtracted }: ImageThemeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);
  const [open, setOpen] = useState(false);
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/v1/ratelimit-status")
      .then((r) => r.json())
      .then((data) => setAiRemaining(data.remaining))
      .catch(() => {});
  }, [open]);

  const callExtract = useCallback(
    async (file: File, model: ModelId | null) => {
      const formData = new FormData();
      formData.append("image", file);

      const params = new URLSearchParams();
      if (model) {
        params.set("mode", "ai");
        params.set("model", model);
      }

      const url = `/api/v1/extract-theme${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, { method: "POST", body: formData });

      if (res.status === 429) {
        setAiRemaining(0);
        return null;
      }

      if (!res.ok) {
        const err = await res.json();
        console.error("Extract theme error:", err);
        return null;
      }

      const remaining = res.headers.get("X-RateLimit-Remaining");
      if (remaining !== null) setAiRemaining(Number(remaining));

      return (await res.json()) as ThemeResult;
    },
    [],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      setLoading(true);
      setOpen(false);
      try {
        const modelId = EXTRACTION_MODES[selectedMode].id;
        const data = await callExtract(file, modelId);
        if (data) onThemeExtracted(data);
      } catch (err) {
        console.error("Failed to extract theme:", err);
      } finally {
        setLoading(false);
      }
    },
    [callExtract, onThemeExtracted, selectedMode],
  );

  const isAiMode = selectedMode > 0;
  const aiExhausted = isAiMode && aiRemaining === 0;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            title="Extract theme from image"
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ImageIcon className="size-3.5" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-[240px] p-0 overflow-hidden"
        >
          <div className="px-3 py-2 border-b">
            <span className="text-xs font-medium">Image to Theme</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Upload an image to extract a color theme
            </p>
          </div>

          <div className="p-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1.5">
              Extraction mode
            </span>
            <div className="mt-1 space-y-0.5">
              {EXTRACTION_MODES.map((mode, i) => (
                <button
                  key={mode.label}
                  type="button"
                  onClick={() => setSelectedMode(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                    selectedMode === i
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50",
                  )}
                >
                  {mode.Logo ? (
                    <mode.Logo className="size-3.5 shrink-0" />
                  ) : (
                    <mode.icon className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 text-left">
                    <span className="block leading-tight">{mode.label}</span>
                    <span className="block text-[10px] text-muted-foreground leading-tight">
                      {mode.description}
                    </span>
                  </div>
                  {selectedMode === i && (
                    <Check className="size-3 shrink-0 text-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 border-t">
            {aiRemaining !== null && (
              <p className={cn(
                "text-[10px] text-center mb-1.5",
                aiRemaining === 0 ? "text-destructive" : "text-muted-foreground",
              )}>
                {aiRemaining === 0
                  ? "AI limit reached — resets in ~1 min"
                  : `${aiRemaining}/20 AI extractions remaining`}
              </p>
            )}
            <Button
              size="sm"
              className="w-full gap-2 text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={aiExhausted}
            >
              <Upload className="size-3" />
              Choose image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
