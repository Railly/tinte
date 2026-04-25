"use client";

import { useEffect, useState } from "react";

import { PROMO } from "@/lib/polar";

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function getCountdownParts(): CountdownParts | null {
  const diff = new Date(PROMO.endsAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function PromoCountdown() {
  const [countdown, setCountdown] = useState<CountdownParts | null>();

  useEffect(() => {
    const update = () => setCountdown(getCountdownParts());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="rounded-lg border border-[#2b2925] bg-[#171613] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-[#d8ff5f] text-sm">
            {PROMO.discount}% off with {PROMO.code}
          </p>
          <p className="mt-1 text-[#a7a096] text-sm">
            First {PROMO.maxRedemptions} launch redemptions before May 2.
          </p>
        </div>
        {countdown ? (
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Days", countdown.days],
              ["Hours", countdown.hours],
              ["Min", countdown.minutes],
              ["Sec", countdown.seconds],
            ].map(([label, value]) => (
              <div
                className="min-w-14 rounded-md border border-[#2b2925] bg-[#0c0c0b] px-3 py-2 text-center"
                key={label}
              >
                <div className="font-semibold text-xl">{value}</div>
                <div className="text-[#a7a096] text-[10px] uppercase tracking-[0.14em]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-[#2b2925] px-3 py-2 text-[#a7a096] text-sm">
            Launch promo ended
          </p>
        )}
      </div>
    </section>
  );
}
