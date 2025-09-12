import { ArrowLeft, Info, Share, Save, Download, Copy, Code, Undo2, Redo2, ExternalLink, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface DockExpandedProps {
  onShare: () => void;
  onShowInfo: () => void;
  onCollapse: () => void;
  isSharing: boolean;
  onSave?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
  onCopy?: () => void;
  onCopyCommand?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  providerName?: string;
  syncStatus?: "saved" | "saving" | "unsaved" | "synced" | "error";
}

export function DockExpanded({
  onShare,
  onShowInfo,
  onCollapse,
  isSharing,
  onSave,
  onExport,
  isSaving = false,
  isExporting = false,
  onCopy,
  onCopyCommand,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  providerName = "Theme",
  syncStatus = "synced",
}: DockExpandedProps) {
  const [copyFeedback, setCopyFeedback] = useState<'copy' | 'command' | null>(null);
  const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    disabled, 
    variant = "default",
    showSparkle = false,
    feedbackType,
    showCheck = false
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "default" | "primary" | "destructive";
    showSparkle?: boolean;
    feedbackType?: 'copy' | 'command';
    showCheck?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`
              relative rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200
              ${variant === "primary" 
                ? "bg-white/15 text-white hover:bg-white/25 border border-white/20" 
                : variant === "destructive"
                ? "text-red-300 hover:text-red-200 hover:bg-red-500/10"
                : "text-white/70 hover:text-white hover:bg-white/10"
              }
              ${disabled ? "opacity-40 cursor-not-allowed" : ""}
              ${feedbackType && copyFeedback === feedbackType ? "bg-green-500/20 text-green-400 scale-110" : ""}
            `}
            onClick={onClick}
            disabled={disabled}
          >
            <motion.div
              className="flex items-center"
              animate={{
                rotate: feedbackType && copyFeedback === feedbackType ? 360 : 0
              }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
            >
              {showCheck ? (
                <Check className="w-3.5 h-3.5 mr-1.5" />
              ) : (
                <Icon className="w-3.5 h-3.5 mr-1.5" />
              )}
              {label}
            </motion.div>
            {showSparkle && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs bg-black/90 border-white/20">
        {label}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.25, delay: 0.1 }}
      className="w-full relative p-3"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-xs font-medium"
        >
          {providerName} Actions
        </motion.div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 rounded-full text-white/50 hover:text-white hover:bg-white/10"
              onClick={onCollapse}
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs bg-black/90 border-white/20">
            Back
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Action Groups */}
      <div className="space-y-3">
        {/* Primary Actions */}
        <motion.div 
          className="flex gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {onSave && (
            <ActionButton
              icon={Save}
              label={isSaving ? "Saving..." : "Save"}
              onClick={onSave}
              disabled={isSaving}
              variant="primary"
              showSparkle={syncStatus === "saved"}
            />
          )}
          
          {onExport && (
            <ActionButton
              icon={Download}
              label={isExporting ? "Exporting..." : "Export"}
              onClick={onExport}
              disabled={isExporting}
              variant="primary"
            />
          )}
        </motion.div>

        <Separator className="bg-white/10" />

        {/* Secondary Actions */}
        <motion.div 
          className="grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {onUndo && (
            <div className="relative">
              <ActionButton
                icon={Undo2}
                label="Undo"
                onClick={onUndo}
                disabled={!canUndo}
              />
              {canUndo && undoCount > 0 && (
                <sup className="absolute -top-1 -right-1 text-[8px] text-white/80 font-mono bg-white/15 rounded-full w-3 h-3 flex items-center justify-center">
                  {undoCount}
                </sup>
              )}
            </div>
          )}
          
          {onRedo && (
            <div className="relative">
              <ActionButton
                icon={Redo2}
                label="Redo"
                onClick={onRedo}
                disabled={!canRedo}
              />
              {canRedo && redoCount > 0 && (
                <sup className="absolute -top-1 -right-1 text-[8px] text-white/80 font-mono bg-white/15 rounded-full w-3 h-3 flex items-center justify-center">
                  {redoCount}
                </sup>
              )}
            </div>
          )}

          {onCopy && (
            <ActionButton
              icon={Copy}
              label={copyFeedback === 'copy' ? "Copied!" : "Copy"}
              onClick={() => {
                onCopy();
                setCopyFeedback('copy');
                setTimeout(() => setCopyFeedback(null), 1500);
              }}
              feedbackType="copy"
              showCheck={copyFeedback === 'copy'}
            />
          )}

          {onCopyCommand && (
            <ActionButton
              icon={Code}
              label={copyFeedback === 'command' ? "Copied!" : "Command"}
              onClick={() => {
                onCopyCommand();
                setCopyFeedback('command');
                setTimeout(() => setCopyFeedback(null), 1500);
              }}
              feedbackType="command"
              showCheck={copyFeedback === 'command'}
            />
          )}
        </motion.div>

        <Separator className="bg-white/10" />

        {/* Utility Actions */}
        <motion.div 
          className="flex gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActionButton
            icon={Share}
            label={isSharing ? "Sharing..." : "Share"}
            onClick={onShare}
            disabled={isSharing}
          />
          
          <ActionButton
            icon={Info}
            label="Info"
            onClick={onShowInfo}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
