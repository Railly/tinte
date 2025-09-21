import { authClient } from "@/lib/auth-client";
import { convertTheme } from "@/lib/providers";
import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";
import { saveAnonymousThemes, loadAnonymousThemes } from "../utils/storage";
import { saveThemeToDatabase, organizeEditedTokens } from "../utils/persistence";
import { getThemeOwnershipInfo } from "../utils/theme-ownership";

export function createPersistenceActions(get: any, set: any) {
  return {
    saveTheme: async (name?: string, makePublic = false, additionalShadcnOverride?: any) => {
      const {
        activeTheme,
        tinteTheme,
        shadcnOverride,
        vscodeOverride,
        shikiOverride,
        editedTokens,
        currentMode,
        isAuthenticated,
        isAnonymous,
        userThemes,
        allThemes,
        user,
      } = get();

      set({ isSaving: true });

      try {
        let cleanName = name || activeTheme.name;
        if (cleanName.includes("(unsaved)")) {
          cleanName = cleanName.replace(" (unsaved)", "");
        }
        if (cleanName === "Custom") {
          cleanName = "My Custom Theme";
        }

        let themeToSave = {
          ...activeTheme,
          name: cleanName,
          id: activeTheme.id || `theme_${Date.now()}`,
          tags: activeTheme.tags?.filter((tag: string) => tag !== "unsaved") || ["custom"],
        };

        const organizedTokens = organizeEditedTokens(editedTokens, currentMode);

        const overrides = {
          shadcn: additionalShadcnOverride || {
            ...shadcnOverride,
            ...(organizedTokens.shadcn
              ? {
                  [currentMode]: {
                    ...(shadcnOverride?.[currentMode] || {}),
                    ...organizedTokens.shadcn[currentMode],
                  },
                }
              : {}),
          },
          vscode: {
            ...vscodeOverride,
            ...(organizedTokens.vscode
              ? {
                  [currentMode]: {
                    ...(vscodeOverride?.[currentMode] || {}),
                    ...organizedTokens.vscode[currentMode],
                  },
                }
              : {}),
          },
          shiki: {
            ...shikiOverride,
            ...(organizedTokens.shiki
              ? {
                  [currentMode]: {
                    ...(shikiOverride?.[currentMode] || {}),
                    ...organizedTokens.shiki[currentMode],
                  },
                }
              : {}),
          },
        };

        let success = false;

        if (isAuthenticated) {
          const ownership = getThemeOwnershipInfo(activeTheme, user);

          // Check if this is an actual database theme or just a temporary one
          // Real DB themes have format: theme_${userId}_${timestamp}
          // Temporary themes have format: theme_${timestamp}
          const isActualDbTheme = activeTheme.id &&
            !activeTheme.id.startsWith("custom_") &&
            activeTheme.id.includes("_") &&
            activeTheme.id.split("_").length >= 3; // theme_userId_timestamp has at least 3 parts

          const isUpdate =
            ownership.isUserOwnedTheme &&
            isActualDbTheme;

          const result = await saveThemeToDatabase(
            themeToSave,
            tinteTheme,
            overrides,
            makePublic,
            Boolean(isUpdate),
          );

          success = result.success;
          if (result.savedTheme) {
            themeToSave = result.savedTheme;
          }
        } else if (isAnonymous) {
          const updatedUserThemes = [...userThemes];
          const existingIndex = updatedUserThemes.findIndex(
            (t) => t.id === themeToSave.id,
          );

          if (existingIndex >= 0) {
            updatedUserThemes[existingIndex] = themeToSave;
          } else {
            updatedUserThemes.push(themeToSave);
          }

          saveAnonymousThemes(updatedUserThemes);
          success = true;
          set({ userThemes: updatedUserThemes });
        }

        if (success) {
          const updatedAllThemes = [...allThemes];
          const updatedUserThemes = [...userThemes];

          const allThemeIndex = updatedAllThemes.findIndex(
            (t) => t.id === themeToSave.id,
          );
          const userThemeIndex = updatedUserThemes.findIndex(
            (t) => t.id === themeToSave.id,
          );

          if (allThemeIndex >= 0) {
            updatedAllThemes[allThemeIndex] = themeToSave;
          } else {
            updatedAllThemes.push(themeToSave);
          }

          if (userThemeIndex >= 0) {
            updatedUserThemes[userThemeIndex] = themeToSave;
          } else {
            updatedUserThemes.push(themeToSave);
          }

          set({
            unsavedChanges: false,
            hasEdits: false,
            editedTokens: {},
            lastSaved: new Date(),
            activeTheme: themeToSave,
            allThemes: updatedAllThemes,
            userThemes: updatedUserThemes,
          });
        }

        return { success, savedTheme: success ? themeToSave : null };
      } catch (error) {
        console.error("Error saving theme:", error);
        return { success: false, savedTheme: null };
      } finally {
        set({ isSaving: false });
      }
    },

    deleteTheme: async (themeId: string) => {
      const { isAuthenticated, isAnonymous, userThemes } = get();

      console.log("🗑️ deleteTheme persistence action called");
      console.log("🔐 isAuthenticated:", isAuthenticated);
      console.log("👻 isAnonymous:", isAnonymous);
      console.log("📋 themeId:", themeId);
      console.log("👥 userThemes count:", userThemes?.length || 0);

      try {
        if (isAuthenticated) {
          console.log("🔄 Making DELETE request to API");
          const response = await fetch(`/api/themes/${themeId}`, {
            method: "DELETE",
          });
          console.log("📡 API response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ API delete failed:", errorText);
            return false;
          }
          console.log("✅ API delete successful");
        } else if (isAnonymous) {
          console.log("🔄 Deleting from anonymous storage");
          const updatedUserThemes = userThemes.filter(
            (t: ThemeData) => t.id !== themeId,
          );
          saveAnonymousThemes(updatedUserThemes);
          set({ userThemes: updatedUserThemes });
          console.log("✅ Anonymous delete successful");
        } else {
          console.error("❌ User is neither authenticated nor anonymous");
          return false;
        }

        console.log("🔄 Updating store after deletion");

        // Update userThemes and rebuild allThemes
        const currentState = get();
        const updatedUserThemes = currentState.userThemes.filter((t: any) => t.id !== themeId);

        // Rebuild allThemes the same way as in initialize()
        const { DEFAULT_THEME } = await import("@/utils/tinte-presets");
        const updatedAllThemes = [
          DEFAULT_THEME,
          ...currentState.tinteThemes,
          ...currentState.raysoThemes,
          ...currentState.tweakcnThemes,
          ...updatedUserThemes,
        ].filter(
          (theme, index, arr) =>
            arr.findIndex((t) => t.id === theme.id) === index
        );

        set({
          userThemes: updatedUserThemes,
          allThemes: updatedAllThemes
        });

        console.log("📊 Store updated:", {
          userThemes: updatedUserThemes.length,
          allThemes: updatedAllThemes.length
        });

        // Also reload from server to ensure consistency
        await get().loadUserThemes();

        // Force a small delay to ensure all React updates are processed
        await new Promise(resolve => setTimeout(resolve, 50));

        console.log("✅ Theme deletion and store update completed successfully");
        return true;
      } catch (error) {
        console.error("❌ Error deleting theme:", error);
        return false;
      }
    },

    loadUserThemes: async () => {
      const { isAuthenticated, isAnonymous } = get();

      try {
        let userThemes: ThemeData[] = [];

        if (isAuthenticated) {
          const response = await fetch("/api/user/themes");
          if (response.ok) {
            userThemes = await response.json();
          }
        } else if (isAnonymous) {
          userThemes = loadAnonymousThemes();
        }

        set({ userThemes });
      } catch (error) {
        console.error("Error loading user themes:", error);
      }
    },

    signInAnonymously: async () => {
      try {
        const result = await authClient.signIn.anonymous();
        if (result.data) {
          await get().initialize();
        }
      } catch (error) {
        console.error("Error signing in anonymously:", error);
      }
    },

    linkAccount: async () => {
      try {
        await get().initialize();
      } catch (error) {
        console.error("Error linking account:", error);
      }
    },

    syncAnonymousThemes: async () => {
      const { isAuthenticated, userThemes } = get();

      if (!isAuthenticated || userThemes.length === 0) return;

      try {
        for (const theme of userThemes) {
          await saveThemeToDatabase(
            theme,
            theme.rawTheme as TinteTheme,
            {},
            false,
          );
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem("tinte-anonymous-themes");
        }
        await get().loadUserThemes();
      } catch (error) {
        console.error("Error syncing anonymous themes:", error);
      }
    },
  };
}