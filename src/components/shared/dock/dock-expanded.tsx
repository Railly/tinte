import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Copy, Share, Info, X, Palette, Code, ChevronLeft, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DockExpandedProps {
  onShare: () => void;
  onShowInfo: () => void;
  onCollapse: () => void;
  isSharing: boolean;
}

export function DockExpanded({
  onShare,
  onShowInfo,
  onCollapse,
  isSharing,
}: DockExpandedProps) {
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.25, delay: 0.1 }}
      className="w-full relative"
    >
      <div className="flex justify-center gap-1 items-center">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={onCollapse}
        >
          <ArrowLeft className="size-3" />
        </Button>

        <Separator orientation="vertical" className="!h-4" />

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={onShare}
          disabled={isSharing}
        >
          <Share className="w-5 h-5" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={onShowInfo}
        >
          <Info className="w-5 h-5" />
          Info
        </Button>
      </div>
    </motion.div>
  );
}