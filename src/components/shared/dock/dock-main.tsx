import { ArrowUpDown, Copy, Download, MoreHorizontal, MoreVertical, Redo, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DockMainProps {
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
  
  // Navigation
  onNavigateToExport: () => void;
  onNavigateToMore: () => void;
}

export function DockMain({
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
  onNavigateToExport,
  onNavigateToMore,
}: DockMainProps) {
  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {/* Undo/Redo Group */}
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0 relative"
            >
              <Undo className="h-3 w-3" />
              {undoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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
              className="h-8 w-8 p-0 relative"
            >
              <Redo className="h-3 w-3" />
              {redoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {redoCount > 9 ? "9+" : redoCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo {canRedo ? `(${redoCount})` : ""}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Primary Action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={primaryActionConfig.variant}
            size="sm"
            onClick={onPrimaryAction}
            disabled={isLoading}
            className="h-8 px-3 gap-1.5"
          >
            <PrimaryIcon className="h-3 w-3" />
            <span className="text-xs font-medium">{primaryActionConfig.label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{primaryActionConfig.description}</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Quick Actions */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy theme</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToExport}
            className="h-8 w-8 p-0"
          >
            <Download className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export options</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToMore}
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>More actions</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}