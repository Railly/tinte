import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ 
  show, 
  message = "Success!", 
  onComplete 
}: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
          onAnimationComplete={(definition) => {
            if (definition.opacity === 1 && onComplete) {
              setTimeout(onComplete, 1500);
            }
          }}
        >
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
            <Check className="w-3 h-3 text-green-400" />
            
            <span className="text-white font-medium text-sm">
              {message}
            </span>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}