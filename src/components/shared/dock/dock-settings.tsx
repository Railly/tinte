import { ArrowLeft, Copy, Edit3, Heart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AnonymousSignInButton } from "@/components/auth/anonymous-signin-button";

interface DockSettingsProps {
  onBack: () => void;
  onRename: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  isFavorite?: boolean;

  // Authentication props
  isAuthenticated?: boolean;
  isAnonymous?: boolean;
}

export function DockSettings({
  onBack,
  onRename,
  onToggleFavorite,
  onDuplicate,
  isFavorite,
  isAuthenticated,
  isAnonymous,
}: DockSettingsProps) {
  return (
    <div className="flex flex-col gap-2 p-3 min-w-48">
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
        <span className="text-sm font-medium text-muted-foreground">Theme Settings</span>
      </div>

      {/* Authentication prompt */}
      {!isAuthenticated && !isAnonymous && (
        <div className="grid grid-cols-1 gap-1 mb-2 pb-2 border-b border-border/50">
          <AnonymousSignInButton
            variant="default"
            size="sm"
            className="h-8 justify-start gap-2"
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
              className="h-8 justify-start gap-2"
            >
              <Edit3 className="h-3 w-3" />
              <span className="text-xs">Rename Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Change theme name</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className="h-8 justify-start gap-2"
            >
              <Heart className={`h-3 w-3 ${isFavorite ? "fill-current text-red-500" : ""}`} />
              <span className="text-xs">{isFavorite ? "Remove Favorite" : "Add to Favorites"}</span>
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
              className="h-8 justify-start gap-2"
            >
              <Copy className="h-3 w-3" />
              <span className="text-xs">Duplicate Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Create a copy of this theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}