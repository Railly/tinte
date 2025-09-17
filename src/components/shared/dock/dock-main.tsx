import { Copy, Download, MoreVertical, Redo, RotateCcw, Save, Settings, Undo } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
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
  onSave: () => void;
  onReset: () => void;

  // Save state
  canSave: boolean;
  unsavedChanges: boolean;
  isSaving: boolean;
  hasChanges: boolean;

  // Navigation
  onNavigateToExport: () => void;
  onNavigateToSettings: () => void;
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
  onSave,
  onReset,
  canSave,
  unsavedChanges,
  isSaving,
  hasChanges,
  onNavigateToExport,
  onNavigateToSettings,
}: DockMainProps) {
  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <motion.div
      layoutId="dock-main-content"
      className="flex items-center gap-2 px-3 py-2"
    >
      {/* Undo/Redo Group */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onUndo}
            className={`${!canUndo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-background/20"} relative bg-background/10 border border-background/20`}
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
            className={`${!canRedo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-background/20"} relative bg-background/10 border border-background/20`}
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

      {/* Separator */}
      <div className="w-px h-8 bg-background/20 mx-1" />

      {/* Primary Action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onPrimaryAction}
            className={`${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-background/20"} bg-background/10 border border-background/20`}
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
            className={`${isSaving || !canSave || !unsavedChanges ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-background/20"} relative bg-background/10 border border-background/20`}
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

      {/* Reset */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onReset}
            className={`${!hasChanges ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-background/20"} bg-background/10 border border-background/20`}
          >
            <RotateCcw className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset changes</p>
        </TooltipContent>
      </Tooltip>

      {/* Export */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onNavigateToExport}
            className="cursor-pointer hover:bg-background/20 bg-background/10 border border-background/20"
          >
            <Download className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export options</p>
        </TooltipContent>
      </Tooltip>

      {/* Settings */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onNavigateToSettings}
            className="cursor-pointer hover:bg-background/20 bg-background/10 border border-background/20"
          >
            <Settings className="h-4 w-4" />
          </DockIcon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme settings</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
