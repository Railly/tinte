import { PlanCard, type PricingPlanCard } from "@/components/pricing/plan-card";
import { PromoCountdown } from "@/components/pricing/promo-countdown";
import { PRICING } from "@/lib/polar";

const plans: PricingPlanCard[] = [
  {
    title: "Free",
    description:
      "Generate the first four brand kit cards and share the result.",
    sale: 0,
    cta: "Start free",
    bullets: [
      "Logo and three variations",
      "Moodboard direction",
      "Bento presentation",
      "Watermarked downloads",
    ],
  },
  {
    plan: "kit_pro",
    title: "Kit Pro",
    description: "Unlock the complete kit for one brand with premium exports.",
    sale: PRICING.kit_pro.sale,
    regular: PRICING.kit_pro.regular,
    cta: "Unlock complete kit",
    bullets: [
      "Five extra premium cards",
      "ZIP with HD assets",
      "Design tokens JSON",
      "No watermark",
    ],
  },
  {
    plan: "kit_pack_5",
    title: "Kit Pack 5",
    description: "Best for founders testing multiple product directions.",
    sale: PRICING.kit_pack_5.sale,
    regular: PRICING.kit_pack_5.regular,
    cta: "Get 5 kits",
    featured: true,
    bullets: [
      "Five complete brand kits",
      "Lowest per-kit launch price",
      "Premium asset expansion",
      "ZIP and token exports",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen px-6 py-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-[#2b2925] border-b pb-5">
        <a className="font-semibold text-lg" href="/">
          kit.tinte.dev
        </a>
        <a className="text-[#a7a096] text-sm" href="/">
          Generate
        </a>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-8 py-10">
        <div className="max-w-3xl">
          <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
            Pricing
          </p>
          <h1 className="mt-3 font-semibold text-4xl">
            Upgrade from a free kit to production-ready brand assets.
          </h1>
          <p className="mt-3 text-[#a7a096]">
            Keep the free kit for sharing, or unlock the complete Pro expansion
            when the direction is worth shipping.
          </p>
        </div>
        <PromoCountdown />
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.title} plan={plan} />
          ))}
        </div>
      </section>
    </main>
  );
}
