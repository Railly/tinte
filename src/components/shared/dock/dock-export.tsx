import { ArrowLeft, Copy, Download, FileText } from "lucide-react";
import { motion, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DockIcon } from "./base-dock";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";

interface DockExportProps {
  // macOS dock mouse tracking
  mouseX: MotionValue<number>;

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
  mouseX,
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

      {/* Download */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            disabled={isExporting}
            className={`h-10 px-3 text-xs rounded-full gap-1.5 border border-border/50 ${
              isExporting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download {providerName} file</p>
        </TooltipContent>
      </Tooltip>

      {/* Copy Theme */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopyThemeAndReturn || onCopyTheme}
            className="h-10 px-3 text-xs cursor-pointer hover:bg-accent/50 rounded-full gap-1.5 border border-border/50"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy theme content</p>
        </TooltipContent>
      </Tooltip>


      {/* Install Guide */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowInstallGuide}
            className="h-10 px-3 text-xs cursor-pointer hover:bg-accent/50 rounded-full gap-1.5 border border-border/50"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Install Guide</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Show install guide</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}