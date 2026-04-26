import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const PASS_THROUGH: LimitResult = {
  success: true,
  limit: 0,
  remaining: 0,
  reset: 0,
};

function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "kit:generate",
      analytics: true,
    });
  } catch {
    return null;
  }
}

const limiter = getRatelimit();

export const kitGenerateRatelimit = {
  async limit(userId: string): Promise<LimitResult> {
    if (!limiter) return PASS_THROUGH;
    try {
      const result = await limiter.limit(userId);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      console.warn(
        "[ratelimit] Upstash unreachable, allowing request:",
        error instanceof Error ? error.message : error,
      );
      return PASS_THROUGH;
    }
  },
};

export function rateLimitHeaders(result: LimitResult) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}
