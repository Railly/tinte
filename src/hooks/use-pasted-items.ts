"use client";

import { useState } from "react";
import { PastedItem, Kind, detectKind } from "@/lib/input-detection";
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
      const meta = await fetchUrlMetadata(url);
      setPastedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                metadata: {
                  title: meta.title,
                  description: meta.description,
                  favicon: meta.favicon,
                  loading: false,
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      setPastedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                metadata: {
                  title: item.metadata?.title || "Error loading",
                  description: item.metadata?.description || "",
                  favicon: item.metadata?.favicon || "",
                  loading: false,
                },
              }
            : item
        )
      );
    } finally {
      setFetchingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }

  function addPastedItem(content: string) {
    const detectedKind = detectKind(content);
    if (detectedKind === "prompt") return;

    const newItem: PastedItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      kind: detectedKind,
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
        };

        setPastedItems((prev) => [...prev, newItem]);
        handleUrlMetadataFetch(content, newItem.id);
      } catch {
        newItem.metadata = {
          title: "Invalid URL",
          description: "",
          favicon: "",
          loading: false,
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

  function clearPastedItems() {
    setPastedItems([]);
  }

  return {
    pastedItems,
    addPastedItem,
    removePastedItem,
    clearPastedItems,
    fetchingIds,
  };
}
