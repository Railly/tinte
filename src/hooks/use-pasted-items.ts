"use client";

import { useState } from "react";
import {
  detectKind,
  extractColors,
  type Kind,
  type PastedItem,
} from "@/lib/input-detection";
import { fetchUrlMetadata } from "@/lib/url-metadata";

export function usePastedItems() {
  const [pastedItems, setPastedItems] = useState<PastedItem[]>([]);
  const [fetchingIds, setFetchingIds] = useState<Set<string>>(new Set());

  async function handleUrlMetadataFetch(url: string, itemId: string) {
    if (fetchingIds.has(itemId)) {
      return;
    }
    setFetchingIds((prev) => new Set([...prev, itemId]));

    try {
      const [meta, screenshotBlob] = await Promise.all([
        fetchUrlMetadata(url),
        fetch(
          `https://headlessx-railway-template-production.up.railway.app/api/screenshot?token=a7f3d9e8c5b2f1a4e6d8c9b7f3e5a2d1c8f4b6e9a3d7f2c5b8e1a9d6f4c7b3e5a&url=${encodeURIComponent(url)}`,
        )
          .then((r) => r.blob())
          .catch(() => null),
      ]);

      let imageData: string | undefined;
      if (screenshotBlob) {
        const reader = new FileReader();
        imageData = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(screenshotBlob);
        });
      }

      setPastedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                imageData,
                metadata: {
                  title: meta.title,
                  description: meta.description,
                  favicon: meta.favicon,
                  loading: false,
                  error: false,
                },
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      setPastedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                metadata: {
                  title: "Failed to load URL",
                  description: "Could not fetch page metadata",
                  favicon: "",
                  loading: false,
                  error: true,
                },
              }
            : item,
        ),
      );
    } finally {
      setFetchingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }

  function addPastedItem(
    content: string,
    kind?: Kind,
    colors?: string[],
    imageData?: string,
  ) {
    const detectedKind = kind || detectKind(content);
    // Allow prompts for longer text (called from handlePaste when > 200 chars)
    if (detectedKind === "prompt" && !kind) return;

    const newItem: PastedItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      kind: detectedKind,
      colors: colors || extractColors(content),
      imageData,
    };

    // If it's a URL, add loading metadata and fetch
    if (detectedKind === "url") {
      try {
        const urlObj = new URL(content);
        const domain = urlObj.hostname.replace("www.", "");
        newItem.metadata = {
          title: domain,
          description: "",
          favicon: "",
          loading: true,
          error: false,
        };

        setPastedItems((prev) => [...prev, newItem]);
        handleUrlMetadataFetch(content, newItem.id);
      } catch {
        newItem.metadata = {
          title: "Invalid URL",
          description: "Please enter a valid URL",
          favicon: "",
          loading: false,
          error: true,
        };
        setPastedItems((prev) => [...prev, newItem]);
      }
    } else {
      setPastedItems((prev) => [...prev, newItem]);
    }
  }

  function removePastedItem(id: string) {
    setPastedItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updatePastedItem(id: string, content: string, kind?: Kind) {
    setPastedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              content,
              kind: kind || item.kind,
              colors: extractColors(content),
              // Reset metadata if it's a URL to refetch
              ...(kind === "url" && {
                metadata: content.includes("://")
                  ? (() => {
                      try {
                        const domain = new URL(content).hostname.replace(
                          "www.",
                          "",
                        );
                        return {
                          title: domain,
                          description: "",
                          favicon: "",
                          loading: true,
                          error: false,
                        };
                      } catch {
                        return {
                          title: "Invalid URL",
                          description: "Please enter a valid URL",
                          favicon: "",
                          loading: false,
                          error: true,
                        };
                      }
                    })()
                  : {
                      title: "Invalid URL",
                      description: "Please enter a valid URL",
                      favicon: "",
                      loading: false,
                      error: true,
                    },
              }),
            }
          : item,
      ),
    );

    // If it's a URL, fetch new metadata
    if (kind === "url" && content.includes("://")) {
      try {
        new URL(content); // Validate URL first
        handleUrlMetadataFetch(content, id);
      } catch (error) {
        console.error("Invalid URL or failed to fetch metadata:", error);
      }
    }
  }

  function clearPastedItems() {
    setPastedItems([]);
  }

  return {
    pastedItems,
    addPastedItem,
    removePastedItem,
    updatePastedItem,
    clearPastedItems,
    fetchingIds,
  };
}
