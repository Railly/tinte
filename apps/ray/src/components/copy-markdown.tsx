"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy as Markdown
        </>
      )}
    </button>
  );
}
