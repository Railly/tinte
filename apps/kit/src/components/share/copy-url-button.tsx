"use client";

import { useEffect, useState } from "react";

interface CopyUrlButtonProps {
  url: string;
}

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyShareUrl() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className="relative">
      <button
        className="h-10 rounded-md border border-[#3a372f] px-4 font-medium text-sm hover:border-[#d8ff5f]"
        onClick={copyShareUrl}
        type="button"
      >
        Share
      </button>
      {copied ? (
        <span className="absolute top-12 right-0 rounded-md border border-[#3a372f] bg-[#171613] px-3 py-2 text-[#d8ff5f] text-sm shadow-xl">
          Copied!
        </span>
      ) : null}
    </div>
  );
}
