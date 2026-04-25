"use client";

import { useState } from "react";

interface ExportTinteButtonProps {
  kitId: string;
}

export function ExportTinteButton({ kitId }: ExportTinteButtonProps) {
  const [installCommand, setInstallCommand] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function exportTheme() {
    setIsPending(true);
    setStatus("");

    try {
      const response = await fetch(`/api/kit/${kitId}/export-theme`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        installCommand?: string;
        error?: string;
      };

      if (!response.ok || !payload.installCommand) {
        throw new Error(payload.error ?? "Export failed");
      }

      setInstallCommand(payload.installCommand);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsPending(false);
    }
  }

  async function copyCommand() {
    await navigator.clipboard.writeText(installCommand);
    setStatus("Copied");
  }

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex h-10 items-center rounded-md border border-[#3a372f] px-4 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        onClick={exportTheme}
        type="button"
      >
        {isPending ? "Exporting..." : "Export to Tinte theme"}
      </button>
      {installCommand ? (
        <div className="grid gap-2 rounded-md border border-[#2b2925] bg-[#0c0c0b] p-3">
          <code className="break-all text-[#d6d0c7] text-xs">
            {installCommand}
          </code>
          <button
            className="h-9 w-fit rounded-md bg-[#d8ff5f] px-3 font-medium text-[#10110a] text-sm"
            onClick={copyCommand}
            type="button"
          >
            Copy
          </button>
        </div>
      ) : null}
      {status ? <p className="text-[#a7a096] text-sm">{status}</p> : null}
    </div>
  );
}
