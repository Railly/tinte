"use client";

import { useState } from "react";

import type { PricingPlan } from "@/lib/polar";

interface ProCtaProps {
  kitId: string;
}

export function ProCta({ kitId }: ProCtaProps) {
  const [loadingPlan, setLoadingPlan] = useState<PricingPlan | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(plan: PricingPlan) {
    setLoadingPlan(plan);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, kitId, coupon: "LAUNCH50" }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed",
      );
      setLoadingPlan(null);
    }
  }

  return (
    <section className="rounded-lg border border-[#2b2925] bg-[#171613] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-medium">Unlock the complete kit</h2>
          <p className="mt-1 text-[#a7a096] text-sm">
            Add five premium cards, ZIP HD, tokens.json, and remove watermarks.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="h-10 rounded-md bg-[#d8ff5f] px-4 font-medium text-[#10110a] text-sm disabled:opacity-60"
            disabled={loadingPlan !== null}
            onClick={() => startCheckout("kit_pro")}
            type="button"
          >
            {loadingPlan === "kit_pro" ? "Opening..." : "Unlock $19"}
          </button>
          <button
            className="h-10 rounded-md border border-[#3a372f] px-4 font-medium text-sm disabled:opacity-60"
            disabled={loadingPlan !== null}
            onClick={() => startCheckout("kit_pack_5")}
            type="button"
          >
            {loadingPlan === "kit_pack_5" ? "Opening..." : "Get 5 kits $69"}
          </button>
        </div>
      </div>
      {error ? <p className="mt-3 text-red-300 text-sm">{error}</p> : null}
    </section>
  );
}
