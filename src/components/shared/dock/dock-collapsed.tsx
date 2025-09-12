import { Code, Copy, MoreHorizontal, Undo2, Redo2, Check, Save, RotateCcw } from "lucide-react";
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
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  onSave?: () => void;
  onReset?: () => void;
  hasChanges?: boolean;
}

export function DockCollapsed({
  primaryActionConfig,
  isExporting,
  onPrimaryAction,
  onCopyCommand,
  onShowInstallGuide,
  onExpand,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  onSave,
  onReset,
  hasChanges = false,
}: DockCollapsedProps) {
  const [copyFeedback, setCopyFeedback] = React.useState<'copy' | 'code' | null>(null);

  const handleCopyClick = () => {
    onCopyCommand();
    setCopyFeedback('copy');
    setTimeout(() => setCopyFeedback(null), 1500);
  };

  const handleCodeClick = () => {
    onShowInstallGuide();
    setCopyFeedback('code');
    setTimeout(() => setCopyFeedback(null), 1500);
  };

  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.25, delay: 0.1 }}
      className="flex items-center justify-between w-full pl-2"
    >
      <div className="flex items-center gap-1 flex-shrink-0">
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-1 h-7 bg-transparent hover:bg-white/10 border-0 text-white/70 hover:text-white rounded-md transition-colors text-xs ${
              hasChanges ? 'text-orange-400 hover:text-orange-300' : ''
            }`}
            onClick={onSave}
            disabled={!hasChanges}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        )}
        
        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-7 bg-transparent hover:bg-white/10 border-0 text-white/70 hover:text-white rounded-md transition-colors text-xs"
            onClick={onReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
      <Button
        onClick={onPrimaryAction}
        disabled={isExporting}
        className="px-3 bg-transparent hover:bg-white/10 border-0 text-white font-medium text-sm rounded-full transition-colors"
        size="sm"
        variant="ghost"
      >
        {React.createElement(primaryActionConfig.icon, { className: "size-4" })}
        {primaryActionConfig.label}
      </Button>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors disabled:opacity-30 relative"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-3 h-3" />
            {canUndo && undoCount > 0 && (
              <sup className="absolute -top-0.5 -right-0.5 text-[8px] text-white/80 font-mono bg-white/10 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {undoCount}
              </sup>
            )}
          </Button>
        )}

        {onRedo && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors disabled:opacity-30 relative"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="w-3 h-3" />
            {canRedo && redoCount > 0 && (
              <sup className="absolute -top-0.5 -right-0.5 text-[8px] text-white/80 font-mono bg-white/10 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {redoCount}
              </sup>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={`w-8 h-8 p-0 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-all duration-200 ${copyFeedback === 'copy' ? 'bg-green-500/20 text-green-400 scale-110' : ''
            }`}
          onClick={handleCopyClick}
        >
          <motion.div
            animate={{
              scale: copyFeedback === 'copy' ? 1.05 : 1
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          >
            {copyFeedback === 'copy' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </motion.div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`w-8 h-8 p-0 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-all duration-200 ${copyFeedback === 'code' ? 'bg-blue-500/20 text-blue-400 scale-110' : ''
            }`}
          onClick={handleCodeClick}
        >
          <motion.div
            animate={{
              scale: copyFeedback === 'code' ? 1.05 : 1
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          >
            <Code className="w-3 h-3" />
          </motion.div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors"
          onClick={onExpand}
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}
