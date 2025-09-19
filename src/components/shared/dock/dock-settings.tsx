import { ArrowLeft, Copy, Edit3, Trash2, UserPlus } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DockIcon } from "./base-dock";

interface DockSettingsProps {
  // macOS dock mouse tracking
  mouseX: MotionValue<number>;

  onBack: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDeleteClick: () => void;

  // Authentication props
  isAuthenticated?: boolean;
  isAnonymous?: boolean;

  // Ownership props
  isOwnTheme?: boolean;

  // Theme info for deletion
  themeName?: string;
}

export function DockSettings({
  mouseX,
  onBack,
  onRename,
  onDuplicate,
  onDeleteClick,
  isAuthenticated,
  isAnonymous,
  isOwnTheme,
  themeName,
}: DockSettingsProps) {
  return (
    <motion.div
      layoutId="dock-settings-content"
      className="flex items-center gap-2 px-3 py-2"
    >
      {/* Back Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-7 w-7 p-0 cursor-pointer hover:bg-accent/50 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back to main</p>
        </TooltipContent>
      </Tooltip>

      {/* Separator */}
      <div className="w-px h-8 bg-background/20 mx-2" />

      {/* Authentication prompt */}
      {!isAuthenticated && !isAnonymous && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-3 text-xs cursor-pointer hover:bg-accent/50 rounded-full gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign in to save themes</p>
            </TooltipContent>
          </Tooltip>
          <div className="w-px h-8 bg-background/20 mx-2" />
        </>
      )}

      {/* Rename */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRename}
            disabled={!isOwnTheme}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border ${
              !isOwnTheme
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Rename</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOwnTheme ? "Rename theme" : "Only owners can rename"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Duplicate */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="h-10 px-3 text-xs cursor-pointer hover:bg-accent/50 rounded-full gap-1.5 border"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a copy of this theme</p>
        </TooltipContent>
      </Tooltip>

      {/* Delete */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteClick}
            disabled={!isOwnTheme}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border ${
              !isOwnTheme
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer bg-destructive text-destructive-foreground"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOwnTheme ? "Delete theme" : "Only owners can delete"}</p>
        </TooltipContent>
      </Tooltip>

    </motion.div>
  );
}
