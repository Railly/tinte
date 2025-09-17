import { ArrowLeft, Code, Copy, Download, FileText, Terminal } from "lucide-react";
import { motion } from "motion/react";
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
    <motion.div
      layoutId="dock-export-content"
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
              className="h-7 justify-start gap-2 text-xs"
            >
              <Download className="h-3 w-3" />
              <span>Download File</span>
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
              className="h-7 justify-start gap-2 text-xs"
            >
              <Copy className="h-3 w-3" />
              <span>Copy Theme</span>
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
              className="h-7 justify-start gap-2 text-xs"
            >
              <Terminal className="h-3 w-3" />
              <span>Copy Command</span>
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
              className="h-7 justify-start gap-2 text-xs"
            >
              <FileText className="h-3 w-3" />
              <span>Install Guide</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Show installation instructions</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}