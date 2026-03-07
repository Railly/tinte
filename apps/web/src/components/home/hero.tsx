"use client";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { PromptInput } from "@/components/home/prompt-input";
import { PROVIDER_ICONS } from "@/config/providers";
import { useLoop } from "@/lib/hooks/use-loop";
import type { ThemeData } from "@/lib/theme";
import { useActiveTheme, useUserThemes } from "@/stores/hooks";
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
  const { mounted } = useActiveTheme();
  const { addThemes } = useUserThemes();
  const [copied, setCopied] = useState(false);

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

  const installCommand =
    "npx shadcn@latest add https://tinte.dev/api/preset/one-hunter";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 min-h-[65dvh] max-w-6xl mx-auto">
      <div className="flex flex-col items-center gap-2 md:gap-4 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/40 px-3 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm">
          <span className="font-mono text-xs text-primary">v4</span>
          Agent-Native Design Systems
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
              <span>preset</span>
            </div>
          </div>
          <div className="flex text-sm sm:text-md md:text-lg  text-muted-foreground font-light text-center max-w-2xl">
            Generate, compile, and install complete design systems from one
            source of truth. 500+ presets, 19 export formats.
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
      <div className="mt-6 w-full max-w-2xl mx-auto">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md bg-muted/60 border border-border/60 font-mono text-[13px] text-muted-foreground hover:border-border transition-colors cursor-pointer group"
        >
          <span className="text-emerald-500 select-none shrink-0">~</span>
          <span className="flex-1 text-left truncate">
            <span className="text-muted-foreground/60">npx</span> shadcn@latest
            add{" "}
            <span className="text-primary/80">
              tinte.dev/api/preset/one-hunter
            </span>
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity shrink-0" />
          )}
        </button>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground/60">
          <span>shadcn CLI v4</span>
          <span className="text-border hidden sm:inline">|</span>
          <span>OKLCH color space</span>
          <span className="text-border hidden sm:inline">|</span>
          <span>Agent-ready API</span>
        </div>
      </div>
    </div>
  );
}
