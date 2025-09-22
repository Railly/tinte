import { ArrowLeft, RotateCcw, Share, UserPlus } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AnonymousSignInButton } from "@/components/auth/anonymous-signin-button";
import { DockIcon } from "./base-dock";

interface DockMoreProps {
  // macOS dock mouse tracking
  mouseX: MotionValue<number>;

  onBack: () => void;
  onReset: () => void;
  onShare: () => void;
  isSharing?: boolean;
  hasChanges?: boolean;

  // Authentication props
  isAuthenticated?: boolean;
  isAnonymous?: boolean;
}

export function DockMore({
  mouseX,
  onBack,
  onReset,
  onShare,
  isSharing,
  hasChanges,
  isAuthenticated,
  isAnonymous,
}: DockMoreProps) {
  return (
    <motion.div
      layoutId="dock-more-content"
      className="flex items-center gap-3 px-3 py-2"
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
                className="h-10 px-3 text-xs cursor-pointer hover:bg-accent/50 rounded-full gap-1.5 border border-border/50"
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

      {/* Reset */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!hasChanges}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border border-border/50 ${
              !hasChanges
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset changes</p>
        </TooltipContent>
      </Tooltip>

      {/* Share */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            disabled={isSharing}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border border-border/50 ${
              isSharing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50"
            }`}
          >
            <Share className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share theme</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}