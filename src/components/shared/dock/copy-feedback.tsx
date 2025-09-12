import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

interface CopyFeedbackProps {
  show: boolean;
  message?: string;
}

export function CopyFeedback({ show, message = "Copied!" }: CopyFeedbackProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-[60]"
        >
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Check className="w-3 h-3" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}