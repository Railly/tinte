import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { SubscribedEmail } from "@/components/subscribed-email";

const resend = new Resend(process.env.RESEND_API_KEY!);
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function POST(request: NextRequest) {
  const { email, firstName } = await request.json();

  const ip = request.ip ?? request.headers.get("X-Forwarded-For") ?? "ip";

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const hashKey = `subscriptions:${email}`;
  const field = "tinte";
  const productName = "Tinte";

  const isSubscribed = await redis.hget(hashKey, field);

  if (isSubscribed) {
    return NextResponse.json(
      { error: "Email already subscribed" },
      { status: 400 }
    );
  }

  await redis.hset(hashKey, { [field]: "subscribed" });

  await resend.emails.send({
    from: "Railly Hugo <feedback@send.raillyhugo.com>",
    to: email,
    subject: "Subscription Confirmation",
    react: SubscribedEmail({
      firstName,
      productName,
      featuresLink: "https://tinte.railly.dev/features",
      unsubscribeLink: `https://tinte.railly.dev/api/unsubscribe?email=${encodeURIComponent(
        email
      )}`,
    }),
    text: `Welcome, ${firstName}! Thank you for subscribing to ${productName}. We're thrilled to have you on board! As a subscriber, you'll be the first to know about our latest features, updates, and exclusive offers. If you wish to unsubscribe, click here: https://yourproduct.com/unsubscribe?email=${encodeURIComponent(
      email
    )}`,
  });

  return NextResponse.json(
    { message: "Email subscribed successfully" },
    { status: 200 }
  );
}
