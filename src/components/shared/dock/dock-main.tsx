import { Copy, Download, MoreVertical, Redo, Save, Undo } from "lucide-react";
import type { MotionValue } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DockIcon } from "./base-dock";

interface DockMainProps {
  // macOS dock mouse tracking
  mouseX: MotionValue<number>;

  // Undo/Redo
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;

  // Primary action
  primaryActionConfig: {
    label: string;
    description: string;
    icon: React.ComponentType<any>;
    variant: "default" | "outline" | "ghost";
  };
  onPrimaryAction: () => void;
  isLoading?: boolean;

  // Quick actions
  onCopy: () => void;
  onSave: () => void;

  // Save state
  canSave: boolean;
  unsavedChanges: boolean;
  isSaving: boolean;

  // Navigation
  onNavigateToExport: () => void;
  onNavigateToMore: () => void;
}

export function DockMain({
  mouseX,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  primaryActionConfig,
  onPrimaryAction,
  isLoading,
  onCopy,
  onSave,
  canSave,
  unsavedChanges,
  isSaving,
  onNavigateToExport,
  onNavigateToMore,
}: DockMainProps) {
  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <div className="flex items-end gap-0.5">
      {/* Undo/Redo Group */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onUndo}
            className={`${!canUndo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"} relative bg-white/10 border border-white/20`}
          >
            <Undo className="h-4 w-4" />
            {undoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {undoCount > 9 ? "9+" : undoCount}
              </span>
            )}
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo {canUndo ? `(${undoCount})` : ""}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onRedo}
            className={`${!canRedo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"} relative bg-white/10 border border-white/20`}
          >
            <Redo className="h-4 w-4" />
            {redoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {redoCount > 9 ? "9+" : redoCount}
              </span>
            )}
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo {canRedo ? `(${redoCount})` : ""}</p>
        </TooltipContent>
      </Tooltip>

      {/* Primary Action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onPrimaryAction}
            className={`${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"} bg-white/10 border border-white/20`}
          >
            <PrimaryIcon className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>{primaryActionConfig.description}</p>
        </TooltipContent>
      </Tooltip>

      {/* Save */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onSave}
            className={`${isSaving || !canSave || !unsavedChanges ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"} relative bg-white/10 border border-white/20`}
          >
            <Save className="h-4 w-4" />
            {unsavedChanges && canSave && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                !
              </span>
            )}
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isSaving
              ? "Saving..."
              : unsavedChanges
                ? "Save changes"
                : "No changes to save"}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Copy */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onCopy}
            className="cursor-pointer hover:bg-white/20 bg-white/10 border border-white/20"
          >
            <Copy className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy theme</p>
        </TooltipContent>
      </Tooltip>

      {/* Export */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onNavigateToExport}
            className="cursor-pointer hover:bg-white/20 bg-white/10 border border-white/20"
          >
            <Download className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export options</p>
        </TooltipContent>
      </Tooltip>

      {/* More */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onNavigateToMore}
            className="cursor-pointer hover:bg-white/20 bg-white/10 border border-white/20"
          >
            <MoreVertical className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>More actions</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
