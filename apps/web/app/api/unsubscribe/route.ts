import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is missing" },
      { status: 400 }
    );
  }

  const hashKey = `subscriptions:${email}`;
  const field = "tinte";

  const isSubscribed = await redis.hget(hashKey, field);
  if (!isSubscribed) {
    return NextResponse.json(
      { error: "Email is not subscribed" },
      { status: 400 }
    );
  }

  await redis.hdel(hashKey, field);

  return NextResponse.json(
    { message: "Email unsubscribed successfully" },
    { status: 200 }
  );
}
