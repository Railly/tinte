"use client";

import { Download, Heart } from "lucide-react";
import { motion } from "motion/react";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { ThemeCardPreview } from "@/components/shared/theme-card-preview";
import { Button } from "@/components/ui/button";
import type { ThemeData } from "@/lib/theme-tokens";
import { extractThemeColors, extractShadcnColors, extractShadcnFonts, formatNumber } from "@/utils/theme-card-helpers";
import { useThemeContext } from "@/providers/theme";

interface ThemeCardProps {
  theme: ThemeData;
  index: number;
  onThemeSelect?: (theme: ThemeData) => void;
  variant?: "grid" | "list";
}

export function ThemeCardListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-50/5 rounded-lg border border-gray-200/60 dark:border-gray-800/60 overflow-hidden animate-pulse">
      <div className="p-4">
        {/* Top section skeleton */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="w-3.5 h-3.5 bg-muted rounded" />
            </div>
            <div className="h-3 bg-muted/60 rounded w-48" />
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-3">
              <div className="h-3 bg-muted rounded w-8" />
              <div className="h-3 bg-muted rounded w-8" />
            </div>
            <div className="h-7 bg-muted rounded w-12" />
          </div>
        </div>

        {/* Color palette skeleton */}
        <div className="space-y-2">
          {/* Color bar skeleton */}
          <div className="flex h-2 rounded-full overflow-hidden border border-border/20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-muted first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>

          {/* Bottom info skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-40" />
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemeCardSkeleton() {
  return (
    <div className="group relative bg-white dark:bg-gray-50/5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden animate-pulse">
      {/* Color preview dots skeleton */}
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Theme Preview skeleton */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800" />

      {/* Theme Info skeleton */}
      <div className="p-4 space-y-3 bg-white dark:bg-gray-50/5">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
          <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ThemeCard({ theme, onThemeSelect, variant = "grid" }: ThemeCardProps) {
  const { isDark } = useThemeContext();

  const handleThemeClick = () => {
    if (onThemeSelect) {
      onThemeSelect(theme);
    }
  };

  const colors = extractThemeColors(theme);
  const shadcnColors = extractShadcnColors(theme, isDark);
  const shadcnFonts = extractShadcnFonts(theme);

  // Debug: uncomment to see font extraction in console
  // console.log('🎨 Theme Card Debug:', { themeName: theme.name, shadcnFonts });

  if (variant === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative bg-white dark:bg-gray-50/5 rounded-lg border border-gray-200/60 dark:border-gray-800/60 hover:border-gray-300/80 dark:hover:border-gray-700/80 hover:shadow-sm cursor-pointer overflow-hidden"
        onClick={handleThemeClick}
        style={{ ...shadcnColors, ...shadcnFonts } as React.CSSProperties}
      >
        <div className="p-4">
          {/* Top section - Theme info and stats */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground text-sm truncate">
                  {theme.name}
                </h3>
                {theme.author && (
                  <div className="flex items-center">
                    {theme.author === "tweakcn" ? (
                      <TweakCNIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : theme.author === "ray.so" ? (
                      <RaycastIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : theme.author === "tinte" ? (
                      <Logo size={14} className="text-muted-foreground" />
                    ) : (
                      <span className="text-xs text-muted-foreground">by {theme.author}</span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {theme.description}
              </p>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{formatNumber(theme.likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{formatNumber(theme.downloads)}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3 h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeClick();
                }}
              >
                Open
              </Button>
            </div>
          </div>

          {/* Color palette display */}
          <div className="space-y-2">
            {/* Primary color bar */}
            <div className="flex h-2 rounded-full overflow-hidden border border-border/20">
              {Object.values(colors).slice(0, 8).map((color, i) => (
                <div
                  key={i}
                  className="flex-1 first:rounded-l-full last:rounded-r-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Color labels/tokens preview */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{Object.keys(colors).length} colors</span>
                <span>•</span>
                {(shadcnFonts as any).fontFamily ? (
                  <span className="font-sans">Font: {(shadcnFonts as any).fontFamily.split(',')[0]}</span>
                ) : (
                  <span>Compatible with shadcn/ui</span>
                )}
              </div>

              {/* Quick color dots for key colors */}
              <div className="flex gap-1">
                {Object.entries(colors).slice(0, 4).map(([key, color]) => (
                  <div
                    key={key}
                    className="w-2 h-2 rounded-full border border-border/40"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-white dark:bg-gray-50/5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 hover:border-gray-300/80 dark:hover:border-gray-700/80 hover:shadow-sm cursor-pointer overflow-hidden"
      onClick={handleThemeClick}
      style={{ ...shadcnColors, ...shadcnFonts } as React.CSSProperties}
    >
      {/* Color preview dots */}
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        {Object.values(colors).slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full border border-white/40 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Theme Preview */}
      <div className="relative h-40 bg-background text-foreground overflow-hidden">
        <ThemeCardPreview />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-gradient-to-b from-foreground/20 to-foreground/10 flex items-center justify-center"
        >
          <Button
            size="sm"
            className="bg-foreground text-background font-medium px-6"
            onClick={(e) => {
              e.stopPropagation();
              handleThemeClick();
            }}
          >
            Open in Editor
          </Button>
        </motion.div>
      </div>

      {/* Theme Info */}
      <div className="p-4 space-y-3 bg-white dark:bg-gray-50/5">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
            {theme.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 leading-relaxed">
            {theme.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(theme.likes)}
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {formatNumber(theme.downloads)}
            </div>
          </div>

          {/* Author */}
          {theme.author && (
            <div className="flex items-center">
              {theme.author === "tweakcn" ? (
                <TweakCNIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ) : theme.author === "ray.so" ? (
                <RaycastIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ) : theme.author === "tinte" ? (
                <Logo size={14} className="text-gray-400 dark:text-gray-500" />
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">{theme.author}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
