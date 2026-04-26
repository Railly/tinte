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
      className="mx-auto grid w-full max-w-xl gap-4 rounded-2xl border border-[#2b2925] bg-[#171613]/60 p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <label className="grid gap-1.5">
          <span className="font-medium text-[#a7a096] text-xs uppercase tracking-[0.14em]">
            Name
          </span>
          <input
            className="h-11 rounded-md border border-[#2b2925] bg-[#0c0c0b] px-3 text-[#f4f1e8] text-sm outline-none transition-colors focus:border-[#d8ff5f]"
            maxLength={80}
            name="name"
            placeholder="Tinte Kit"
            required
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-medium text-[#a7a096] text-xs uppercase tracking-[0.14em]">
            Description
          </span>
          <input
            className="h-11 rounded-md border border-[#2b2925] bg-[#0c0c0b] px-3 text-[#f4f1e8] text-sm outline-none transition-colors focus:border-[#d8ff5f]"
            maxLength={500}
            name="description"
            placeholder="A brand kit for founders shipping fast."
            required
          />
        </label>
      </div>

      <button
        className="flex items-center justify-between text-[#a7a096] text-xs transition-colors hover:text-[#f4f1e8]"
        onClick={() => setShowAdvanced((v) => !v)}
        type="button"
      >
        <span className="inline-flex items-center gap-1.5">
          <svg
            aria-hidden="true"
            className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Advanced settings
        </span>
        <span className="text-[#5f5a4e]">optional</span>
      </button>

      {showAdvanced ? (
        <div className="rounded-md border border-[#2b2925] bg-[#0c0c0b]/60 p-4">
          <AdvancedFields />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-[#5f1f1f] bg-[#1f0c0c] px-3 py-2 text-[#ff9b9b] text-sm">
          {error}
        </p>
      ) : null}

      {isSignedIn ? (
        <button
          className="h-11 rounded-md bg-[#d8ff5f] px-4 font-medium text-[#0c0c0b] text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Generating..." : "Generate kit →"}
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="h-11 rounded-md bg-[#d8ff5f] px-4 font-medium text-[#0c0c0b] text-sm transition-opacity hover:opacity-90"
            type="button"
          >
            Sign in to generate →
          </button>
        </SignInButton>
      )}
    </form>
  );
}
