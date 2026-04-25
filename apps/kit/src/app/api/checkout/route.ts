import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { PRICING, polar } from "@/lib/polar";

const bodySchema = z.object({
  plan: z.enum(["kit_pro", "kit_pack_5"]),
  kitId: z.string().min(1).optional(),
  coupon: z.string().trim().min(1).max(40).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { plan, kitId, coupon } = parsed.data;
  const productId = PRICING[plan].id;
  if (!productId) {
    return NextResponse.json(
      { error: `Missing Polar product id for ${plan}` },
      { status: 500 },
    );
  }

  const requestUrl = new URL(request.url);
  const successUrl = new URL("/thank-you", requestUrl.origin);
  successUrl.searchParams.set("checkout_id", "{CHECKOUT_ID}");
  successUrl.searchParams.set("plan", plan);
  if (kitId) successUrl.searchParams.set("kit_id", kitId);

  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl: successUrl.toString(),
    allowDiscountCodes: true,
    metadata: {
      userId,
      plan,
      kitId: kitId ?? "",
      coupon: coupon ?? "",
    },
  });

  return NextResponse.json({ url: checkout.url });
}
