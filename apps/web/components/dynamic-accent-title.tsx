"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ColorScheme, HSLAColor, ChartColors } from "@/lib/atoms";
import { ThemeConfig, Palette } from "@/lib/core/types";

type ThemeType = ColorScheme | ThemeConfig | ChartColors;

interface DynamicAccentTitleProps {
  theme: ThemeType;
  isTextareaFocused: boolean;
  words: string[];
  accentColors: string[];
  intervalDuration?: number;
  subtitle?: string;
}

export function DynamicAccentTitle({
  theme,
  isTextareaFocused,
  words,
  accentColors,
  intervalDuration = 2000,
  subtitle,
}: DynamicAccentTitleProps) {
  const [colorIndex, setColorIndex] = useState(0);

  const rawWordClassName = cn("mx-1", {
    "opacity-50": isTextareaFocused,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % accentColors.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [accentColors.length, intervalDuration]);

  const getColorString = (color: string | HSLAColor) => {
    if (typeof color === "string") {
      return color;
    }
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`;
  };

  const getColor = (colorKey: string): string | HSLAColor => {
    if ("palette" in theme) {
      // It's a ThemeConfig
      return (
        (theme.palette.light as Palette)[colorKey as keyof Palette] ||
        theme.palette.light.primary
      );
    } else if ("chart1" in theme) {
      // It's a ChartColors
      return (
        (theme as ChartColors)[colorKey as keyof ChartColors] || theme.chart1
      );
    } else {
      // It's a ColorScheme
      return (
        (theme as ColorScheme)[colorKey as keyof ColorScheme] || theme.primary
      );
    }
  };

  return (
    <h2 className="flex flex-col items-center text-xl sm:text-2xl md:text-3xl font-bold py-2 transition-opacity text-center px-4">
      <span className="flex flex-wrap justify-center">
        {words.map((word, index) => (
          <span key={word} className="flex items-center mx-1 my-1">
            <motion.span
              animate={{
                color: getColorString(
                  getColor(
                    accentColors[
                      (colorIndex + index) % accentColors.length
                    ] as any,
                  ),
                ),
              }}
              transition={{ duration: 1 }}
            >
              {word}
            </motion.span>
            {index < words.length - 2 && (
              <span className={cn(rawWordClassName, "hidden sm:inline")}>
                ,
              </span>
            )}
            {index === words.length - 2 && (
              <span className={cn(rawWordClassName, "hidden sm:inline")}>
                and
              </span>
            )}
          </span>
        ))}
      </span>
      {subtitle && <span className={cn(rawWordClassName)}>{subtitle}</span>}
    </h2>
  );
}
