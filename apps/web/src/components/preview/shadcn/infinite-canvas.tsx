"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.15;
const MAX_SCALE = 2;
const ZOOM_SENSITIVITY = 0.002;
const DEFAULT_SCALE = 0.75;
const DOT_SIZE = 1;
const DOT_SPACING = 24;

export function InfiniteCanvas({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<CanvasTransform>({
    x: 16,
    y: 0,
    scale: DEFAULT_SCALE,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      setTransform((prev) => {
        const delta = -e.deltaY * ZOOM_SENSITIVITY;
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, prev.scale * (1 + delta))
        );
        const ratio = newScale / prev.scale;
        return {
          scale: newScale,
          x: mouseX - (mouseX - prev.x) * ratio,
          y: mouseY - (mouseY - prev.y) * ratio,
        };
      });
    } else {
      setTransform((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button === 1 || spaceHeld) {
        e.preventDefault();
        setIsPanning(true);
        lastPointer.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      }
    },
    [spaceHeld]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isPanning) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    },
    [isPanning]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (isPanning) {
        setIsPanning(false);
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      }
    },
    [isPanning]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        setIsPanning(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  const zoomPercent = Math.round(transform.scale * 100);

  const dotBg = {
    backgroundImage: `radial-gradient(circle, var(--color-border) ${DOT_SIZE}px, transparent ${DOT_SIZE}px)`,
    backgroundSize: `${DOT_SPACING}px ${DOT_SPACING}px`,
    backgroundPosition: `${transform.x % DOT_SPACING}px ${transform.y % DOT_SPACING}px`,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        cursor: isPanning ? "grabbing" : spaceHeld ? "grab" : "default",
        ...dotBg,
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        {children}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/90 backdrop-blur border rounded-md px-2 py-1 text-xs text-muted-foreground select-none z-10">
        <button
          type="button"
          className="px-1 hover:text-foreground transition-colors"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              scale: Math.max(MIN_SCALE, prev.scale - 0.1),
            }))
          }
        >
          -
        </button>
        <span className="tabular-nums w-8 text-center">{zoomPercent}%</span>
        <button
          type="button"
          className="px-1 hover:text-foreground transition-colors"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              scale: Math.min(MAX_SCALE, prev.scale + 0.1),
            }))
          }
        >
          +
        </button>
        <span className="mx-1 h-3 w-px bg-border" />
        <button
          type="button"
          className="px-1 hover:text-foreground transition-colors"
          onClick={() => setTransform({ x: 32, y: 32, scale: DEFAULT_SCALE })}
        >
          Fit
        </button>
      </div>
    </div>
  );
}
