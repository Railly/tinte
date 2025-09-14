import { ArrowLeft, RotateCcw, Upload, Eye, Share, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AnonymousSignInButton } from "@/components/auth/anonymous-signin-button";

interface DockMoreProps {
  onBack: () => void;
  onReset: () => void;
  onImport: () => void;
  onNavigateToContrast: () => void;
  onShare: () => void;
  isSharing?: boolean;
  hasChanges?: boolean;

  // Authentication props
  isAuthenticated?: boolean;
  isAnonymous?: boolean;
}

export function DockMore({
  onBack,
  onReset,
  onImport,
  onNavigateToContrast,
  onShare,
  isSharing,
  hasChanges,
  isAuthenticated,
  isAnonymous,
}: DockMoreProps) {
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
        <span className="text-sm font-medium text-muted-foreground">More Actions</span>
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

      {/* More actions */}
      <div className="grid grid-cols-1 gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={!hasChanges}
              className="h-8 justify-start gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="text-xs">Reset Changes</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Reset theme to original state</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onImport}
              className="h-8 justify-start gap-2"
            >
              <Upload className="h-3 w-3" />
              <span className="text-xs">Import Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Import theme from file or CSS</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToContrast}
              className="h-8 justify-start gap-2"
            >
              <Eye className="h-3 w-3" />
              <span className="text-xs">Contrast Check</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Check accessibility and contrast ratios</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              disabled={isSharing}
              className="h-8 justify-start gap-2"
            >
              <Share className="h-3 w-3" />
              <span className="text-xs">Share Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Share theme publicly or with URL</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}