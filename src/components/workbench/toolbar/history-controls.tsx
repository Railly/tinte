"use client";

import { Redo, RotateCcw, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  hasChanges: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export function HistoryControls({
  canUndo,
  canRedo,
  hasChanges,
  onUndo,
  onRedo,
  onReset,
}: HistoryControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {hasChanges && (
        <>
          <div className="w-px h-6 bg-border" />
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </>
      )}
    </div>
  );
}
