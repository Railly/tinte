"use client";

import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdvancedFields } from "@/components/brief/advanced-fields";

interface BriefFormProps {
  isSignedIn: boolean;
}

export function BriefForm({ isSignedIn }: BriefFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function submit(formData: FormData) {
    setError(null);
    setIsPending(true);

    const response = await fetch("/api/kit/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        advanced: showAdvanced
          ? {
              vibe: formData.getAll("advanced.vibe"),
              colors: formData.getAll("advanced.colors"),
              refImages: formData.getAll("advanced.refImages"),
            }
          : undefined,
      }),
    });

    const payload = (await response.json()) as
      | { kitId: string }
      | { error?: string };

    setIsPending(false);

    if (!response.ok || !("kitId" in payload)) {
      setError(
        "error" in payload
          ? (payload.error ?? "Generation failed")
          : "Generation failed",
      );
      return;
    }

    router.replace(`/k/${payload.kitId}`);
  }

  return (
    <form
      action={submit}
      className="rounded-lg border border-[var(--color-ui)] bg-[var(--color-bg-2)]/40"
    >
      <div className="border-[var(--color-ui)] border-b px-5 py-3">
        <p className="font-mono text-[10px] text-[var(--color-tx-2)] uppercase tracking-[0.18em]">
          New brief
        </p>
      </div>

      <div className="grid gap-4 p-5">
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] text-[var(--color-tx-2)] uppercase tracking-[0.14em]">
            Brand name
          </span>
          <input
            className="h-9 rounded border border-[var(--color-ui)] bg-[var(--color-bg)] px-3 text-[14px] text-[var(--color-tx)] outline-none transition-colors placeholder:text-[var(--color-tx-3)] focus:border-[var(--color-pr)]"
            maxLength={80}
            name="name"
            placeholder="Acme"
            required
          />
        </label>

        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] text-[var(--color-tx-2)] uppercase tracking-[0.14em]">
            One-line description
          </span>
          <textarea
            className="min-h-[88px] resize-none rounded border border-[var(--color-ui)] bg-[var(--color-bg)] p-3 text-[14px] text-[var(--color-tx)] leading-6 outline-none transition-colors placeholder:text-[var(--color-tx-3)] focus:border-[var(--color-pr)]"
            maxLength={500}
            name="description"
            placeholder="A modular furniture brand for small apartments. Warm, geometric, slightly retro."
            required
          />
        </label>

        <button
          className="-mx-1 flex items-center justify-between rounded px-1 py-1 text-[12px] text-[var(--color-tx-2)] transition-colors hover:text-[var(--color-tx)]"
          onClick={() => setShowAdvanced((v) => !v)}
          type="button"
        >
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Advanced steering
          </span>
          <span className="font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.14em]">
            Optional
          </span>
        </button>

        {showAdvanced ? (
          <div className="-mx-5 animate-fade-in border-[var(--color-ui)] border-t bg-[var(--color-bg)]/40 px-5">
            <AdvancedFields />
          </div>
        ) : null}

        {error ? (
          <p className="rounded border border-[var(--color-ac-1)]/40 bg-[var(--color-ac-1)]/10 px-3 py-2 text-[12px] text-[var(--color-ac-1)]">
            {error}
          </p>
        ) : null}
      </div>

      <div className="border-[var(--color-ui)] border-t px-5 py-3">
        {isSignedIn ? (
          <button
            className="flex h-9 w-full items-center justify-center gap-2 rounded px-4 font-medium text-[12px] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            style={{
              background: "var(--color-tx)",
              color: "var(--color-bg)",
            }}
          >
            {isPending ? (
              <>
                <svg
                  aria-hidden="true"
                  className="h-3 w-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A7.96 7.96 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
                    fill="currentColor"
                  />
                </svg>
                Routing through models…
              </>
            ) : (
              <>
                Generate kit
                <span style={{ opacity: 0.5 }}>→</span>
              </>
            )}
          </button>
        ) : (
          <SignInButton mode="modal">
            <button
              className="flex h-9 w-full items-center justify-center gap-2 rounded px-4 font-medium text-[12px] transition-opacity hover:opacity-90"
              style={{
                background: "var(--color-tx)",
                color: "var(--color-bg)",
              }}
              type="button"
            >
              Sign in to generate
              <span style={{ opacity: 0.5 }}>→</span>
            </button>
          </SignInButton>
        )}
      </div>
    </form>
  );
}
