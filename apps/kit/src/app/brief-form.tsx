"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface BriefFormProps {
  isSignedIn: boolean;
}

export function BriefForm({ isSignedIn }: BriefFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
      className="grid gap-5 rounded-lg border border-[#2b2925] bg-[#171613] p-5"
    >
      <label className="grid gap-2">
        <span className="font-medium text-sm">Name</span>
        <input
          className="h-12 rounded-md border border-[#3a372f] bg-[#0c0c0b] px-3 outline-none focus:border-[#d8ff5f]"
          maxLength={80}
          name="name"
          placeholder="Tinte Kit"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="font-medium text-sm">Description</span>
        <textarea
          className="min-h-32 resize-none rounded-md border border-[#3a372f] bg-[#0c0c0b] p-3 outline-none focus:border-[#d8ff5f]"
          maxLength={500}
          name="description"
          placeholder="A brand kit generator for founders shipping fast."
          required
        />
      </label>
      {error ? <p className="text-[#ff7a7a] text-sm">{error}</p> : null}
      <button
        className="h-12 rounded-md bg-[#d8ff5f] px-4 font-medium text-[#10110a] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!isSignedIn || isPending}
      >
        {isPending ? "Generating..." : "Generate kit"}
      </button>
    </form>
  );
}
