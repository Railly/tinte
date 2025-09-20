import { Copy, Download, FileText, Share2, MoreVertical, Redo, RotateCcw, Save, Settings, Undo } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DockIcon } from "./base-dock";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";

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

  // Save/Reset actions
  onSave?: () => void;
  onReset?: () => void;
  hasChanges?: boolean;
  canSave?: boolean;
  unsavedChanges?: boolean;
  isSaving?: boolean;

  // Navigation
  onNavigateToExport: () => void;
  onNavigateToSettings: () => void;

  // Share
  onShare?: () => void;

  // Import
  onImport?: () => void;
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
  hasChanges,
  canSave,
  unsavedChanges,
  isSaving,
  onNavigateToExport,
  onNavigateToSettings,
  onShare,
  onImport,
}: DockMainProps) {
  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <motion.div
      layoutId="dock-main-content"
      className="flex items-center gap-2 px-3 py-2"
    >
      {/* Undo/Redo Group - Compact */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className={`h-7 w-7 p-0 ${!canUndo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/50"} relative rounded-full`}
          >
            <Undo className="h-3.5 w-3.5" />
            {undoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {undoCount > 9 ? "9+" : undoCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo {canUndo ? `(${undoCount})` : ""}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className={`h-7 w-7 p-0 ${!canRedo ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/50"} relative rounded-full`}
          >
            <Redo className="h-3.5 w-3.5" />
            {redoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {redoCount > 9 ? "9+" : redoCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo {canRedo ? `(${redoCount})` : ""}</p>
        </TooltipContent>
      </Tooltip>

      {/* Separator */}
      <div className="w-px h-8 bg-background/20 mx-2" />

      {/* Save/Reset - only show when there are changes */}
      {hasChanges && (
        <>
          {/* Save */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DockIcon
                mouseX={mouseX}
                onClick={onSave}
                className={`${
                  isSaving || !canSave || !unsavedChanges
                    ? "opacity-30 cursor-not-allowed rounded-full border border-border/50"
                    : "cursor-pointer hover:bg-primary/90 bg-primary text-primary-foreground rounded-full border border-primary/50"
                } relative`}
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
                className={`${!hasChanges ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/50"} rounded-full border border-border/50`}
              >
                <RotateCcw className="h-4 w-4" />
              </DockIcon>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset changes</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}

      {/* Primary Action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrimaryAction}
            disabled={isLoading}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border border-border/50 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50"
            }`}
          >
            <PrimaryIcon className="h-3.5 w-3.5" />
            <span>{primaryActionConfig.label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{primaryActionConfig.description}</p>
        </TooltipContent>
      </Tooltip>

      {/* Import */}
      {onImport && (
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon
              mouseX={mouseX}
              onClick={onImport}
              className="cursor-pointer hover:bg-accent/50 rounded-full border border-border/50"
            >
              <FileText className="h-4 w-4" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import theme</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Share */}
      {onShare && (
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon
              mouseX={mouseX}
              onClick={onShare}
              className="cursor-pointer hover:bg-accent/50 rounded-full border border-border/50"
            >
              <Share2 className="h-4 w-4" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share theme</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Export */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DockIcon
            mouseX={mouseX}
            onClick={onNavigateToExport}
            className="cursor-pointer hover:bg-accent/50 rounded-full border border-border/50"
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
            className="cursor-pointer hover:bg-accent/50 rounded-full border border-border/50"
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
