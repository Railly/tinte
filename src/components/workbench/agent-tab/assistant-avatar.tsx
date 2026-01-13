"use client";

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/shared/layout";

interface AssistantAvatarProps {
  isLoading?: boolean;
}

export function AssistantAvatar({ isLoading = false }: AssistantAvatarProps) {
  return (
    <div className="relative flex-shrink-0 pt-2">
      <motion.div
        className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/30"
        animate={
          isLoading
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }
            : {
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 2,
          repeat: isLoading ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <Logo size={20} />
      </motion.div>

      {isLoading && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-500/40 flex items-center justify-center border border-amber-300/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className="h-1.5 w-1.5 text-amber-500" />
        </motion.div>
      )}
    </div>
  );
}
