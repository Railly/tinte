import { useCallback, useEffect, useRef, useState } from "react";

type DockState = "main" | "export" | "settings" | "contrast";
type SyncStatus = "saved" | "saving" | "unsaved" | "synced" | "error";

interface DockNavigation {
  current: DockState;
  history: DockState[];
}

export function useDockState() {
  const [navigation, setNavigation] = useState<DockNavigation>({
    current: "main",
    history: []
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const dockRef = useRef<HTMLDivElement>(null);

  const dockState = navigation.current;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        navigateTo("main");
      }
    }

    if (dockState !== "main") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dockState]);

  const updateSyncStatus = (status: SyncStatus) => {
    setSyncStatus(status);
    if (status === "saved" || status === "synced") {
      setLastSaved(new Date());
    }
  };

  const simulateAutoSave = useCallback(() => {
    setSyncStatus("saving");
    setTimeout(() => {
      setSyncStatus("saved");
      setLastSaved(new Date());
      setTimeout(() => setSyncStatus("synced"), 1500);
    }, 800);
  }, []);

  const navigateTo = useCallback((newState: DockState, addToHistory: boolean = true) => {
    setNavigation(prev => {
      const newHistory = addToHistory && prev.current !== "main" 
        ? [...prev.history, prev.current]
        : prev.history;
      
      return {
        current: newState,
        history: newHistory
      };
    });
  }, []);

  const navigateBack = useCallback(() => {
    setNavigation(prev => {
      if (prev.history.length === 0) {
        return {
          current: "main",
          history: []
        };
      }
      
      const previousState = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);
      
      return {
        current: previousState,
        history: newHistory
      };
    });
  }, []);

  const canGoBack = navigation.history.length > 0;

  return {
    dockState,
    setDockState: navigateTo, // Keep compatibility
    navigateTo,
    navigateBack,
    canGoBack,
    dockRef,
    syncStatus,
    lastSaved,
    updateSyncStatus,
    simulateAutoSave,
  };
}
