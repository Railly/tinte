import { toast } from "sonner";
import type { TinteTheme } from "@/types/tinte";

interface DownloadVSCodeThemeOptions {
  tinteTheme: TinteTheme;
  themeName: string;
  variant?: "light" | "dark";
  overrides?: Record<string, string>;
}

export async function downloadVSCodeTheme({
  tinteTheme,
  themeName,
  variant = "dark",
  overrides,
}: DownloadVSCodeThemeOptions): Promise<void> {
  try {
    // Use environment variable for Netlify function URL
    const baseUrl =
      process.env.NEXT_PUBLIC_NETLIFY_FUNCTIONS_URL || "/.netlify/functions";
    const endpoint = `${baseUrl}/generate-vscode-theme`;

    // Call our Netlify function
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tinteTheme,
        themeName,
        variant,
        overrides,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    // Get the VSIX file as a blob
    const blob = await response.blob();

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition
      ? contentDisposition.match(/filename="([^"]+)"/)?.[1]
      : `${themeName.toLowerCase().replace(/\s+/g, "-")}-${variant}-0.0.1.vsix`;

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "theme.vsix";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download VS Code theme:", error);
    toast.error(
      `Failed to download theme: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
}
