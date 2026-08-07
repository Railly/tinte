"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COPIED_RESET_MS = 2000;

interface CopyCommandProps {
  command: string;
  label: string;
  variant: "primary" | "secondary";
}

/**
 * A copy-to-clipboard button whose visible face is the install command itself.
 * The command is the affordance, so it is rendered in mono at full contrast
 * rather than hidden behind a verb.
 *
 * Both variants stay inside the inverted primary style: the primary is the
 * foreground/background inversion the config mandates for a CTA, the secondary
 * is the same pair unswapped behind a border. Neither introduces a hue.
 */
export function CopyCommand({ command, label, variant }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A click that lands after unmount would set state on a dead component, and
  // a second click before the reset would leak the first timer.
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // A denied clipboard permission is not worth a thrown error on a landing
      // page. The command stays selectable as text either way.
      return;
    }

    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  const isPrimary = variant === "primary";
  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: copy ${command}`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-mono text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isPrimary
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:text-foreground",
      )}
      style={{ touchAction: "manipulation" }}
    >
      <span>{command}</span>
      <Icon aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
