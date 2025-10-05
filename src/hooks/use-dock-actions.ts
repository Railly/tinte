import { Copy, Download, Palette, Save, Terminal } from "lucide-react";
import { useState } from "react";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";
import { VSCodeIcon } from "@/components/shared/icons/vscode";
import InvertedLogo from "@/components/shared/inverted-logo";
import { incrementThemeInstalls } from "@/lib/actions/themes";
import { downloadVSCodeTheme } from "@/lib/download-vscode-theme";
import { exportTheme } from "@/lib/providers";
import type { TinteTheme } from "@/types/tinte";

interface UseDockActionsProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
  provider: any;
  themeId?: string;
  canSave?: boolean;
  themeName?: string;
  vscodeOverrides?: Record<string, Record<string, any>> | null;
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
      const output = exportTheme(providerId, theme);
      if (output) {
        await navigator.clipboard.writeText(output.content);
        // Track the install
        await incrementInstalls();
      }
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
