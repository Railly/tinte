import { NextResponse } from "next/server";
import { z } from "zod";

import { PROMO, polar } from "@/lib/polar";

const bodySchema = z.object({
  code: z.string().trim().min(1).max(40),
});

interface PolarDiscount {
  code: string | null;
  basisPoints?: number;
  amount?: number;
  endsAt: Date | null;
  maxRedemptions: number | null;
  redemptionsCount: number;
}

function isPromoValid(code: string) {
  const now = Date.now();
  const endsAt = new Date(PROMO.endsAt).getTime();
  return code === PROMO.code && now <= endsAt;
}

function getDiscountPercent(discount: PolarDiscount) {
  if (typeof discount.basisPoints === "number") {
    return Math.round(discount.basisPoints / 100);
  }
  if (typeof discount.amount === "number") {
    return 0;
  }
  return 0;
}

async function validateWithPolar(code: string) {
  if (!process.env.POLAR_ACCESS_TOKEN) return null;

  try {
    const page = await polar.discounts.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID,
      query: code,
      limit: 10,
    });
    const discounts = page.result.items;
    const discount = discounts.find(
      (item) => item.code?.toUpperCase() === code,
    ) as PolarDiscount | undefined;

    if (!discount) return null;
    if (discount.endsAt && discount.endsAt.getTime() < Date.now()) return null;
    if (
      discount.maxRedemptions !== null &&
      discount.redemptionsCount >= discount.maxRedemptions
    ) {
      return null;
    }

    const discountPercent = getDiscountPercent(discount);
    return discountPercent > 0 ? discountPercent : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, discount: 0, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const code = parsed.data.code.toUpperCase();
  if (isPromoValid(code)) {
    return NextResponse.json({ valid: true, discount: PROMO.discount });
  }

  const polarDiscount = await validateWithPolar(code);
  if (polarDiscount) {
    return NextResponse.json({ valid: true, discount: polarDiscount });
  }

  return NextResponse.json({ valid: false, discount: 0 });
}
