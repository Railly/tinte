import type { ThemeData } from "@/lib/theme-tokens";
import type { ThemeOwnershipInfo } from "../types";

export const isOwnTheme = (theme: ThemeData, user: any): boolean =>
  theme.user?.id === user?.id ||
  theme.author === "You" ||
  (theme.id?.startsWith("theme_") && user);

export const getThemeOwnershipInfo = (
  theme: ThemeData,
  user: any,
): ThemeOwnershipInfo => {
  const isUserOwnedTheme = isOwnTheme(theme, user);

  return {
    isOwnTheme: isUserOwnedTheme,
    isUserOwnedTheme,
    shouldCreateCustomTheme: !isUserOwnedTheme,
  };
};

export const createUpdatedThemeForEdit = (
  theme: ThemeData,
  user: any,
  ownership: ThemeOwnershipInfo,
): ThemeData => {
  if (ownership.isOwnTheme) {
    return {
      ...theme,
      name: theme.name.replace(" (unsaved)", ""),
    };
  }

  const customId = theme.id?.startsWith("custom_")
    ? theme.id
    : `custom_${theme.id || Date.now()}`;

  return {
    ...theme,
    name: "Custom (unsaved)",
    id: customId,
    author: "You",
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      : null,
  };
};