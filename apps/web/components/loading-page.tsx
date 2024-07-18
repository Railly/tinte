import React from "react";
import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <motion.div
          className="w-32 h-32 mb-8 mx-auto rounded-full bg-secondary shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-accent to-secondary animate-spin-slow" />
        </motion.div>
        <motion.h2
          className="text-2xl font-semibold text-primary mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Generating Themes
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Crafting beautiful color palettes just for you...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingPage;
