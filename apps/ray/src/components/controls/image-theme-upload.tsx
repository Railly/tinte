"use client";

import type { TinteBlock } from "@tinte/core";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageThemeUploadProps {
  onThemeExtracted: (data: {
    dark: TinteBlock;
    light: TinteBlock;
    gradient: string;
    name: string;
  }) => void;
}

export function ImageThemeUpload({ onThemeExtracted }: ImageThemeUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractTheme = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/v1/extract-theme", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Extract theme error:", err);
          return;
        }

        const data = await res.json();
        onThemeExtracted(data);
      } catch (err) {
        console.error("Failed to extract theme:", err);
      } finally {
        setLoading(false);
      }
    },
    [onThemeExtracted],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      extractTheme(file);
    },
    [extractTheme],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            return;
          }
        }
      }
    },
    [handleFile],
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
