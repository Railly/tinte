import { track } from "@vercel/analytics";
import { type RefObject, useCallback, useState } from "react";
import {
  copyToClipboard,
  exportPng,
  exportSvg,
  supportsClipboard,
} from "@/lib/export";

export function useExport(frameRef: RefObject<HTMLElement | null>) {
  const [exporting, setExporting] = useState(false);

  const handleExportPng = useCallback(async () => {
    if (!frameRef.current) return;
    setExporting(true);
    try {
      await document.fonts.ready;
      const dataUrl = await exportPng(frameRef.current);
      const link = document.createElement("a");
      link.download = "ray-tinte.png";
      link.href = dataUrl;
      link.click();
      track("export", { format: "png" });
    } finally {
      setExporting(false);
    }
  }, [frameRef]);

  const handleExportSvg = useCallback(async () => {
    if (!frameRef.current) return;
    setExporting(true);
    try {
      await document.fonts.ready;
      const dataUrl = await exportSvg(frameRef.current);
      const link = document.createElement("a");
      link.download = "ray-tinte.svg";
      link.href = dataUrl;
      link.click();
      track("export", { format: "svg" });
    } finally {
      setExporting(false);
    }
  }, [frameRef]);

  const handleCopy = useCallback(async () => {
    if (!frameRef.current) return false;
    setExporting(true);
    try {
      await document.fonts.ready;
      const success = await copyToClipboard(frameRef.current);
      if (success) track("export", { format: "clipboard" });
      return success;
    } finally {
      setExporting(false);
    }
  }, [frameRef]);

  return {
    exportPng: handleExportPng,
    exportSvg: handleExportSvg,
    copyToClipboard: handleCopy,
    canCopy: supportsClipboard(),
    exporting,
  };
}
