"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ThemeData } from "@/lib/theme";
import type { TinteTheme } from "@/types/tinte";

interface HistoryEntry {
  theme: TinteTheme;
  baseTheme: ThemeData; // Track the base theme (without unsaved)
  timestamp: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  currentIndex: number;
}

export function useThemeHistory(
  currentTheme: TinteTheme,
  baseTheme: ThemeData, // The actual theme object (can have unsaved)
  onRestore: (
    theme: TinteTheme,
    shouldSelectTheme: boolean,
    themeToSelect?: ThemeData,
  ) => void,
) {
  // Get the clean base theme (without unsaved)
  const cleanBaseTheme = useRef<ThemeData>(baseTheme);

  const [history, setHistory] = useState<HistoryState>(() => {
    // Find the original theme (without unsaved)
    const original = baseTheme.name.includes("(unsaved)")
      ? {
          ...baseTheme,
          name: baseTheme.name
            .replace(" (unsaved)", "")
            .replace("(unsaved)", "")
            .trim(),
        }
      : baseTheme;

    cleanBaseTheme.current = original;

    return {
      entries: [
        {
          theme: baseTheme.rawTheme as TinteTheme,
          baseTheme: original,
          timestamp: Date.now(),
        },
      ],
      currentIndex: 0,
    };
  });

  const isRestoringRef = useRef(false);
  const baseThemeIdRef = useRef<string>(baseTheme.id || "");

  // Reset history when base theme changes (theme switch via selector)
  useEffect(() => {
    const newBaseId = baseTheme.id || "";
    const currentBaseThemeId = cleanBaseTheme.current?.id || "";

    // Check if selecting the same base theme (e.g., "Flexoki" when you have "Custom (unsaved)" derived from "Flexoki")
    const isSameBaseTheme =
      newBaseId === currentBaseThemeId &&
      !baseTheme.name.includes("(unsaved)") &&
      history.currentIndex > 0;

    // Check if it's a different theme (not just unsaved version)
    const isNewTheme =
      newBaseId !== baseThemeIdRef.current &&
      !newBaseId.startsWith("custom_") &&
      !baseThemeIdRef.current.startsWith("custom_");

    if (isSameBaseTheme) {
      // User selected the same base theme → reset to first entry (like clicking reset)
      const firstEntry = history.entries[0];
      if (firstEntry) {
        setHistory({
          entries: [firstEntry],
          currentIndex: 0,
        });
      }
    } else if (isNewTheme) {
      // Different theme → full reset
      baseThemeIdRef.current = newBaseId;

      const original = baseTheme.name.includes("(unsaved)")
        ? {
            ...baseTheme,
            name: baseTheme.name
              .replace(" (unsaved)", "")
              .replace("(unsaved)", "")
              .trim(),
          }
        : baseTheme;

      cleanBaseTheme.current = original;

      setHistory({
        entries: [
          {
            theme: baseTheme.rawTheme as TinteTheme,
            baseTheme: original,
            timestamp: Date.now(),
          },
        ],
        currentIndex: 0,
      });
    }
  }, [baseTheme.id, baseTheme.name, history.currentIndex, history.entries]);

  // Track theme changes with debounce for history (but not for preview)
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    // Debounce: wait 500ms after last change before adding to history
    const timeoutId = setTimeout(() => {
      setHistory((prev) => {
        const currentThemeStr = JSON.stringify(currentTheme);
        const currentEntryStr = JSON.stringify(
          prev.entries[prev.currentIndex]?.theme,
        );

        // Don't track if it's the same as current entry
        if (currentThemeStr === currentEntryStr) {
          return prev;
        }

        // Remove any future entries if we're not at the end
        const newEntries = prev.entries.slice(0, prev.currentIndex + 1);

        // Add new entry with current base theme
        newEntries.push({
          theme: currentTheme,
          baseTheme: cleanBaseTheme.current,
          timestamp: Date.now(),
        });

        // Limit to 50 entries
        if (newEntries.length > 50) {
          newEntries.shift();
          return {
            entries: newEntries,
            currentIndex: newEntries.length - 1,
          };
        }

        return {
          entries: newEntries,
          currentIndex: newEntries.length - 1,
        };
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentTheme]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.currentIndex <= 0) return prev;

      const newIndex = prev.currentIndex - 1;
      const entry = prev.entries[newIndex];

      isRestoringRef.current = true;

      queueMicrotask(() => {
        // If going back to index 0, restore the original theme (no unsaved)
        const shouldSelectTheme = newIndex === 0;
        onRestore(
          entry.theme,
          shouldSelectTheme,
          shouldSelectTheme ? entry.baseTheme : undefined,
        );
      });

      return {
        ...prev,
        currentIndex: newIndex,
      };
    });
  }, [onRestore]);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.currentIndex >= prev.entries.length - 1) return prev;

      const newIndex = prev.currentIndex + 1;
      const entry = prev.entries[newIndex];

      isRestoringRef.current = true;

      queueMicrotask(() => {
        onRestore(entry.theme, false);
      });

      return {
        ...prev,
        currentIndex: newIndex,
      };
    });
  }, [onRestore]);

  const reset = useCallback(() => {
    const firstEntry = history.entries[0];
    if (!firstEntry) return;

    isRestoringRef.current = true;

    queueMicrotask(() => {
      // Reset always goes back to the original theme
      onRestore(firstEntry.theme, true, firstEntry.baseTheme);
    });

    setHistory({
      entries: [firstEntry],
      currentIndex: 0,
    });
  }, [history.entries, onRestore]);

  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.entries.length - 1;
  const hasChanges = history.currentIndex > 0;

  return {
    canUndo,
    canRedo,
    hasChanges,
    undo,
    redo,
    reset,
  };
}
