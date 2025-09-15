import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";

interface SaveThemeResult {
  success: boolean;
  savedTheme?: ThemeData;
}

export async function saveThemeToDatabase(
  theme: ThemeData,
  tinteTheme: TinteTheme,
  overrides: {
    shadcn?: any;
    vscode?: any;
    shiki?: any;
  },
  isPublic: boolean = false,
  isUpdate: boolean = false,
): Promise<SaveThemeResult> {
  try {
    let response;

    if (isUpdate && theme.id) {
      response = await fetch(`/api/themes/${theme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: theme.name,
          tinteTheme,
          overrides,
          isPublic,
        }),
      });
    } else {
      response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: theme.name,
          tinteTheme,
          overrides,
          isPublic,
        }),
      });
    }

    if (response.ok) {
      const data = await response.json();
      if (data.theme) {
        const savedTheme: ThemeData = {
          ...theme,
          id: data.theme.id,
          name: data.theme.name,
          createdAt:
            data.theme.created_at ||
            data.theme.createdAt ||
            new Date().toISOString(),
        };
        return { success: true, savedTheme };
      }
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Error saving theme to database:", error);
    return { success: false };
  }
}

export function organizeEditedTokens(
  editedTokens: Record<string, string>,
  currentMode: string,
) {
  const shadcnTokens: Record<string, any> = {};
  const vscodeTokens: Record<string, any> = {};
  const shikiTokens: Record<string, any> = {};

  Object.entries(editedTokens).forEach(([key, value]) => {
    if (key.match(/^(bg|ui|tx|pr|sc|ac|light_|dark_)/)) {
      if (!shadcnTokens[currentMode]) shadcnTokens[currentMode] = {};
      shadcnTokens[currentMode][key] = value;
    } else if (
      key.includes("vscode") ||
      key.includes("editor") ||
      key.includes("terminal")
    ) {
      if (!vscodeTokens[currentMode]) vscodeTokens[currentMode] = {};
      vscodeTokens[currentMode][key] = value;
    } else if (
      key.includes("shiki") ||
      key.includes("syntax") ||
      key.includes("highlight")
    ) {
      if (!shikiTokens[currentMode]) shikiTokens[currentMode] = {};
      shikiTokens[currentMode][key] = value;
    } else {
      if (!shadcnTokens[currentMode]) shadcnTokens[currentMode] = {};
      shadcnTokens[currentMode][key] = value;
    }
  });

  return {
    shadcn: Object.keys(shadcnTokens).length > 0 ? shadcnTokens : null,
    vscode: Object.keys(vscodeTokens).length > 0 ? vscodeTokens : null,
    shiki: Object.keys(shikiTokens).length > 0 ? shikiTokens : null,
  };
}