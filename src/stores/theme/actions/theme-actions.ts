import { convertTheme } from "@/lib/providers";
import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";

export function createThemeActions(get: any, set: any) {
  return {
    createNewTheme: (name: string) => {
      const { tinteTheme } = get();

      const newTheme: ThemeData = {
        id: `theme_${Date.now()}`,
        name,
        description: "Custom theme",
        author: "You",
        provider: "tinte" as const,
        downloads: 0,
        likes: 0,
        views: 0,
        tags: ["custom"],
        createdAt: new Date().toISOString(),
        colors: {
          primary: tinteTheme.light.pr,
          secondary: tinteTheme.light.sc,
          accent: tinteTheme.light.ac_1,
          foreground: tinteTheme.light.tx,
          background: tinteTheme.light.bg,
        },
        rawTheme: tinteTheme,
      };

      get().selectTheme(newTheme);
    },

    duplicateTheme: (theme: ThemeData, name: string) => {
      const duplicatedTheme = {
        ...theme,
        id: `theme_${Date.now()}`,
        name,
        author: "You",
        createdAt: new Date().toISOString(),
      };

      get().selectTheme(duplicatedTheme);
    },

    forkTheme: (theme: ThemeData, newName?: string) => {
      const { user } = get();

      const forkedTheme: ThemeData = {
        ...theme,
        id: `fork_${Date.now()}`,
        name: newName || `${theme.name} (Fork)`,
        author: user?.name || "You",
        provider: "tinte" as const,
        createdAt: new Date().toISOString(),
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }
          : null,
        tags: [...(theme.tags || []), "fork"],
      };

      get().selectTheme(forkedTheme);
    },

    addTheme: (theme: ThemeData) => {
      set((state: any) => {
        const existingIndex = state.allThemes.findIndex(
          (t: ThemeData) => t.id === theme.id,
        );
        if (existingIndex >= 0) {
          const updatedThemes = [...state.allThemes];
          updatedThemes[existingIndex] = theme;
          return { allThemes: updatedThemes };
        } else {
          return { allThemes: [...state.allThemes, theme] };
        }
      });
    },

    exportTheme: (format: string) => {
      const { activeTheme, tinteTheme, shadcnOverride, vscodeOverride, shikiOverride } = get();

      switch (format) {
        case "tinte":
          return JSON.stringify(
            {
              tinteTheme,
              overrides: { shadcnOverride, vscodeOverride, shikiOverride },
            },
            null,
            2,
          );
        case "shadcn":
          return JSON.stringify(convertTheme("shadcn", tinteTheme), null, 2);
        case "vscode":
          return JSON.stringify(convertTheme("vscode", tinteTheme), null, 2);
        default:
          return JSON.stringify(activeTheme, null, 2);
      }
    },

    importTheme: (themeData: any, format: string) => {
      try {
        let theme: ThemeData;

        switch (format) {
          case "tinte":
            theme = {
              id: `imported_${Date.now()}`,
              name: themeData.name || "Imported Theme",
              description: "Imported theme",
              author: "Imported",
              provider: "tinte" as const,
              downloads: 0,
              likes: 0,
              views: 0,
              tags: ["imported"],
              createdAt: new Date().toISOString(),
              colors: {
                primary: themeData.tinteTheme.light.pr,
                secondary: themeData.tinteTheme.light.sc,
                accent: themeData.tinteTheme.light.ac_1,
                foreground: themeData.tinteTheme.light.tx,
                background: themeData.tinteTheme.light.bg,
              },
              rawTheme: themeData.tinteTheme,
            };

            if (themeData.overrides) {
              set({
                shadcnOverride: themeData.overrides.shadcnOverride,
                vscodeOverride: themeData.overrides.vscodeOverride,
                shikiOverride: themeData.overrides.shikiOverride,
              });
            }
            break;

          default:
            theme = themeData;
        }

        get().selectTheme(theme);
        return true;
      } catch (error) {
        console.error("Error importing theme:", error);
        return false;
      }
    },
  };
}