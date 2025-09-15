import type { ProviderType, ThemeOverrides } from "./types";
import { saveToStorage } from "./utils/storage";
import {
  applyProcessedTokensToDOM,
  computeProcessedTokens,
} from "./utils/theme-computation";
import {
  createUpdatedThemeForEdit,
  getThemeOwnershipInfo,
} from "./utils/theme-ownership";

export const createOverrideHandler = (
  provider: ProviderType,
  getCurrentState: () => any,
  setState: (updater: (state: any) => any) => void,
) => {
  return (override: any) => {
    setState((state) => {
      const currentOverride = state[`${provider}Override`] || {};
      const newOverride = { ...currentOverride, ...override };

      const ownership = getThemeOwnershipInfo(state.activeTheme, state.user);
      const updatedActiveTheme = createUpdatedThemeForEdit(
        state.activeTheme,
        state.user,
        ownership,
      );

      const newOverrides: ThemeOverrides = {
        shadcn: state.shadcnOverride,
        vscode: state.vscodeOverride,
        shiki: state.shikiOverride,
        [provider]: newOverride,
      };

      const processedTokens = computeProcessedTokens(
        updatedActiveTheme,
        state.currentMode,
        newOverrides,
      );

      return {
        [`${provider}Override`]: newOverride,
        activeTheme: updatedActiveTheme,
        currentTokens: processedTokens,
        hasEdits: true,
        unsavedChanges: true,
      };
    });

    // Persist and apply changes
    const state = getCurrentState();
    const overrides: ThemeOverrides = {
      shadcn: state.shadcnOverride,
      vscode: state.vscodeOverride,
      shiki: state.shikiOverride,
    };

    saveToStorage(state.activeTheme, state.currentMode, overrides, true);
    applyProcessedTokensToDOM(
      state.activeTheme,
      state.currentMode,
      state.currentTokens,
    );
  };
};

export const createResetOverridesHandler = (
  getCurrentState: () => any,
  setState: (updater: (state: any) => any) => void,
) => {
  return (provider?: ProviderType) => {
    setState((state) => {
      const updates: any = {};

      if (!provider || provider === "shadcn") {
        updates.shadcnOverride = null;
      }
      if (!provider || provider === "vscode") {
        updates.vscodeOverride = null;
      }
      if (!provider || provider === "shiki") {
        updates.shikiOverride = null;
      }

      return {
        ...updates,
        unsavedChanges: Object.keys(updates).length > 0,
      };
    });

    // Persist changes
    const state = getCurrentState();
    const overrides: ThemeOverrides = {
      shadcn: state.shadcnOverride,
      vscode: state.vscodeOverride,
      shiki: state.shikiOverride,
    };

    saveToStorage(state.activeTheme, state.currentMode, overrides);
  };
};
