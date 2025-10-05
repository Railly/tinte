"use client";

import { Palette, RefreshCw, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [hasAutoApplied, setHasAutoApplied] = useState(false);

  const {
    saveCurrentTheme,
    canSave,
    isAuthenticated,
    loadUserThemes,
    selectTheme,
    shadcnOverride,
    activeTheme,
  } = useTheme();

  const { firstCreatedThemeId, setFirstCreatedTheme } = useAgentSessionStore();

  // Check if this theme is saved (either from database or first creation in session)
  const isSaved = Boolean(
    themeOutput.databaseId || firstCreatedThemeId === themeOutput.databaseId,
  );

  // Auto-apply every generated theme (session only, no DB save)
  useEffect(() => {
    if (!hasAutoApplied && themeOutput) {
      console.log(
        "🎯 [Auto-apply] Applying generated theme:",
        themeOutput.title,
      );
      onApplyTheme(themeOutput);
      setHasAutoApplied(true);
    }
  }, [hasAutoApplied, themeOutput, onApplyTheme]);

  const toggleSection = (section: keyof typeof DEFAULT_OPEN_SECTIONS) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSaveOrUpdateTheme = async () => {
    if (!canSave) {
      toast.error("Please sign in to save themes");
      return;
    }

    console.log("🎨 [AI Save] About to apply theme:", themeOutput);
    await onApplyTheme(themeOutput);

    setIsSaving(true);
    try {
      const themeName = themeOutput.title || "AI Generated Theme";

      // Check if this is an update to the first created theme
      const isUpdate = Boolean(firstCreatedThemeId);

      console.log("💾 [AI Save] Save operation:", {
        themeName,
        isUpdate,
        firstCreatedThemeId,
        shadcnOverride,
      });

      const result = await saveCurrentTheme(themeName, true, shadcnOverride);

      console.log("📥 [AI Save] Save result:", result);

      if (result.success && result.savedTheme) {
        // Track first created theme if this is the first save
        if (!firstCreatedThemeId && result.savedTheme.id) {
          setFirstCreatedTheme(
            result.savedTheme.id,
            result.savedTheme.slug || "",
          );
          console.log(
            "🎯 [AI Save] Set first created theme:",
            result.savedTheme.id,
          );
        }

        console.log("🔄 [AI Save] Refreshing theme lists...");
        await loadUserThemes();
        console.log("✅ [AI Save] Theme lists refreshed");

        setTimeout(() => {
          console.log(
            "🎯 [AI Save] About to select saved theme:",
            result.savedTheme,
          );

          selectTheme(result.savedTheme);

          console.log("🌐 [AI Save] Theme selected, updating URL...");

          if (
            result.savedTheme.slug &&
            result.savedTheme.slug !== "default" &&
            result.savedTheme.slug !== "theme"
          ) {
            const newUrl = `/workbench/${result.savedTheme.slug}?tab=agent`;
            window.history.replaceState(null, "", newUrl);
            console.log("🔗 [AI Save] URL updated to:", newUrl);
          }
        }, 100);

        toast.success(
          isUpdate
            ? `"${themeName}" updated successfully!`
            : `"${themeName}" saved successfully!`,
        );
      } else {
        console.error("❌ [AI Save] Save failed:", result);
        toast.error(
          isUpdate ? "Failed to update theme" : "Failed to save theme",
        );
      }
    } catch (error) {
      console.error("💥 [AI Save] Error saving theme:", error);
      toast.error("Error saving theme");
    } finally {
      setIsSaving(false);
      console.log("🏁 [AI Save] Save process completed");
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
        {!isSaved && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Unsaved
          </span>
        )}
        {isSaved && firstCreatedThemeId && (
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

          {/* Only show Save/Update button if user is authenticated */}
          {isAuthenticated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveOrUpdateTheme}
              disabled={isSaving}
              className="h-8 px-3"
            >
              {firstCreatedThemeId ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  {isSaving ? "Updating..." : "Update"}
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1.5" />
                  {isSaving ? "Saving..." : "Save"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
