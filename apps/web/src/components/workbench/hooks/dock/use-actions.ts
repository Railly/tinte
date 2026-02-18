import { Copy, Download, Save } from "lucide-react";
import { useState } from "react";
import { ShadcnIcon } from "@/components/shared/icons";
import { InvertedLogo } from "@/components/shared/layout";
import { incrementThemeInstalls } from "@/lib/actions/themes";
import { downloadVSCodeTheme } from "@tinte/providers/provider-utils/vscode-download";
import { exportTheme } from "@tinte/providers";
import { convertTinteToShiki } from "@tinte/providers";
import type { TinteTheme } from "@tinte/core";

interface UseDockActionsProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
  provider: any;
  themeId?: string;
  canSave?: boolean;
  themeName?: string;
  vscodeOverrides?: Record<string, Record<string, any>> | null;
  shikiOverrides?: Record<string, Record<string, any>> | null;
}

export function useDockActions({
  theme,
  providerId,
  providerName,
  provider,
  themeId,
  canSave,
  themeName,
  vscodeOverrides,
  shikiOverrides,
}: UseDockActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Helper function to detect temporary themes that need saving first
  const isTemporaryTheme = (id?: string): boolean => {
    if (!id) return true;
    return (
      id.startsWith("ai-generated-") ||
      id.startsWith("custom_") ||
      !!id.match(/^theme_\d+$/) || // Temporary import IDs like theme_1758412202896
      id === "theme" ||
      id === "default"
    );
  };

  const incrementInstalls = async () => {
    if (themeId) {
      try {
        await incrementThemeInstalls(themeId);
      } catch (error) {
        console.error("Failed to increment installs:", error);
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Special handling for VS Code - download VSIX instead of JSON
      if (providerId === "vscode") {
        await downloadVSCodeTheme({
          tinteTheme: theme,
          themeName: themeName || "Custom Theme",
          variant: "dark", // Default to dark, could be made configurable
          overrides: vscodeOverrides?.dark || undefined,
        });
      } else if (providerId === "shiki") {
        // Special handling for Shiki to include overrides
        const shikiTheme = convertTinteToShiki(theme);
        const lightVariables = {
          ...shikiTheme.light.variables,
          ...(shikiOverrides?.light || {}),
        };
        const darkVariables = {
          ...shikiTheme.dark.variables,
          ...(shikiOverrides?.dark || {}),
        };

        const lightVars = Object.entries(lightVariables)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");

        const darkVars = Object.entries(darkVariables)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");

        const content = `:root {
${lightVars}
}

.dark {
${darkVars}
}

/* Shiki CSS Variables Theme Styles */
.shiki-css-container {
  background: var(--shiki-background);
  color: var(--shiki-foreground);
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.shiki-css-container pre {
  background: transparent !important;
  margin: 0;
  padding: 0;
}

.shiki-css-container code {
  font-family: inherit;
}`;

        const blob = new Blob([content], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "shiki-theme.css";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Regular export for other providers
        const output = exportTheme(providerId, theme);
        if (!output) {
          throw new Error(`Failed to export theme for ${providerName}`);
        }

        const blob = new Blob([output.content], { type: output.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = output.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Track the install
      await incrementInstalls();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTheme = async () => {
    try {
      let content: string;

      // Special handling for Shiki to include overrides
      if (providerId === "shiki") {
        const shikiTheme = convertTinteToShiki(theme);
        const lightVariables = {
          ...shikiTheme.light.variables,
          ...(shikiOverrides?.light || {}),
        };
        const darkVariables = {
          ...shikiTheme.dark.variables,
          ...(shikiOverrides?.dark || {}),
        };

        const lightVars = Object.entries(lightVariables)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");

        const darkVars = Object.entries(darkVariables)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");

        content = `:root {
${lightVars}
}

.dark {
${darkVars}
}

/* Shiki CSS Variables Theme Styles */
.shiki-css-container {
  background: var(--shiki-background);
  color: var(--shiki-foreground);
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.shiki-css-container pre {
  background: transparent !important;
  margin: 0;
  padding: 0;
}

.shiki-css-container code {
  font-family: inherit;
}`;
      } else {
        const output = exportTheme(providerId, theme);
        if (!output) {
          throw new Error("Failed to export theme");
        }
        content = output.content;
      }

      await navigator.clipboard.writeText(content);
      // Track the install
      await incrementInstalls();
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        const output = exportTheme(providerId, theme);
        if (output) {
          await navigator.share({
            title: `${providerName} Theme`,
            text: `Check out this ${providerName} theme I created with Tinte`,
            files: [
              new File([output.content], output.filename, {
                type: output.mimeType,
              }),
            ],
          });
        }
      } else {
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      // Track the install for command copying
      await incrementInstalls();
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handlePrimaryAction = async () => {
    if (providerId === "shadcn") {
      // Use the registry endpoint with the theme ID
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/r/${themeId}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
    } else if (providerId === "vscode") {
      // Copy bunx tinte command
      const command = `bunx tinte@latest ${themeId}`;
      await handleCopyCommand(command);
    } else if (providerId === "zed") {
      // Copy bunx tinte command with --zed flag
      const command = `bunx tinte@latest ${themeId} --zed`;
      await handleCopyCommand(command);
    } else if (providerId === "shiki") {
      // For Shiki, copy the CSS theme
      await handleCopyTheme();
    } else {
      await handleCopyTheme();
    }
  };

  const getPrimaryActionConfig = () => {
    const needsSaving = isTemporaryTheme(themeId);

    if (needsSaving) {
      // For temporary themes, show save-first action
      return {
        label: "Save to Copy",
        description:
          canSave === false
            ? "Sign in to save theme and generate install command"
            : "Save theme first to generate install command",
        icon: Save,
        variant: "outline" as const,
      };
    }

    if (providerId === "shadcn") {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const registryUrl = `${baseUrl}/r/${themeId}`;
      return {
        label: "Copy Command",
        description: `npx shadcn@latest add ${registryUrl}`,
        icon: ShadcnIcon,
        variant: "default" as const,
      };
    } else if (providerId === "vscode") {
      return {
        label: "Copy Command",
        description: `bunx tinte@latest ${themeId}`,
        icon: InvertedLogo,
        variant: "default" as const,
      };
    } else if (providerId === "zed") {
      return {
        label: "Copy Command",
        description: `bunx tinte@latest ${themeId} --zed`,
        icon: InvertedLogo,
        variant: "default" as const,
      };
    } else if (providerId === "shiki") {
      return {
        label: "Copy CSS",
        description: "Copy CSS variables to clipboard",
        icon: Copy,
        variant: "default" as const,
      };
    } else {
      return {
        label: "Install",
        description: `Download .${provider?.fileExtension} file`,
        icon: Download,
        variant: "default" as const,
      };
    }
  };

  return {
    isExporting,
    isSharing,
    handleExport,
    handleCopyTheme,
    handleShare,
    handleCopyCommand,
    handlePrimaryAction,
    getPrimaryActionConfig,
    isTemporaryTheme: () => isTemporaryTheme(themeId),
  };
}
