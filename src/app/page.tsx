"use client";
import * as React from "react";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion } from "motion/react";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";
import { VSCodeIcon } from "@/components/shared/icons/vscode";
import { useLoop } from "@/hooks/use-loop";
import { mergeRefs } from "@/utils/merge-refs";
import HeroInputDock from "@/components/hero-input-dock";

const providerIcons = {
  "shadcn/ui": ShadcnIcon,
  "VS Code": VSCodeIcon
};

export default function Home() {
  const [ref, bounds] = useMeasure();
  const [active, ref2] = useLoop();

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 justify-center min-h-screen px-4 py-8">
      <div className="flex flex-col items-center gap-2 md:gap-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/40 px-3 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5L6 0z" />
          </svg>
          AI Theme Editor
        </div>
        <h1 className="flex flex-col items-center gap-2 md:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold overflow-hidden text-center">
            <span>Design your</span>
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              <motion.div
                animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 55,
                }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <div
                  ref={mergeRefs([ref, ref2])}
                  className="flex items-center gap-2 w-fit whitespace-nowrap"
                >
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                    <AnimatePresence mode="wait" initial={false}>
                      {Object.entries(providerIcons).map(([name, IconComponent]) => (
                        <motion.div
                          key={name}
                          initial={{
                            scale: 0.5,
                            filter: "blur(4px)",
                            opacity: 0
                          }}
                          animate={name === active ? {
                            scale: 1,
                            filter: "blur(0px)",
                            opacity: 1
                          } : {
                            scale: 0.5,
                            filter: "blur(4px)",
                            opacity: 0
                          }}
                          exit={{
                            scale: 0.5,
                            filter: "blur(4px)",
                            opacity: 0
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 45,
                          }}
                          className="absolute inset-0"
                        >
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold whitespace-nowrap">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {active?.split("").map((letter, index) => {
                        return (
                          <motion.div
                            initial={{ opacity: 0, filter: "blur(2px)" }}
                            animate={{
                              opacity: 1,
                              filter: "blur(0px)",
                              transition: {
                                type: "spring",
                                stiffness: 350,
                                damping: 55,
                                delay: index * 0.015,
                              },
                            }}
                            exit={{
                              opacity: 0,
                              filter: "blur(2px)",
                              transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 55,
                              },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 55,
                            }}
                            key={index + letter + active}
                            className="inline-block"
                          >
                            {letter}
                            {letter === " " ? "\u00A0" : ""}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              <span>theme</span>
            </div>
          </div>
          <div className="flex text-sm sm:text-md md:text-lg lg:text-xl text-muted-foreground font-light text-center">
            Define tokens once, ship them everywhere.
          </div>
        </h1>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <HeroInputDock
          onSubmit={(kind, raw) => {
            console.log('Submitted:', kind, raw);
          }}
        />
      </div>
    </div>
  );
}
