"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

    if (apiKey && typeof window !== "undefined") {
      posthog.init(apiKey, {
        api_host: apiHost,
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        capture_exceptions: true,
        session_recording: {
          recordCrossOriginIframes: true,
          maskAllInputs: false,
          maskTextSelector: ".sensitive",
        },
        debug: process.env.NODE_ENV === "development",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized successfully");
          }
        },
      });
    } else if (process.env.NODE_ENV === "development") {
      console.warn(
        "PostHog API key not found. Set NEXT_PUBLIC_POSTHOG_KEY in your .env file",
      );
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
