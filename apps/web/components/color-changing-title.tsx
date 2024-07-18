"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeConfig } from "@/lib/core/types";

const words = ["Design", "Visualize", "Share"];
const accentColors = ["accent", "accent-2", "accent-3"] as const;

interface ColorChangingTitleProps {
  themeConfig: ThemeConfig;
}

export function ColorChangingTitle({ themeConfig }: ColorChangingTitleProps) {
  const { theme: nextTheme } = useTheme();
  const currentTheme = nextTheme === "dark" ? "dark" : "light";
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % accentColors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h2 className="flex flex-col items-center text-3xl font-bold py-2">
      <span className="flex mr-2">
        {words.map((word, index) => (
          <span key={word} className="flex items-center">
            <motion.span
              animate={{
                color:
                  themeConfig.palette[currentTheme][
                    accentColors[
                      (colorIndex + index) % accentColors.length
                    ] as keyof (typeof themeConfig.palette)[typeof currentTheme]
                  ],
              }}
              transition={{ duration: 1 }}
            >
              {word}
            </motion.span>
            {index < words.length - 2 && <span className="mx-1">,</span>}
            {index === words.length - 2 && <span className="mx-1">and</span>}
            {index < words.length - 1 && <span className="mr-1"></span>}
          </span>
        ))}
      </span>
      <span>your VS Code theme</span>
    </h2>
  );
}
