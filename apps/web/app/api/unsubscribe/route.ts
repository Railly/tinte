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

  // Check if email is subscribed
  const isSubscribed = await redis.get(email);
  if (!isSubscribed) {
    return NextResponse.json(
      { error: "Email is not subscribed" },
      { status: 400 }
    );
  }

  // Unsubscribe email from Redis
  await redis.del(email);

  return NextResponse.json(
    { message: "Email unsubscribed successfully" },
    { status: 200 }
  );
}
