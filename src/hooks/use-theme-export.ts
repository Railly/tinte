import { useState } from "react";
import { toast } from "sonner";
import { ThemeConfig } from "@/lib/core/types";
import { exportThemeAsJSON, exportThemeAsVSIX } from "../export-theme";

export const useThemeExport = () => {
  const [loading, setLoading] = useState(false);

  const exportJSON = (themeConfig: ThemeConfig) => {
    exportThemeAsJSON(themeConfig);
    toast.success("Theme exported as JSON");
  };

  const exportVSIX = async (themeConfig: ThemeConfig, isDark: boolean) => {
    try {
      setLoading(true);
      toast.info("Exporting theme as VSIX...");
      await exportThemeAsVSIX(themeConfig, isDark);
      toast.dismiss();
      toast.success("Theme exported as VSIX");
    } catch (error) {
      toast.dismiss();
      console.error("Failed to export VSIX:", error);
      toast.error("Failed to export theme as VSIX");
    } finally {
      setLoading(false);
    }
  };

  return { loading, exportJSON, exportVSIX };
};
