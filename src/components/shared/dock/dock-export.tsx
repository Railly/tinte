import { ArrowLeft, Code, Copy, Download, FileText, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DockExportProps {
  onBack: () => void;
  onDownload: () => void;
  onCopyTheme: () => void;
  onCopyCommand: () => void;
  onShowInstallGuide: () => void;
  isExporting?: boolean;
  providerName: string;
  onCopyThemeAndReturn?: () => void;
}

export function DockExport({
  onBack,
  onDownload,
  onCopyTheme,
  onCopyCommand,
  onShowInstallGuide,
  isExporting,
  providerName,
  onCopyThemeAndReturn,
}: DockExportProps) {
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
        <span className="text-sm font-medium text-muted-foreground">Export Options</span>
      </div>

      {/* Export actions */}
      <div className="grid grid-cols-1 gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              disabled={isExporting}
              className="h-8 justify-start gap-2"
            >
              <Download className="h-3 w-3" />
              <span className="text-xs">Download File</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Download {providerName} theme file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyThemeAndReturn || onCopyTheme}
              className="h-8 justify-start gap-2"
            >
              <Copy className="h-3 w-3" />
              <span className="text-xs">Copy Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Copy theme content to clipboard</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyCommand}
              className="h-8 justify-start gap-2"
            >
              <Terminal className="h-3 w-3" />
              <span className="text-xs">Copy Command</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Copy installation command</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowInstallGuide}
              className="h-8 justify-start gap-2"
            >
              <FileText className="h-3 w-3" />
              <span className="text-xs">Install Guide</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Show installation instructions</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}