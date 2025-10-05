import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export function SuccessAnimation({
  show,
  message = "Success!",
  onComplete,
}: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.7,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.7,
            filter: "blur(5px)",
          }}
          transition={{
            type: "spring",
            bounce: 0.35,
            duration: 0.5,
          }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 1500);
            }
          }}
        >
          <motion.div
            className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.05,
              type: "spring",
              bounce: 0.4,
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                bounce: 0.5,
                duration: 0.4,
              }}
            >
              <Check className="w-3 h-3 text-green-400" />
            </motion.div>

            <motion.span
              className="text-white font-medium text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                bounce: 0.3,
              }}
            >
              {message}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
