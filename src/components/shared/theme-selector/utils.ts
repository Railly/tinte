import type { ThemeData } from "@/lib/theme-tokens";

export const isTemporaryTheme = (id?: string): boolean => {
  if (!id) return true;
  return (
    id.startsWith("ai-generated-") ||
    id.startsWith("custom_") ||
    Boolean(id.match(/^theme_\d+$/)) ||
    id === "theme" ||
    id === "default"
  );
};

export const getDisplayName = (theme: ThemeData): string => {
  const name = theme.name || "Unnamed Theme";

  const isSaved =
    theme.id?.startsWith("theme_") && !theme.id.includes("custom_");

  if (isSaved && name.includes("(unsaved)")) {
    return name.replace(" (unsaved)", "").replace("(unsaved)", "").trim();
  }

  const isTemp = isTemporaryTheme(theme.id);
  if (isTemp && !name.includes("(unsaved)")) {
    return `${name} (unsaved)`;
  }

  return name;
};
