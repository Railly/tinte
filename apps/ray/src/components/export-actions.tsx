import { ClipboardCopy, Download, FileImage } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface ExportActionsProps {
  onCopy: () => Promise<boolean | undefined>;
  onExportPng: () => Promise<void>;
  onExportSvg: () => Promise<void>;
  canCopy: boolean;
  exporting: boolean;
}

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
    <ButtonGroup>
      {canCopy && (
        <Button
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          disabled={exporting}
        >
          <ClipboardCopy />
          {copied ? "Copied" : "Copy"}
        </Button>
      )}
      <Button
        variant="ghost"
        size="xs"
        onClick={onExportPng}
        disabled={exporting}
      >
        <Download />
        PNG
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={onExportSvg}
        disabled={exporting}
      >
        <FileImage />
        SVG
      </Button>
    </ButtonGroup>
  );
}
