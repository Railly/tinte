import { Copy, Download, Palette, Terminal } from "lucide-react";
import { useState } from "react";
import { incrementThemeInstalls } from "@/lib/actions/themes";
import { exportTheme } from "@/lib/providers";
import type { TinteTheme } from "@/types/tinte";

interface UseDockActionsProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
  provider: any;
  themeId?: string;
}

export function useDockActions({
  theme,
  providerId,
  providerName,
  provider,
  themeId,
}: UseDockActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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
      const registryUrl = `${baseUrl}/api/r/${themeId}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
    } else if (providerId === "vscode") {
      // Use the VS Code registry endpoint
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/api/v/${themeId}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
    } else {
      await handleCopyTheme();
    }
  };

  const getPrimaryActionConfig = () => {
    if (providerId === "shadcn") {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const registryUrl = themeId ? `${baseUrl}/api/r/${themeId}` : "theme";
      return {
        label: "Install",
        description: `npx shadcn@latest add ${registryUrl}`,
        icon: Terminal,
        variant: "default" as const,
      };
    } else if (providerId === "vscode") {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const registryUrl = themeId ? `${baseUrl}/api/v/${themeId}` : "theme";
      return {
        label: "Install",
        description: `npx shadcn@latest add ${registryUrl}`,
        icon: Terminal,
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
  };
}
