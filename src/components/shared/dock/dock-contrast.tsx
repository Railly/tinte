import { ArrowLeft, Play, AlertTriangle, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DockContrastProps {
  onBack: () => void;
  onRunCheck: () => void;
  onShowIssues: () => void;
  onShowWcagInfo: () => void;
  onExportReport: () => void;
  isRunning?: boolean;
  issueCount?: number;
}

export function DockContrast({
  onBack,
  onRunCheck,
  onShowIssues,
  onShowWcagInfo,
  onExportReport,
  isRunning,
  issueCount = 0,
}: DockContrastProps) {
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
        <span className="text-sm font-medium text-muted-foreground">Contrast Check</span>
      </div>

      {/* Contrast actions */}
      <div className="grid grid-cols-1 gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRunCheck}
              disabled={isRunning}
              className="h-8 justify-start gap-2"
            >
              <Play className="h-3 w-3" />
              <span className="text-xs">Run Check</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Analyze theme accessibility</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowIssues}
              disabled={issueCount === 0}
              className="h-8 justify-start gap-2 relative"
            >
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs">Show Issues</span>
              {issueCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {issueCount > 9 ? "9+" : issueCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>View accessibility issues found</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowWcagInfo}
              className="h-8 justify-start gap-2"
            >
              <Info className="h-3 w-3" />
              <span className="text-xs">WCAG Info</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Learn about accessibility guidelines</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportReport}
              className="h-8 justify-start gap-2"
            >
              <Download className="h-3 w-3" />
              <span className="text-xs">Export Report</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Export accessibility report</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}