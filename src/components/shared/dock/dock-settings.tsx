import { ArrowLeft, Copy, Edit3, Heart, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { AnonymousSignInButton } from "@/components/auth/anonymous-signin-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DockSettingsProps {
  onBack: () => void;
  onRename: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  isFavorite?: boolean;

  // Authentication props
  isAuthenticated?: boolean;
  isAnonymous?: boolean;

  // Ownership props
  isOwnTheme?: boolean;
}

export function DockSettings({
  onBack,
  onRename,
  onToggleFavorite,
  onDuplicate,
  isFavorite,
  isAuthenticated,
  isAnonymous,
  isOwnTheme,
}: DockSettingsProps) {
  return (
    <motion.div
      layoutId="dock-settings-content"
      className="flex flex-col gap-1 px-4 py-2"
    >
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-6 w-6 p-0"
        >
          <ArrowLeft className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Theme Settings
        </span>
      </div>

      {/* Authentication prompt */}
      {!isAuthenticated && !isAnonymous && (
        <div className="grid grid-cols-1 gap-1 mb-2 pb-2 border-b border-border/50">
          <AnonymousSignInButton
            variant="default"
            size="sm"
            className="h-7 justify-start gap-2 text-xs"
          >
            <UserPlus className="h-3 w-3" />
            <span className="text-xs">Sign in to Save</span>
          </AnonymousSignInButton>
        </div>
      )}

      {/* Theme actions */}
      <div className="grid grid-cols-1 gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRename}
              disabled={!isOwnTheme}
              className={`h-8 justify-start gap-2 ${!isOwnTheme ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Edit3 className="h-3 w-3" />
              <span>Rename Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>
              {isOwnTheme
                ? "Change theme name"
                : "Only theme owners can rename themes"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className="h-7 justify-start gap-2 text-xs"
            >
              <Heart
                className={`h-3 w-3 ${isFavorite ? "fill-current text-red-600" : ""}`}
              />
              <span>
                {isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="h-7 justify-start gap-2 text-xs"
            >
              <Copy className="h-3 w-3" />
              <span>Duplicate Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Create a copy of this theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
