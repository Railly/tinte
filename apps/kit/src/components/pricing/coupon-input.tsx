"use client";

import { useState } from "react";

interface CouponInputProps {
  onApply: (coupon: { code: string; discount: number }) => void;
}

export function CouponInput({ onApply }: CouponInputProps) {
  const [code, setCode] = useState("LAUNCH50");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function applyCoupon() {
    setIsPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as {
        valid: boolean;
        discount?: number;
        error?: string;
      };

      if (!response.ok || !payload.valid || !payload.discount) {
        throw new Error(payload.error ?? "Coupon is not valid");
      }

      const normalized = code.trim().toUpperCase();
      localStorage.setItem(
        "kit:coupon",
        JSON.stringify({ code: normalized, discount: payload.discount }),
      );
      onApply({ code: normalized, discount: payload.discount });
      setMessage(`${payload.discount}% applied`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Coupon failed");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <input
          className="h-10 min-w-0 flex-1 rounded-md border border-[#2b2925] bg-[#0c0c0b] px-3 text-sm outline-none focus:border-[#d8ff5f]"
          onChange={(event) => setCode(event.target.value)}
          value={code}
        />
        <button
          className="h-10 rounded-md border border-[#3a372f] px-3 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          onClick={applyCoupon}
          type="button"
        >
          {isPending ? "Applying" : "Apply"}
        </button>
      </div>
      {message ? <p className="text-[#a7a096] text-sm">{message}</p> : null}
    </div>
  );
}
