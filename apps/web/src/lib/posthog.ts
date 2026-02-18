import posthog from "posthog-js";

export function captureEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
}

export function resetUser() {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
}

export { posthog };
