"use client";

import type { TinteBlock } from "@tinte/core";
import { ImageIcon, Loader2, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [enhancing, setEnhancing] = useState(false);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [hasExtracted, setHasExtracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const callExtract = useCallback(
    async (file: File, mode: "fast" | "ai") => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`/api/v1/extract-theme?mode=${mode}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Extract theme error:", err);
        return null;
      }

      return (await res.json()) as ThemeResult;
    },
    [],
  );

  const extractTheme = useCallback(
    async (file: File) => {
      setLoading(true);
      setHasExtracted(false);
      try {
        const data = await callExtract(file, "fast");
        if (data) {
          onThemeExtracted(data);
          setLastFile(file);
          setHasExtracted(true);
        }
      } catch (err) {
        console.error("Failed to extract theme:", err);
      } finally {
        setLoading(false);
      }
    },
    [callExtract, onThemeExtracted],
  );

  const enhanceWithAI = useCallback(async () => {
    if (!lastFile) return;
    setEnhancing(true);
    try {
      const data = await callExtract(lastFile, "ai");
      if (data) onThemeExtracted(data);
    } catch (err) {
      console.error("AI enhance failed:", err);
    } finally {
      setEnhancing(false);
    }
  }, [lastFile, callExtract, onThemeExtracted]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      extractTheme(file);
    },
    [extractTheme],
  );

  return (
    <>
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
      {hasExtracted && (
        <Button
          variant="ghost"
          size="icon-xs"
          title="Enhance with AI"
          disabled={enhancing}
          onClick={enhanceWithAI}
          className="text-muted-foreground hover:text-foreground"
        >
          {enhancing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
        </Button>
      )}
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
