import { useCallback, useRef, useState } from "react";
import type { TinteTheme } from "@/types/tinte";

interface ThemeHistoryState {
  past: TinteTheme[];
  present: TinteTheme;
  future: TinteTheme[];
}

export function useThemeHistory(initialTheme: TinteTheme, onThemeChange?: (theme: TinteTheme) => void) {
  const [history, setHistory] = useState<ThemeHistoryState>({
    past: [],
    present: initialTheme,
    future: [],
  });

  const historyRef = useRef(history);
  historyRef.current = history;

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const pushToHistory = useCallback((newTheme: TinteTheme) => {
    setHistory((prev) => {
      if (JSON.stringify(prev.present) === JSON.stringify(newTheme)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      if (newPast.length > 50) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newTheme,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      const newHistory = {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };

      // Trigger theme change callback
      if (onThemeChange) {
        setTimeout(() => onThemeChange(previous), 0);
      }

      return newHistory;
    });
  }, [onThemeChange]);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      const newHistory = {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };

      // Trigger theme change callback
      if (onThemeChange) {
        setTimeout(() => onThemeChange(next), 0);
      }

      return newHistory;
    });
  }, [onThemeChange]);

  const reset = useCallback((theme: TinteTheme) => {
    setHistory({
      past: [],
      present: theme,
      future: [],
    });
  }, []);

  return {
    currentTheme: history.present,
    canUndo,
    canRedo,
    undoCount: history.past.length,
    redoCount: history.future.length,
    undo,
    redo,
    pushToHistory,
    reset,
  };
}