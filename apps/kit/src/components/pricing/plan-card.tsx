"use client";

import { useState } from "react";

import type { PricingPlan } from "@/lib/polar";

export interface PricingPlanCard {
  plan?: PricingPlan;
  title: string;
  description: string;
  sale: number;
  regular?: number;
  cta: string;
  featured?: boolean;
  bullets: string[];
}

interface PlanCardProps {
  plan: PricingPlanCard;
  kitId?: string;
}

export function PlanCard({ plan, kitId }: PlanCardProps) {
  const [coupon, setCoupon] = useState("LAUNCH50");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (!plan.plan) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.plan,
          kitId,
          coupon: coupon.trim() || undefined,
        }),
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
      setIsLoading(false);
    }
  }

  return (
    <section
      className={`flex min-h-[430px] flex-col rounded-lg border p-5 ${
        plan.featured
          ? "border-[#d8ff5f] bg-[#1d1d15]"
          : "border-[#2b2925] bg-[#171613]"
      }`}
    >
      {plan.featured ? (
        <span className="mb-4 w-fit rounded-full bg-[#d8ff5f] px-3 py-1 font-medium text-[#10110a] text-xs">
          Best value
        </span>
      ) : null}
      <h2 className="font-semibold text-2xl">{plan.title}</h2>
      <p className="mt-2 min-h-12 text-[#a7a096] text-sm">{plan.description}</p>
      <div className="mt-6 flex items-end gap-3">
        <span className="font-semibold text-4xl">${plan.sale}</span>
        {plan.regular ? (
          <span className="pb-1 text-[#a7a096] line-through">
            ${plan.regular}
          </span>
        ) : null}
      </div>
      <ul className="mt-6 grid gap-2 text-[#d6d0c7] text-sm">
        {plan.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="mt-auto grid gap-3 pt-6">
        {plan.plan ? (
          <input
            className="h-10 rounded-md border border-[#2b2925] bg-[#0c0c0b] px-3 text-sm outline-none focus:border-[#d8ff5f]"
            onChange={(event) => setCoupon(event.target.value)}
            value={coupon}
          />
        ) : null}
        <button
          className="h-11 rounded-md bg-[#d8ff5f] px-4 font-medium text-[#10110a] text-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!plan.plan || isLoading}
          onClick={startCheckout}
          type="button"
        >
          {isLoading ? "Opening checkout..." : plan.cta}
        </button>
        {error ? <p className="text-red-300 text-sm">{error}</p> : null}
      </div>
    </section>
  );
}
