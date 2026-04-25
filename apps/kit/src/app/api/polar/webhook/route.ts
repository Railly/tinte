import { Webhooks } from "@polar-sh/nextjs";
import { tasks } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";

import { brandKits, db, type JsonValue, polarOrders } from "@/db";
import { PRICING, type PricingPlan } from "@/lib/polar";

type WebhookPayload = { type?: string; data?: unknown } & Record<
  string,
  unknown
>;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function readString(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNumber(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "number" ? value : undefined;
}

function readPlan(value: string | undefined): PricingPlan | undefined {
  return value === "kit_pro" || value === "kit_pack_5" ? value : undefined;
}

function orderStatus(data: Record<string, unknown>) {
  const status = readString(data, "status");
  if (status === "paid" || status === "completed") return "completed";
  if (status === "refunded") return "refunded";
  if (status === "failed") return "failed";
  return "pending";
}

async function processPolarOrder(payload: WebhookPayload) {
  const data = asRecord(payload.data) ?? payload;
  const metadata = asRecord(data.metadata);
  const plan = readPlan(readString(metadata, "plan"));
  const kitId = readString(metadata, "kitId");
  const userId = readString(metadata, "userId");
  const orderId =
    readString(data, "id") ??
    readString(data, "orderId") ??
    readString(data, "order_id");

  if (!orderId || !kitId || !userId || !plan) return;

  const product = asRecord(data.product);
  const productId =
    readString(data, "productId") ??
    readString(data, "product_id") ??
    readString(product, "id") ??
    PRICING[plan].id ??
    "";
  const amount =
    readNumber(data, "totalAmount") ??
    readNumber(data, "total_amount") ??
    readNumber(data, "amount") ??
    PRICING[plan].sale * 100;
  const currency = readString(data, "currency") ?? "usd";

  const inserted = await db
    .insert(polarOrders)
    .values({
      id: orderId,
      kit_id: kitId,
      user_id: userId,
      product_id: productId,
      amount_cents: amount,
      currency,
      status: orderStatus(data),
      raw_payload: payload as Record<string, JsonValue>,
    })
    .onConflictDoNothing()
    .returning({ id: polarOrders.id });

  if (inserted.length === 0) return;

  await db
    .update(brandKits)
    .set({
      is_paid: true,
      paid_tier: plan,
      polar_order_id: orderId,
    })
    .where(eq(brandKits.id, kitId));

  await tasks.trigger("kit-expand", { kitId, plan, orderId });
}

export const POST = Webhooks({
  webhookSecret:
    process.env.POLAR_WEBHOOK_SECRET ?? "TODO_POLAR_WEBHOOK_SECRET",
  onPayload: async (payload: WebhookPayload) => {
    if (
      payload.type === "order.created" ||
      payload.type === "order.paid" ||
      payload.type === "checkout.completed"
    ) {
      await processPolarOrder(payload);
    }
  },
});
