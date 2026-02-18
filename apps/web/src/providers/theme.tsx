"use client";

import { useEffect } from "react";
import { ClerkSync } from "@/components/shared/clerk-sync";
import { useThemeFonts } from "@/stores/hooks/use-theme-fonts";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  useThemeFonts(themeStore.activeTheme);

  useEffect(() => {
    if (!themeStore.mounted) {
      themeStore.initialize();
    }
  }, [themeStore.mounted]);

  useEffect(() => {
    if (!authStore.mounted) {
      authStore.initialize();
    }
  }, [authStore.mounted]);

  return (
    <>
      <ClerkSync />
      {children}
    </>
  );
}
