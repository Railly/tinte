"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeCodePreviewProps {
  code: string;
  language: string;
  filename: string;
  onCopy: () => void;
}

export function ThemeCodePreview({
  code,
  language,
  filename,
  onCopy,
}: ThemeCodePreviewProps) {
  const formatCode = (code: string, language: string) => {
    if (language === "json") {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    }
    return code;
  };

  const formattedCode = formatCode(code, language);
  const lines = formattedCode.split("\n");
  const maxLines = 12;
  const displayLines = lines.slice(0, maxLines);
  const hasMore = lines.length > maxLines;

  return (
    <div className="bg-background/80 rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
          </div>
          <code className="text-xs text-muted-foreground font-mono">
            {filename}
          </code>
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onCopy}>
          <Copy className="w-3 h-3" />
        </Button>
      </div>

      <div className="relative">
        <pre className="text-xs font-mono leading-relaxed p-3 overflow-x-auto max-h-64 overflow-y-auto">
          <code className="text-foreground">
            {displayLines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-muted-foreground/50 select-none w-8 text-right pr-2">
                  {index + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
            {hasMore && (
              <div className="flex text-muted-foreground/60 italic">
                <span className="w-8 text-right pr-2">...</span>
                <span>({lines.length - maxLines} more lines)</span>
              </div>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
