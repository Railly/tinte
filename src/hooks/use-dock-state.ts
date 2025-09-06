import { useEffect, useRef, useState } from "react";

type DockState = "collapsed" | "expanded" | "info";

export function useDockState() {
  const [dockState, setDockState] = useState<DockState>("collapsed");
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setDockState("collapsed");
      }
    }

    if (dockState !== "collapsed") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dockState]);

  return {
    dockState,
    setDockState,
    dockRef,
  };
}
