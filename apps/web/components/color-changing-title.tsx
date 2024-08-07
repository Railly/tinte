"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeConfig } from "@/lib/core/types";
import { cn } from "@/lib/utils";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

const words = ["Design", "Visualize", "Share"];
const accentColors = ["accent", "accent-2", "accent-3"] as const;

interface ColorChangingTitleProps {
  themeConfig: ThemeConfig;
  isTextareaFocused: boolean;
}

export function ColorChangingTitle({
  themeConfig,
  isTextareaFocused,
}: ColorChangingTitleProps) {
  const { currentTheme } = useBinaryTheme();
  const [colorIndex, setColorIndex] = useState(0);

  const rawWordClassName = cn("mx-1", {
    "opacity-50": isTextareaFocused,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % accentColors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h2 className="flex flex-col items-center text-2xl md:text-3xl font-bold py-2 transition-opacity">
      <span className="flex mr-2">
        {words.map((word, index) => (
          <span key={word} className="flex items-center">
            <motion.span
              animate={{
                color:
                  themeConfig.palette[currentTheme]?.[
                    accentColors[
                      (colorIndex + index) % accentColors.length
                    ] as keyof (typeof themeConfig.palette)[typeof currentTheme]
                  ],
              }}
              transition={{ duration: 1 }}
            >
              {word}
            </motion.span>
            {index < words.length - 2 && (
              <span className={rawWordClassName}>,</span>
            )}
            {index === words.length - 2 && (
              <span className={rawWordClassName}>and</span>
            )}
            {index < words.length - 1 && (
              <span className={rawWordClassName}></span>
            )}
          </span>
        ))}
      </span>
      <span className={rawWordClassName}>your VS Code theme</span>
    </h2>
  );
}
