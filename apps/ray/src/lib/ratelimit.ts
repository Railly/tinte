import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "ray:ai",
  analytics: true,
});

export const screenshotRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "ray:screenshot",
  analytics: true,
});

export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}

export function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}
