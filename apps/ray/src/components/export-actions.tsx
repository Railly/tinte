import { ClipboardCopy, Download, FileImage } from "lucide-react";
import { useCallback, useState } from "react";

interface ExportActionsProps {
  onCopy: () => Promise<boolean | undefined>;
  onExportPng: () => Promise<void>;
  onExportSvg: () => Promise<void>;
  canCopy: boolean;
  exporting: boolean;
}

const btnClass =
  "flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed";

export function ExportActions({
  onCopy,
  onExportPng,
  onExportSvg,
  canCopy,
  exporting,
}: ExportActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await onCopy();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [onCopy]);

  return (
    <div className="flex items-center gap-0.5">
      {canCopy && (
        <button
          type="button"
          onClick={handleCopy}
          disabled={exporting}
          className={btnClass}
        >
          <ClipboardCopy className="w-3 h-3" />
          {copied ? "Copied" : "Copy"}
        </button>
      )}
      <button
        type="button"
        onClick={onExportPng}
        disabled={exporting}
        className={btnClass}
      >
        <Download className="w-3 h-3" />
        PNG
      </button>
      <button
        type="button"
        onClick={onExportSvg}
        disabled={exporting}
        className={btnClass}
      >
        <FileImage className="w-3 h-3" />
        SVG
      </button>
    </div>
  );
}
