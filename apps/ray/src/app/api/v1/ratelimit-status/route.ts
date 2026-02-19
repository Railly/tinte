import { NextResponse } from "next/server";
import { aiRatelimit, getIdentifier } from "@/lib/ratelimit";

export async function GET(request: Request) {
  const identifier = getIdentifier(request);
  const { remaining, limit, reset } = await aiRatelimit.getRemaining(identifier);

  return NextResponse.json(
    { remaining, limit, reset },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
