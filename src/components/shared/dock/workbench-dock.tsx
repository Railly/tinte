import {  motion, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteThemeDialog } from "@/components/shared/delete-theme-dialog";
import { DuplicateThemeDialog } from "@/components/shared/duplicate-theme-dialog";
import { RenameThemeDialog } from "@/components/shared/rename-theme-dialog";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { ShareThemeDialog } from "@/components/shared/share-theme-dialog";
import { ImportThemeDialog } from "@/components/shared/import-theme-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useShadcnOverrides,
  useVSCodeOverrides,
} from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useDockState } from "@/hooks/use-dock-state";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { duplicateTheme, renameTheme } from "@/lib/actions/themes";
import { exportTheme, getProvider } from "@/lib/providers";
import { importShadcnTheme } from "@/lib/import-theme";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { DockExport } from "./dock-export";
import { DockMain } from "./dock-main";
import { DockSettings } from "./dock-settings";
import { InstallGuideModal } from "./install-guide-modal";
import { SuccessAnimation } from "./success-animation";

interface DockProps {
  providerId: string;
  providerName: string;
}

export function Dock({ providerId, providerName }: DockProps) {
  const router = useRouter();
  const { dockState, navigateTo, navigateBack, canGoBack, dockRef } =
    useDockState();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isThemePublic, setIsThemePublic] = useState(false);
  const [shouldCopyAfterSave, setShouldCopyAfterSave] = useState(false);

  const {
    updateTinteTheme,
    activeTheme,
    user,
    isAuthenticated,
    isAnonymous,
    canSave,
    saveCurrentTheme,
    deleteTheme,
    unsavedChanges,
    markAsSaved,
    isSaving,
    updateShadcnOverride,
    currentTokens,
    currentMode,
    allThemes,
    userThemes,
    selectTheme,
    tinteTheme,
    loadUserThemes,
    addTheme,
  } = useThemeContext();

  // Use theme from context instead of props
  const theme = tinteTheme;

  // Helper function to handle post-save navigation and theme list refresh
  const handlePostSaveNavigation = async (savedTheme: any, action: string) => {
    try {
      // Refresh theme lists to include the new theme
      await loadUserThemes();

      // Select the saved theme
      if (savedTheme) {
        selectTheme(savedTheme);
      }

      // Navigate to the saved theme with shallow routing
      if (savedTheme?.id) {
        router.replace(`/workbench/${savedTheme.id}`);
      }

      console.log(`✅ ${action} completed:`, {
        themeId: savedTheme?.id,
        themeName: savedTheme?.name,
        navigationUrl: `/workbench/${savedTheme?.id}`
      });
    } catch (error) {
      console.error(`Error in post-${action.toLowerCase()} navigation:`, error);
    }
  };

  // Get override hooks for counting changes
  const shadcnOverrides = useShadcnOverrides();
  const vscodeOverrides = useVSCodeOverrides();

  // Helper to update theme
  const updateTheme = (newTheme: TinteTheme) => {
    updateTinteTheme("light", newTheme.light);
    updateTinteTheme("dark", newTheme.dark);
  };

  const {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    pushToHistory,
    reset,
  } = useThemeHistory(theme, updateTheme);

  const themeIdRef = useRef<string>(null);
  const provider = getProvider(providerId);

  const {
    isExporting,
    handleExport,
    handleCopyTheme,
    handleCopyCommand,
    handlePrimaryAction,
    getPrimaryActionConfig,
    isTemporaryTheme,
  } = useDockActions({
    theme,
    providerId,
    providerName,
    provider,
    themeId: activeTheme?.id,
    canSave,
    themeName: activeTheme?.name,
    vscodeOverrides: vscodeOverrides.allOverrides,
  });

  const prevThemeRef = useRef<string>(null);
  const isInitialLoad = useRef(true);

  // Reset history when switching to a different base theme
  useEffect(() => {
    const currentThemeId = `${activeTheme?.id || 'unknown'}-${theme.light.pr}-${theme.light.sc}-${theme.light.bg}`;
    if (themeIdRef.current && themeIdRef.current !== currentThemeId) {
      reset(theme);
      isInitialLoad.current = true;
    }
    themeIdRef.current = currentThemeId;
  }, [theme, reset, activeTheme?.id]);

  useEffect(() => {
    const themeString = JSON.stringify(theme);

    if (isInitialLoad.current) {
      prevThemeRef.current = themeString;
      isInitialLoad.current = false;
      return;
    }

    if (prevThemeRef.current && prevThemeRef.current !== themeString) {
      pushToHistory(theme);
    }
    prevThemeRef.current = themeString;
  }, [theme, pushToHistory]);

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setSuccessMessage("");
  };

  const showSuccessWithMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  // Navigation handlers with variant key tracking
  const handleNavigateToExport = () => {
    setVariantKey(`${dockState}-export`);
    navigateTo("export");
  };

  const handleNavigateToSettings = () => {
    setVariantKey(`${dockState}-settings`);
    navigateTo("settings");
  };

  const handleNavigateBack = () => {
    setVariantKey(`${dockState}-main`);
    navigateBack();
  };

  // Code action - shows install guide modal
  const handleCodeAction = () => {
    setShowInstallGuide(true);
  };

  // Count total override changes across all providers (memoized to prevent loops)
  // For themes with natural overrides, don't count them as changes
  const shadcnCount = useMemo(() => {
    console.log("🔢 [Override Count] Calculating shadcnCount for theme:", activeTheme?.name);
    console.log("🔢 [Override Count] Current shadcn overrides:", shadcnOverrides.allOverrides);

    // Check if theme has natural overrides (from TweakCN, DB themes, etc.)
    const hasNaturalOverrides = (
      activeTheme?.author === 'tweakcn' ||
      (activeTheme as any)?.overrides?.shadcn ||
      (activeTheme as any)?.shadcn_override
    ) && activeTheme?.rawTheme;

    console.log("🔢 [Override Count] Has natural overrides:", hasNaturalOverrides);

    if (hasNaturalOverrides) {
      // Get original overrides from the theme data
      const originalOverrides =
        (activeTheme as any).overrides?.shadcn ||
        (activeTheme as any).shadcn_override ||
        {};
      const currentOverrides = shadcnOverrides.allOverrides || {};

      console.log("🔢 [Override Count] Original overrides:", originalOverrides);
      console.log("🔢 [Override Count] Current overrides:", currentOverrides);

      // Count only differences from original
      let changeCount = 0;

      ['light', 'dark'].forEach(mode => {
        const original = originalOverrides[mode] || {};
        const current = currentOverrides[mode] || {};

        // Check for new overrides
        Object.keys(current).forEach(key => {
          if (!(key in original) || original[key] !== current[key]) {
            changeCount++;
          }
        });

        // Check for removed overrides
        Object.keys(original).forEach(key => {
          if (!(key in current)) {
            changeCount++;
          }
        });
      });

      console.log("🔢 [Override Count] Total change count:", changeCount);
      return changeCount;
    }

    // For themes without natural overrides, count all overrides as changes
    const totalChanges = Object.values(shadcnOverrides.allOverrides || {}).reduce(
      (total, modeOverrides) => total + Object.keys(modeOverrides || {}).length,
      0,
    );
    console.log("🔢 [Override Count] No natural overrides, total changes:", totalChanges);
    return totalChanges;
  }, [shadcnOverrides.allOverrides, activeTheme]);

  const vscodeCount = useMemo(() => {
    return Object.values(vscodeOverrides.allOverrides || {}).reduce(
      (total, modeOverrides) => total + Object.keys(modeOverrides || {}).length,
      0,
    );
  }, [vscodeOverrides.allOverrides]);

  const overrideChanges = useMemo(() => {
    return shadcnCount + vscodeCount;
  }, [shadcnCount, vscodeCount]);

  const totalChanges = useMemo(() => {
    const total = undoCount + overrideChanges;
    console.log("📊 [Total Changes] undoCount:", undoCount, "overrideChanges:", overrideChanges, "total:", total);
    return total;
  }, [undoCount, overrideChanges]);

  const hasChanges = totalChanges > 0 || unsavedChanges;
  console.log("💾 [Has Changes]", hasChanges, "totalChanges:", totalChanges, "unsavedChanges:", unsavedChanges);
  console.log("🔍 [Dock Debug] Combined hasChanges calculation:", { totalChanges, unsavedChanges, result: hasChanges });

  const exportedTheme = exportTheme(providerId, theme);
  const primaryActionConfig = getPrimaryActionConfig();

  const handleCopyCommandAction = async () => {
    if (providerId === "shadcn") {
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/r/${activeTheme?.id}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else if (providerId === "vscode") {
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/api/v/${activeTheme?.id}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else {
      await handleCopyTheme();
      showSuccessWithMessage("Theme copied!");
    }
    // Return to main dock after copying
    setVariantKey("export-main");
    navigateTo("main");
  };

  // Check if this is a user's own editable theme (consistent with store logic)
  const isOwnTheme =
    activeTheme?.user?.id === user?.id ||
    activeTheme?.author === "You" ||
    (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

  const isCustomTheme =
    activeTheme?.name?.includes("Custom") ||
    activeTheme?.id?.startsWith("custom_");

  // Check if this is a built-in theme from preset files
  const isBuiltInTheme = !activeTheme?.id ||
    activeTheme.id.startsWith('rayso-') ||
    activeTheme.id.startsWith('tinte-') ||
    activeTheme.id.startsWith('tweakcn-') ||
    activeTheme.id.startsWith('modern-minimal') ||
    activeTheme.id.startsWith('violet-bloom') ||
    activeTheme.id.startsWith('t3-chat') ||
    activeTheme.id === 'twitter' ||
    activeTheme.id === 'bubblegum' ||
    activeTheme.id === 'catppuccin' ||
    activeTheme.id === 'graphite' ||
    activeTheme.id === 'supabase' ||
    activeTheme.id === 'nature' ||
    !activeTheme.id.startsWith('theme_');

  // Determine the preset type for ID prefix
  const getPresetType = () => {
    if (!activeTheme?.id) return 'tinte';

    if (activeTheme.author === 'tweakcn') {
      return 'tweakcn';
    }

    // Rayso presets
    if (activeTheme.author === 'ray.so') {
      return 'rayso';
    }

    // Tinte presets (default)
    return 'tinte';
  };

  // Handle save theme - direct update for own themes, modal for custom unsaved
  const handleSaveTheme = async () => {
    if (!canSave) {
      toast.error("Please sign in to save themes");
      return;
    }

    if (!unsavedChanges) {
      toast.success("Theme is already up to date");
      return;
    }

    // Debug ownership detection
    console.log("🔍 Save Debug Info:", {
      isOwnTheme,
      themeId: activeTheme?.id,
      themeAuthor: activeTheme?.author,
      themeUserID: activeTheme?.user?.id,
      currentUserID: user?.id,
      themeIdStartsWithTheme: activeTheme?.id?.startsWith("theme_"),
      activeTheme: activeTheme
    });

    // If it's the user's own theme (regardless of unsaved status), update directly without modal
    if (isOwnTheme && activeTheme?.id && activeTheme.id.startsWith("theme_")) {
      try {
        const result = await saveCurrentTheme();
        if (result.success) {
          toast.success("Theme updated successfully!");
          // Reset undo/redo history since saved state is now the baseline
          reset(theme);
          // Clear unsaved changes state
          markAsSaved();
        } else {
          toast.error("Failed to update theme");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
        toast.error("Error updating theme");
      }
      return;
    }

    // For new themes or non-owned themes, show the modal
    setShowSaveDialog(true);
  };

  // Handle actual save with name from modal
  const handleSaveWithName = async (name: string, makePublic: boolean) => {
    try {
      const result = await saveCurrentTheme(name, makePublic);
      if (result.success && result.savedTheme) {
        toast.success("Theme saved successfully!");
        // Reset undo/redo history since saved state is now the baseline
        reset(theme);
        // Clear unsaved changes state
        markAsSaved();
        // Handle navigation and theme list refresh
        await handlePostSaveNavigation(result.savedTheme, "Save");

        // If this save was triggered by a "Save to Copy" action, auto-copy the command
        if (shouldCopyAfterSave) {
          setShouldCopyAfterSave(false);
          // Small delay to let the theme ID update
          setTimeout(async () => {
            await handlePrimaryAction();
            if (providerId === "shadcn") {
              showSuccessWithMessage("Command copied!");
            } else {
              showSuccessWithMessage("Theme copied!");
            }
          }, 100);
        }
      } else {
        toast.error("Failed to save theme");
        setShouldCopyAfterSave(false);
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error saving theme");
      setShouldCopyAfterSave(false);
      throw error; // Re-throw so modal can handle error state
    }
  };

  // Get default theme name for modal
  const getDefaultThemeName = () => {
    if (activeTheme.name.includes("(unsaved)")) {
      return activeTheme.name.replace(" (unsaved)", "");
    }
    if (activeTheme.name === "Custom" || activeTheme.name.includes("Custom")) {
      return "My Custom Theme";
    }
    return activeTheme.name;
  };

  // Handle rename theme
  const handleRenameTheme = async (newName: string) => {
    try {
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const result = await renameTheme(activeTheme.id, newName);

      if (!result.success) {
        throw new Error(result.error || "Failed to rename theme");
      }

      // Refresh theme lists to show updated name
      await loadUserThemes();

      toast.success(`Theme renamed to "${newName}"!`);
    } catch (error) {
      console.error("Error renaming theme:", error);
      toast.error("Failed to rename theme");
      throw error;
    }
  };


  const getShareLink = () => {
    if (!activeTheme?.id) return "";
    if (typeof window === 'undefined') return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/workbench/${activeTheme.id}`;
  };

  const handleImportTheme = async (name: string, css: string, makePublic: boolean) => {
    try {
      // Parse the CSS to get theme data
      const { tinteTheme, shadcnTheme } = importShadcnTheme(css);

      // Create theme data with proper user association
      const themeToSave = {
        id: `theme_${Date.now()}`,
        name,
        description: `Imported theme: ${name}`,
        author: "You",
        provider: "tinte" as const,
        downloads: 0,
        likes: 0,
        installs: 0,
        tags: ["custom", "imported"],
        createdAt: new Date().toISOString(),
        colors: {
          primary: tinteTheme.light.pr,
          secondary: tinteTheme.light.sc,
          background: tinteTheme.light.bg,
        },
        rawTheme: tinteTheme,
        // Ensure proper user association for ownership detection
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        } : null,
      };

      // Apply shadcn overrides for the imported CSS first
      if (shadcnTheme) {
        updateShadcnOverride(shadcnTheme);
      }

      // Add to themes list and select it first to make it the active theme
      addTheme(themeToSave);
      selectTheme(themeToSave);

      // Now save the active theme to database with proper overrides
      const result = await saveCurrentTheme(name, makePublic, shadcnTheme);

      if (result.success && result.savedTheme) {
        // Refresh theme lists to include the saved theme
        await loadUserThemes();

        // Update the local theme with the saved theme data (with proper DB ID)
        const updatedSavedTheme = {
          ...result.savedTheme,
          // Ensure user association is preserved
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          } : null,
          // Ensure overrides are preserved
          overrides: {
            shadcn: shadcnTheme,
            vscode: result.savedTheme.overrides?.vscode,
            shiki: result.savedTheme.overrides?.shiki,
          },
        };

        // Select the updated saved theme
        selectTheme(updatedSavedTheme);

        toast.success(`"${name}" imported and saved successfully!`);
      } else {
        toast.error("Failed to save imported theme");
      }
    } catch (error) {
      console.error("Error importing theme:", error);
      toast.error("Failed to import theme");
      throw error;
    }
  };

  const handleTogglePublic = (makePublic: boolean) => {
    try {
      if (!activeTheme?.id) {
        console.error("No theme ID");
        toast.error("No theme selected");
        return;
      }

      setIsThemePublic(makePublic);

      if (makePublic && isOwnTheme) {
        // Future: API call to make theme public
        console.log("Making theme public:", activeTheme.id);
        toast.success("✨ Theme is now public!");
      } else if (!makePublic) {
        console.log("Making theme private:", activeTheme.id);
        toast.success("🔒 Theme is now private");
      } else if (makePublic && !isOwnTheme) {
        toast.error("Only theme owners can make themes public");
        setIsThemePublic(false);
      }
    } catch (error) {
      console.error("Error toggling theme visibility:", error);
      toast.error("Failed to update theme visibility");
      setIsThemePublic(!makePublic); // Revert on error
    }
  };

  // Handle duplicate theme with custom ID prefix
  const saveThemeWithPrefix = async (name: string, makePublic: boolean) => {
    const presetType = getPresetType();
    const customId = `${presetType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Temporarily modify the activeTheme ID before saving
      const originalId = activeTheme.id;
      const originalName = activeTheme.name;

      // Update activeTheme with custom ID and name
      activeTheme.id = customId;
      activeTheme.name = name;

      let shadcnOverrideToSave = null;
      if (presetType === 'tweakcn' && activeTheme.rawTheme) {
        shadcnOverrideToSave = {
          light: activeTheme.rawTheme.light || {},
          dark: activeTheme.rawTheme.dark || {}
        };
        console.log('🎨 Saving TweakCN theme with shadcn overrides:', {
          themeId: activeTheme.id,
          themeName: activeTheme.name,
          lightKeys: Object.keys(shadcnOverrideToSave.light).length,
          darkKeys: Object.keys(shadcnOverrideToSave.dark).length
        });
      }

      // Save the theme with shadcn overrides if needed
      const result = await saveCurrentTheme(name, makePublic, shadcnOverrideToSave);

      // Restore original values
      activeTheme.id = originalId;
      activeTheme.name = originalName;

      // Handle navigation and theme list refresh for successful saves
      if (result.success && result.savedTheme) {
        // Clear unsaved changes state
        markAsSaved();
        await handlePostSaveNavigation(result.savedTheme, "Save");
      }

      return result;
    } catch (error) {
      console.error("Error saving theme with custom prefix:", error);
      return { success: false, savedTheme: null };
    }
  };

  // Handle duplicate theme
  const handleDuplicateTheme = async (name: string, makePublic: boolean) => {
    try {
      if (isBuiltInTheme) {
        // For built-in themes, create new theme with appropriate prefix
        const result = await saveThemeWithPrefix(name, makePublic);
        if (!result.success) {
          throw new Error("Failed to save theme");
        }
        toast.success(`Theme saved as "${name}"!`);
        // Navigation handled by saveThemeWithPrefix
      } else {
        // For database themes, duplicate existing
        if (!activeTheme?.id) {
          throw new Error("No theme ID");
        }

        console.log("🔄 Calling duplicateTheme with:", {
          themeId: activeTheme.id,
          name,
          makePublic,
          activeThemeInfo: {
            id: activeTheme.id,
            name: activeTheme.name,
            author: activeTheme.author,
            provider: activeTheme.provider,
            hasRawTheme: !!activeTheme.rawTheme,
            keys: Object.keys(activeTheme)
          },
          originalThemeData: {
            author: activeTheme.author,
            provider: activeTheme.provider
          }
        });

        const result = await duplicateTheme(
          activeTheme.id,
          name,
          makePublic,
          {
            author: activeTheme.author,
            provider: activeTheme.provider
          }
        );
        if (!result.success) {
          throw new Error(result.error || "Failed to duplicate theme");
        }
        toast.success(`Theme duplicated as "${name}"!`);
        // Handle navigation and theme list refresh
        if (result.theme) {
          await handlePostSaveNavigation(result.theme, "Duplicate");
        }
      }
    } catch (error) {
      console.error("Error duplicating/saving theme:", error);
      toast.error(isBuiltInTheme ? "Failed to save theme" : "Failed to duplicate theme");
      throw error;
    }
  };

  // Handle delete theme
  const handleDeleteTheme = async () => {
    console.log("🗑️ Delete theme started");
    console.log("📋 Theme:", activeTheme);
    console.log("👤 User:", user);
    console.log("🔐 isAuthenticated:", isAuthenticated);
    console.log("👻 isAnonymous:", isAnonymous);
    console.log("✅ isOwnTheme:", isOwnTheme);

    try {
      if (!activeTheme?.id) {
        console.error("❌ No theme ID found");
        throw new Error("No theme ID");
      }

      console.log("🔄 Calling deleteTheme API with ID:", activeTheme.id);
      const success = await deleteTheme(activeTheme.id);
      console.log("✅ Delete API result:", success);

      if (!success) {
        throw new Error("Failed to delete theme");
      }

      // Auto-select first available theme (store has been updated)
      const remainingUserThemes = userThemes?.filter(t => t.id !== activeTheme.id) || [];
      const remainingAllThemes = allThemes?.filter(t => t.id !== activeTheme.id) || [];

      console.log("🔄 Auto-selecting from updated themes:", {
        userThemes: remainingUserThemes.length,
        allThemes: remainingAllThemes.length
      });

      // Prioritize user themes, then fallback to built-in themes
      const themeToSelect = remainingUserThemes[0] || remainingAllThemes[0];

      if (themeToSelect) {
        console.log("🔄 Auto-selecting theme:", themeToSelect.name);
        selectTheme(themeToSelect);
      } else {
        console.log("⚠️ No themes available to select");
      }

      // Return to main dock
      navigateTo("main");
      console.log("✅ Delete theme completed successfully");
    } catch (error) {
      console.error("❌ Error deleting theme:", error);
      throw error; // Re-throw so dialog can handle error state
    }
  };

  // Get default duplicate name
  const getDuplicateName = () => {
    if (isBuiltInTheme) {
      return `My ${getDefaultThemeName()}`;
    }
    return `Copy of ${getDefaultThemeName()}`;
  };

  const mouseX = useMotionValue(Infinity);

  // Animation variants system inspired by Dynamic Island
  const [variantKey, setVariantKey] = useState<string>("main");

  const ANIMATION_VARIANTS = {
    "main-export": { scale: 0.9, bounce: 0.35 },
    "export-main": { scale: 1.1, bounce: 0.3 },
    "main-settings": { scale: 0.9, bounce: 0.35 },
    "settings-main": { scale: 1.1, bounce: 0.3 },
    "export-settings": { scale: 1.0, bounce: 0.25 },
    "settings-export": { scale: 1.0, bounce: 0.25 },
  } as const;

  const BOUNCE_VARIANTS = {
    main: 0.3,
    export: 0.25,
    settings: 0.25,
    "main-export": 0.35,
    "export-main": 0.3,
    "main-settings": 0.35,
    "settings-main": 0.3,
    "export-settings": 0.25,
    "settings-export": 0.25,
  } as const;

  const dockVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      y: 20,
      x: "-50%",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      x: "-50%",
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      y: 20,
      x: "-50%",
    },
  };

  return (
    <TooltipProvider>

      {/* Main Dock */}
      <motion.div
        className="fixed bottom-4 left-1/2 z-50"
        variants={dockVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: "spring",
          bounce: BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ?? 0.3
        }}
      >
        <motion.div
          ref={dockRef}
          layoutId="dock-container"
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          layout
          transition={{
            type: "spring",
            bounce: BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ?? 0.3
          }}
          style={{ borderRadius: 32 }}
          className="bg-foreground/90 text-background mx-auto w-fit min-w-[100px] overflow-hidden rounded-full border border-foreground/20 shadow-2xl backdrop-blur-md"
        >
          <motion.div
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ?? 0.3
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: { delay: 0.05 },
            }}
            key={dockState}
          >
            {dockState === "main" ? (
              <DockMain
                mouseX={mouseX}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                undoCount={undoCount}
                redoCount={redoCount}
                primaryActionConfig={primaryActionConfig}
                onPrimaryAction={async () => {
                  // If it's a temporary theme, show save dialog instead
                  if (isTemporaryTheme()) {
                    if (!canSave) {
                      toast.error("Please sign in to save themes and generate install commands");
                      return;
                    }
                    setShouldCopyAfterSave(true);
                    setShowSaveDialog(true);
                    return;
                  }

                  // Otherwise, proceed with normal action
                  await handlePrimaryAction();
                  if (providerId === "shadcn") {
                    showSuccessWithMessage("Command copied!");
                  } else if (providerId === "vscode") {
                    showSuccessWithMessage("VSIX downloaded!");
                  } else {
                    showSuccessWithMessage("Theme copied!");
                  }
                }}
                isLoading={isExporting}
                onSave={handleSaveTheme}
                onReset={() => reset(theme)}
                hasChanges={hasChanges}
                canSave={canSave}
                unsavedChanges={unsavedChanges}
                isSaving={isSaving}
                onNavigateToExport={handleNavigateToExport}
                onNavigateToSettings={handleNavigateToSettings}
                onShare={() => setShowShareDialog(true)}
                onImport={() => setShowImportDialog(true)}
                isPrimaryActionDisabled={isTemporaryTheme() && !canSave}
              />
            ) : dockState === "export" ? (
              <DockExport
                mouseX={mouseX}
                onBack={handleNavigateBack}
                onDownload={async () => {
                  await handleExport();
                  if (providerId === "vscode") {
                    showSuccessWithMessage("VSIX downloaded!");
                  } else {
                    showSuccessWithMessage("File downloaded!");
                  }
                  setVariantKey("export-main");
                  navigateTo("main");
                }}
                onCopyTheme={handleCopyTheme}
                onCopyThemeAndReturn={async () => {
                  await handleCopyTheme();
                  showSuccessWithMessage("Theme copied!");
                  setVariantKey("export-main");
                  navigateTo("main");
                }}
                onCopyCommand={handleCopyCommandAction}
                onShowInstallGuide={handleCodeAction}
                isExporting={isExporting}
                providerName={providerName}
                providerId={providerId}
              />
            ) : dockState === "settings" ? (
              <DockSettings
                mouseX={mouseX}
                onBack={handleNavigateBack}
                onRename={() => setShowRenameDialog(true)}
                onDuplicate={() => setShowDuplicateDialog(true)}
                onDeleteClick={() => setShowDeleteDialog(true)}
                isAuthenticated={isAuthenticated}
                isAnonymous={isAnonymous}
                isOwnTheme={isOwnTheme}
                themeName={activeTheme?.name}
              />
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>

      <SuccessAnimation
        show={showSuccess}
        message={successMessage}
        onComplete={handleSuccessComplete}
      />

      <InstallGuideModal
        show={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        providerId={providerId}
        providerName={providerName}
        onCopyCommand={() => {
          handleCopyCommandAction();
          setShowInstallGuide(false);
          showSuccessWithMessage("Command copied!");
        }}
      />

      {/* Save Theme Dialog */}
      <SaveThemeDialog
        isOpen={showSaveDialog}
        onOpenChange={(open) => {
          setShowSaveDialog(open);
          if (!open) {
            setShouldCopyAfterSave(false);
          }
        }}
        onSave={handleSaveWithName}
        defaultName={getDefaultThemeName()}
        isLoading={isSaving}
      />

      {/* Share Theme Dialog */}
      <ShareThemeDialog
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
        onTogglePublic={handleTogglePublic}
        shareLink={getShareLink()}
        isPublic={isThemePublic}
      />

      {/* Import Theme Dialog */}
      <ImportThemeDialog
        isOpen={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportTheme}
        isLoading={false}
      />

      {/* Rename Theme Dialog */}
      <RenameThemeDialog
        isOpen={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onRename={handleRenameTheme}
        currentName={getDefaultThemeName()}
        isLoading={false}
      />

      {/* Duplicate Theme Dialog */}
      <DuplicateThemeDialog
        isOpen={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onDuplicate={handleDuplicateTheme}
        defaultName={getDuplicateName()}
        isLoading={false}
        isBuiltInTheme={isBuiltInTheme}
      />

      {/* Delete Theme Dialog */}
      <DeleteThemeDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteTheme}
        themeName={activeTheme?.name}
        isLoading={false}
      />
    </TooltipProvider>
  );
}
