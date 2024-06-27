import { ThemeConfig } from "@/lib/core/types";
import { generateVSCodeTheme } from "@/lib/core";

export const exportThemeAsJSON = (themeConfig: ThemeConfig) => {
  const theme = generateVSCodeTheme(themeConfig);
  const jsonString = JSON.stringify(theme, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${themeConfig.displayName}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportThemeAsVSIX = async (
  themeConfig: ThemeConfig,
  isDark: boolean
) => {
  const response = await fetch(
    process.env.NODE_ENV === "development"
      ? "api/export-vsix"
      : process.env.NEXT_PUBLIC_EXPORT_API_URL!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        themeConfig,
        isDark,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export VSIX");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const contentDisposition = response.headers.get("Content-Disposition");

  const fileNameMatch =
    contentDisposition && contentDisposition.match(/filename="(.+)"/);
  const fileName = fileNameMatch
    ? fileNameMatch[1]
    : themeConfig.displayName.replace(/\s/g, "-") +
      `-${isDark ? "dark" : "light"}-0.0.1.vsix`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "theme.vsix";
  link.click();
  window.URL.revokeObjectURL(url);
};
