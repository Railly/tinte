import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "TODO_POLAR_ACCESS_TOKEN",
  server: (process.env.POLAR_SERVER ?? "sandbox") as "sandbox" | "production",
});

export const PRICING = {
  kit_pro: {
    id: process.env.POLAR_PRODUCT_KIT_PRO_ID,
    sale: 19,
    regular: 29,
  },
  kit_pack_5: {
    id: process.env.POLAR_PRODUCT_KIT_PACK_ID,
    sale: 69,
    regular: 99,
  },
} as const;

export const PROMO = {
  code: "LAUNCH50",
  discount: 50,
  endsAt: "2026-05-02T23:59:59Z",
  maxRedemptions: 100,
};

export type PricingPlan = keyof typeof PRICING;
