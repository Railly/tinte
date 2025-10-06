"use client";

import { Download, Edit, Heart, UserX } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { ThemeCardPreview } from "@/components/shared/theme-card-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useThemeFonts } from "@/hooks/use-theme-fonts";
import type { ThemeData } from "@/lib/theme-tokens";
import { getVendorIcon } from "@/lib/vendor-icons";
import { useThemeContext } from "@/providers/theme";
import {
  extractShadcnColors,
  extractShadcnFonts,
  extractShadcnShadows,
  extractThemeColors,
  formatNumber,
} from "@/utils/theme-card-helpers";

interface ThemeCardProps {
  theme: ThemeData;
  index: number;
  onThemeSelect?: (theme: ThemeData) => void;
  variant?: "grid" | "list";
  showUserInfo?: boolean;
}

export function ThemeCardListSkeleton() {
  return (
    <div className="bg-background/50 rounded-lg border border-border/60 overflow-hidden animate-pulse">
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
    <div className="group relative bg-background/50 rounded-xl border border-border/60 overflow-hidden animate-pulse">
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
      <div className="relative h-40 bg-muted/30" />

      {/* Theme Info skeleton */}
      <div className="p-4 space-y-3 bg-background/80">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted/60 rounded w-full" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 bg-muted rounded w-8" />
            <div className="h-3 bg-muted rounded w-8" />
          </div>
          <div className="w-3.5 h-3.5 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function ThemeCard({
  theme,
  onThemeSelect,
  variant = "grid",
  showUserInfo = false,
}: ThemeCardProps) {
  const { isDark } = useThemeContext();
  const router = useRouter();

  // Ensure fonts are loaded for this theme card
  useThemeFonts(theme);

  const handleApplyTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onThemeSelect) {
      onThemeSelect(theme);
    }
  };

  const handleOpenInEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    // First apply the theme
    if (onThemeSelect) {
      onThemeSelect(theme);
    }
    // Then navigate to workbench - use theme slug if available, otherwise generate new ID with prompt
    if (theme.slug) {
      router.push(`/workbench/${theme.slug}`);
    } else {
      const workbenchId = nanoid();
      const prompt = `Create a theme similar to "${theme.name}" with these colors: primary ${theme.colors?.primary}, background ${theme.colors?.background}, accent ${theme.colors?.accent}`;
      router.push(
        `/workbench/${workbenchId}?prompt=${encodeURIComponent(prompt)}`,
      );
    }
  };

  const handleThemeClick = () => {
    // Default click behavior - just apply theme
    if (onThemeSelect) {
      onThemeSelect(theme);
    }
  };

  const colors = extractThemeColors(theme);
  const shadcnColors = extractShadcnColors(theme, isDark);
  const shadcnFonts = extractShadcnFonts(theme);
  const shadcnShadows = extractShadcnShadows(theme, isDark);

  // Check if theme has a vendor icon
  const VendorIcon = theme.slug ? getVendorIcon(theme.slug) : null;

  // Debug: uncomment to see font extraction in console
  // console.log('🎨 Theme Card Debug:', { themeName: theme.name, shadcnFonts });

  if (variant === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative bg-background/50 backdrop-blur-sm rounded-lg border border-border/60 hover:border-border/80 hover:shadow-sm cursor-pointer overflow-hidden transition-colors"
        onClick={handleThemeClick}
        style={
          {
            ...shadcnColors,
            ...shadcnFonts,
            ...shadcnShadows,
          } as React.CSSProperties
        }
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
                  <div className="flex items-center gap-1">
                    {VendorIcon ? (
                      <VendorIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : showUserInfo &&
                      theme.provider === "tinte" &&
                      (theme as any).user?.image ? (
                      <>
                        <Avatar className="w-3.5 h-3.5">
                          <AvatarImage
                            src={(theme as any).user.image}
                            alt={(theme as any).user.name || "User"}
                          />
                          <AvatarFallback className="text-[8px]">
                            {(
                              (theme as any).user.name?.[0] || "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          by {(theme as any).user.name || "Anonymous"}
                        </span>
                      </>
                    ) : showUserInfo && theme.provider === "tinte" ? (
                      <>
                        <UserX className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          by Anonymous
                        </span>
                      </>
                    ) : theme.author === "tweakcn" ? (
                      <TweakCNIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : theme.author === "ray.so" ? (
                      <RaycastIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : theme.author === "tinte" ? (
                      <Logo size={14} className="text-muted-foreground" />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        by {theme.author}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {theme.concept || theme.description}
              </p>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart
                    className={`w-3 h-3 ${theme.isFavorite ? "fill-current text-red-500" : ""}`}
                  />
                  <span>{formatNumber(theme.likes || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>
                    {formatNumber(
                      (theme as any).installs || theme.downloads || 0,
                    )}
                  </span>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-2 h-7"
                  onClick={handleApplyTheme}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="text-xs px-2 h-7 gap-1"
                  onClick={handleOpenInEditor}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Color palette display */}
          <div className="space-y-2">
            {/* Primary color bar */}
            <div className="flex h-2 rounded-full overflow-hidden border border-border/20">
              {Object.values(colors)
                .slice(0, 8)
                .map((color, i) => (
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
                  <span className="font-sans">
                    Font: {(shadcnFonts as any).fontFamily.split(",")[0]}
                  </span>
                ) : (
                  <span>Compatible with shadcn/ui</span>
                )}
              </div>

              {/* Quick color dots for key colors */}
              <div className="flex gap-1">
                {Object.entries(colors)
                  .slice(0, 4)
                  .map(([key, color]) => (
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
      className="group relative bg-background/50 backdrop-blur-sm rounded-xl border border-border/60 hover:border-border/80 hover:shadow-sm cursor-pointer overflow-hidden transition-colors"
      onClick={handleThemeClick}
      style={
        {
          ...shadcnColors,
          ...shadcnFonts,
          ...shadcnShadows,
        } as React.CSSProperties
      }
    >
      {/* Color preview dots */}
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        {Object.values(colors)
          .slice(0, 4)
          .map((color, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full border border-white/40"
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
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="font-medium px-4"
              onClick={handleApplyTheme}
            >
              Apply Theme
            </Button>
            <Button
              size="sm"
              className="bg-foreground text-background font-medium px-4 gap-1"
              onClick={handleOpenInEditor}
            >
              <Edit className="w-3 h-3" />
              Open in Editor
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Theme Info */}
      <div className="p-4 space-y-3 bg-background/80">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground text-sm leading-tight">
            {theme.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
            {theme.concept || theme.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart
                className={`w-3 h-3 ${theme.isFavorite ? "fill-current text-red-500" : ""}`}
              />
              {formatNumber(theme.likes || 0)}
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {formatNumber((theme as any).installs || theme.downloads || 0)}
            </div>
          </div>

          {/* Author */}
          {theme.author && (
            <div className="flex items-center gap-1">
              {VendorIcon ? (
                <VendorIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ) : showUserInfo &&
                theme.provider === "tinte" &&
                (theme as any).user?.image ? (
                <>
                  <Avatar className="w-3.5 h-3.5">
                    <AvatarImage
                      src={(theme as any).user.image}
                      alt={(theme as any).user.name || "User"}
                    />
                    <AvatarFallback className="text-[8px]">
                      {((theme as any).user.name?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {(theme as any).user.name || "Anonymous"}
                  </span>
                </>
              ) : showUserInfo && theme.provider === "tinte" ? (
                <>
                  <UserX className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Anonymous
                  </span>
                </>
              ) : theme.author === "tweakcn" ? (
                <TweakCNIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ) : theme.author === "ray.so" ? (
                <RaycastIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ) : theme.author === "tinte" ? (
                <Logo size={14} className="text-gray-400 dark:text-gray-500" />
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {theme.author}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
