import { Check, Cloud, CloudOff, Loader2, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SyncStatus = "saved" | "saving" | "unsaved" | "synced" | "error";

interface SyncIndicatorProps {
  status: SyncStatus;
  lastSaved: Date;
  className?: string;
}

export function SyncIndicator({ status, lastSaved, className = "" }: SyncIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case "saving":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "saved":
        return <Check className="w-3 h-3" />;
      case "synced":
        return <Cloud className="w-3 h-3" />;
      case "error":
        return <AlertCircle className="w-3 h-3" />;
      case "unsaved":
        return <Save className="w-3 h-3" />;
      default:
        return <CloudOff className="w-3 h-3" />;
    }
  };

  const getColor = () => {
    switch (status) {
      case "saving":
        return "text-blue-400";
      case "saved":
        return "text-green-400";
      case "synced":
        return "text-white/60";
      case "error":
        return "text-red-400";
      case "unsaved":
        return "text-orange-400";
      default:
        return "text-white/40";
    }
  };

  const getText = () => {
    switch (status) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "synced":
        return "Synced";
      case "error":
        return "Error";
      case "unsaved":
        return "Unsaved";
      default:
        return "Offline";
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 30) return "•";
    if (diffInSeconds < 60) return "1m";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className={`flex items-center gap-1.5 text-xs ${getColor()} ${className} w-16`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.2 }}
          className="flex-shrink-0"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
      
      <motion.span
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="font-medium text-[11px] truncate"
      >
        {getText()}
      </motion.span>
    </motion.div>
  );
}