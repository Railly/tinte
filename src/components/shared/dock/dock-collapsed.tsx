import { Code, Copy, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DockCollapsedProps {
  primaryActionConfig: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isExporting: boolean;
  onPrimaryAction: () => void;
  onCopyCommand: () => void;
  onShowInstallGuide: () => void;
  onExpand: () => void;
}

export function DockCollapsed({
  primaryActionConfig,
  isExporting,
  onPrimaryAction,
  onCopyCommand,
  onShowInstallGuide,
  onExpand,
}: DockCollapsedProps) {
  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.25, delay: 0.1 }}
      className="flex items-center gap-1 justify-between w-full"
    >
      <Button
        onClick={onPrimaryAction}
        disabled={isExporting}
        className="px-4 bg-transparent hover:bg-white/10 border-0 text-white font-medium text-sm rounded-full transition-colors flex-shrink-0"
        size="sm"
        variant="ghost"
      >
        {React.createElement(primaryActionConfig.icon, { className: "size-4" })}
        {primaryActionConfig.label}
      </Button>

      <Separator orientation="vertical" className="!h-4" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors"
          onClick={onCopyCommand}
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors"
          onClick={onShowInstallGuide}
        >
          <Code className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors"
          onClick={onExpand}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
