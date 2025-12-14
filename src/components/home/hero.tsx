"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import useMeasure from "react-use-measure";
import { PromptInput } from "@/components/home/prompt-input";
import { PROVIDER_ICONS } from "@/config/providers";
import { useLoop } from "@/hooks/use-loop";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { mergeRefs } from "@/utils/merge-refs";

interface HeroProps {
  userThemes?: ThemeData[];
  tweakCNThemes?: ThemeData[];
  tinteThemes?: ThemeData[];
  raysoThemes?: ThemeData[];
}

export function Hero({
  userThemes = [],
  tweakCNThemes = [],
  tinteThemes = [],
  raysoThemes = [],
}: HeroProps) {
  const [ref, bounds] = useMeasure();
  const [active, ref2] = useLoop();
  const { addThemes, mounted } = useThemeContext();

  // Add themes to store once on mount
  useEffect(() => {
    if (!mounted) return;

    const allNewThemes: ThemeData[] = [
      ...userThemes,
      ...tinteThemes,
      ...tweakCNThemes,
      ...raysoThemes,
    ];

    if (allNewThemes.length > 0) {
      addThemes(allNewThemes);
    }
  }, [mounted, userThemes, tweakCNThemes, tinteThemes, raysoThemes, addThemes]);

  return (
    <div className="flex flex-col items-center justify-center px-4 min-h-[65dvh]">
      <div className="flex flex-col items-center gap-2 md:gap-4 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/40 px-3 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <title>Star icon</title>
            <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5L6 0z" />
          </svg>
          AI Theme Editor
        </div>
        <h1 className="flex flex-col items-center gap-2 md:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">
            <span>Design your</span>
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              <motion.div
                animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 55,
                }}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <div
                  ref={mergeRefs([ref, ref2])}
                  className="flex items-center gap-2 w-fit whitespace-nowrap"
                >
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                    <AnimatePresence mode="wait" initial={false}>
                      {active && PROVIDER_ICONS[active] && (
                        <motion.div
                          key={active}
                          initial={{
                            scale: 0.5,
                            filter: "blur(4px)",
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            filter: "blur(0px)",
                            opacity: 1,
                          }}
                          exit={{
                            scale: 0.5,
                            filter: "blur(4px)",
                            opacity: 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 45,
                          }}
                          className="absolute inset-0"
                        >
                          {(() => {
                            const IconComponent = PROVIDER_ICONS[active];
                            return (
                              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                            );
                          })()}
                        </motion.div>
                      )}
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
            Define colors once, ship them everywhere.
          </div>
        </h1>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <PromptInput
          onSubmit={(kind, raw) => {
            console.log("Submitted:", kind, raw);
          }}
        />
      </div>
    </div>
  );
}
