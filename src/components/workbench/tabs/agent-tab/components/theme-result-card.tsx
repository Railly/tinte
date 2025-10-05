"use client";

import { Palette, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAgentSessionStore } from "@/stores/agent-session-store";
import { DEFAULT_OPEN_SECTIONS } from "../constants";
import { ColorsSection } from "./theme-sections/colors-section";
import { RadiusSection } from "./theme-sections/radius-section";
import { ShadowsSection } from "./theme-sections/shadows-section";
import { TypographySection } from "./theme-sections/typography-section";

interface ThemeResultCardProps {
  themeOutput: any;
  currentMode: "light" | "dark";
  loadingTimer: number;
  onApplyTheme: (themeOutput: any) => void;
  isFirstTheme?: boolean;
}

export function ThemeResultCard({
  themeOutput,
  currentMode,
  loadingTimer,
  onApplyTheme,
  isFirstTheme = false,
}: ThemeResultCardProps) {
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN_SECTIONS);
  const [isSaving, setIsSaving] = useState(false);

  const { canSave, isAuthenticated, loadUserThemes, selectTheme } = useTheme();

  const { firstCreatedThemeId } = useAgentSessionStore();

  const toggleSection = (section: keyof typeof DEFAULT_OPEN_SECTIONS) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleUpdateTheme = async () => {
    if (!canSave || !firstCreatedThemeId) return;

    await onApplyTheme(themeOutput);

    setIsSaving(true);
    try {
      const themeName = themeOutput.title || "AI Generated Theme";

      const extendedRawTheme = {
        light: themeOutput.theme.light,
        dark: themeOutput.theme.dark,
        fonts: themeOutput.fonts,
        radius: themeOutput.radius,
        shadows: themeOutput.shadows,
      };

      // Update directly using API with firstCreatedThemeId
      const response = await fetch(`/api/themes/${firstCreatedThemeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: themeName,
          tinteTheme: extendedRawTheme,
          overrides: {},
          isPublic: true,
          concept: themeOutput.concept,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const savedTheme = result.theme;

        await loadUserThemes();

        setTimeout(() => {
          selectTheme(savedTheme);

          if (
            savedTheme.slug &&
            savedTheme.slug !== "default" &&
            savedTheme.slug !== "theme"
          ) {
            const newUrl = `/workbench/${savedTheme.slug}?tab=agent`;
            window.history.replaceState(null, "", newUrl);
          }
        }, 100);

        toast.success(`"${themeName}" updated successfully!`);
      } else {
        toast.error("Failed to update theme");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Error updating theme");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-3 px-2 w-full max-w-2xl space-y-4">
      {/* Header with status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Crafted in {loadingTimer}s ✨</span>
        </div>
        {isFirstTheme && isAuthenticated && (
          <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
            Saved
          </span>
        )}
      </div>

      {/* Main theme card */}
      <div className="space-y-4 border border-border/50 rounded-lg overflow-hidden bg-card/50">
        {/* Header */}
        <div className="px-4 pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">
              {themeOutput.title || "Custom Theme"}
            </h4>
          </div>
          {themeOutput.concept && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {themeOutput.concept}
            </p>
          )}
        </div>

        {/* Collapsible sections */}
        <div className="space-y-0">
          <ColorsSection
            themeOutput={themeOutput}
            currentMode={currentMode}
            isOpen={openSections.colors}
            onToggle={() => toggleSection("colors")}
          />

          <TypographySection
            themeOutput={themeOutput}
            isOpen={openSections.typography}
            onToggle={() => toggleSection("typography")}
          />

          <RadiusSection
            themeOutput={themeOutput}
            isOpen={openSections.radius}
            onToggle={() => toggleSection("radius")}
          />

          <ShadowsSection
            themeOutput={themeOutput}
            isOpen={openSections.shadows}
            onToggle={() => toggleSection("shadows")}
          />
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 pt-2 flex gap-2 border-t border-border/30">
          <Button
            size="sm"
            onClick={() => onApplyTheme(themeOutput)}
            className="h-8 px-3 flex-1"
          >
            <Sparkles className="h-3 w-3 mr-1.5" />
            Apply Theme
          </Button>

          {/* Only show Update button on subsequent themes (not first) */}
          {isAuthenticated && !isFirstTheme && firstCreatedThemeId && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleUpdateTheme}
              disabled={isSaving}
              className="h-8 px-3"
            >
              <RefreshCw className="h-3 w-3 mr-1.5" />
              {isSaving ? "Updating..." : "Update"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
