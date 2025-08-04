import { useState } from "react";
import { TinteTheme } from "@/types/tinte";
import { exportTheme } from "@/lib/providers";
import { Download, Palette } from "lucide-react";

interface UseDockActionsProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
  provider: any;
}

export function useDockActions({
  theme,
  providerId,
  providerName,
  provider,
}: UseDockActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handlePrimaryAction = async () => {
    if (providerId === "shadcn") {
      const command = "npx shadcn@latest add theme";
      await handleCopyCommand(command);
    } else if (providerId === "vscode") {
      await handleExport();
    } else {
      await handleExport();
    }
  };

  const getPrimaryActionConfig = () => {
    if (providerId === "shadcn") {
      return {
        label: "Install Theme",
        description: "npx shadcn@latest add theme",
        icon: Palette,
        variant: "default" as const,
      };
    } else if (providerId === "vscode") {
      return {
        label: "Install Theme",
        description: "Install in VS Code/Cursor",
        icon: Download,
        variant: "default" as const,
      };
    } else {
      return {
        label: "Install Theme",
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
