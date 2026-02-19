"use client";

import type { TinteBlock } from "@tinte/core";
import { ImageIcon, Loader2, Zap, Scale, Gem } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnthropicLogo } from "@/components/logos/anthropic";
import { GoogleLogo } from "@/components/logos/google";

const AI_MODELS = [
  {
    id: "google/gemini-2.5-flash-lite",
    label: "Fast",
    description: "$0.10/M in",
    icon: Zap,
    Logo: GoogleLogo,
  },
  {
    id: "anthropic/claude-haiku-4.5",
    label: "Balanced",
    description: "$1.00/M in",
    icon: Scale,
    Logo: AnthropicLogo,
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    label: "Quality",
    description: "$3.00/M in",
    icon: Gem,
    Logo: AnthropicLogo,
  },
] as const;

type ModelId = (typeof AI_MODELS)[number]["id"];

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
  const [selectedModel, setSelectedModel] = useState<ModelId | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

      if (!res.ok) {
        const err = await res.json();
        console.error("Extract theme error:", err);
        return null;
      }

      return (await res.json()) as ThemeResult;
    },
    [],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      setLoading(true);
      try {
        const data = await callExtract(file, selectedModel);
        if (data) onThemeExtracted(data);
      } catch (err) {
        console.error("Failed to extract theme:", err);
      } finally {
        setLoading(false);
      }
    },
    [callExtract, onThemeExtracted, selectedModel],
  );

  const activeModel = AI_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex items-center gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {activeModel ? (
              <>
                <activeModel.Logo className="size-3" />
                <span>{activeModel.label}</span>
              </>
            ) : (
              <span>No AI</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-1" side="top">
          <button
            type="button"
            onClick={() => {
              setSelectedModel(null);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent ${
              selectedModel === null ? "bg-accent" : ""
            }`}
          >
            <span className="size-3" />
            <span>No AI (node-vibrant only)</span>
          </button>
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                setSelectedModel(model.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent ${
                selectedModel === model.id ? "bg-accent" : ""
              }`}
            >
              <model.Logo className="size-3" />
              <span className="flex-1 text-left">{model.label}</span>
              <span className="text-muted-foreground">{model.description}</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon-xs"
        title="Extract theme from image"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="text-muted-foreground hover:text-foreground"
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ImageIcon className="size-3.5" />
        )}
      </Button>
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
    </div>
  );
}
