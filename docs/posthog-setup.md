# PostHog Analytics Setup

## Overview
PostHog is now properly configured in the application for client-side analytics tracking.

## Configuration

### 1. Environment Variables
Add these variables to your `.env.local` file:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=/ingest
```

### 2. Proxy Setup
The Next.js config includes reverse proxy rules to avoid ad-blockers:
- `/ingest/static/*` → PostHog static assets
- `/ingest/*` → PostHog API endpoints

## Usage

### Basic Event Tracking
```typescript
import { captureEvent } from "@/lib/posthog";

// Capture a custom event
captureEvent("button_clicked", {
  button_name: "create_theme",
  location: "homepage"
});
```

### User Identification
```typescript
import { identifyUser } from "@/lib/posthog";

// Identify a user (call this after user logs in)
identifyUser(user.id, {
  email: user.email,
  name: user.name,
  plan: user.plan
});
```

### Using the PostHog Hook
```typescript
import { usePostHog } from "posthog-js/react";

function MyComponent() {
  const posthog = usePostHog();
  
  const handleAction = () => {
    posthog.capture("action_performed", {
      action_type: "theme_created"
    });
  };
  
  return <button onClick={handleAction}>Create Theme</button>;
}
```

## Automatic Tracking

PostHog is configured to automatically capture:
- **Page views**: Every route change
- **Page leaves**: When users navigate away
- **Autocapture**: Clicks, form submissions, etc.
- **Exceptions**: JavaScript errors and exceptions

## Debug Mode

In development mode:
- Debug logging is enabled
- Console messages show PostHog initialization status
- Events are still sent to PostHog (consider using a development project)

## Verification

1. **Check Console**: In development, you should see:
   ```
   PostHog initialized successfully
   ```

2. **Network Tab**: Look for requests to `/ingest/` endpoints

3. **PostHog Dashboard**: Events should appear in your PostHog project within seconds

## Common Issues

### Events Not Showing Up
- Verify `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
- Check browser console for errors
- Ensure you're not blocking the `/ingest/` endpoints
- Check PostHog dashboard for any project-level issues

### Ad Blockers
The proxy setup (`/ingest/`) helps bypass ad blockers, but some aggressive blockers may still interfere. Test in an incognito window without extensions.

## Feature Flags Example
```typescript
import { useFeatureFlagEnabled } from "posthog-js/react";

function MyComponent() {
  const showNewFeature = useFeatureFlagEnabled("new-feature");
  
  return showNewFeature ? <NewFeature /> : <OldFeature />;
}
```

## Best Practices

1. **Event Naming**: Use snake_case for event names
2. **Properties**: Keep properties flat and simple
3. **PII**: Avoid sending sensitive personal information
4. **Rate Limiting**: PostHog batches events, but avoid excessive tracking
5. **Type Safety**: Create an enum for event names to avoid typos

### Example Event Names Enum
```typescript
// src/lib/analytics-events.ts
export const AnalyticsEvents = {
  THEME_CREATED: "theme_created",
  THEME_PUBLISHED: "theme_published",
  THEME_DOWNLOADED: "theme_downloaded",
  COLOR_CHANGED: "color_changed",
  EXPORT_STARTED: "export_started",
} as const;

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];
```

## Integration with Clerk

To identify users when they log in with Clerk:

```typescript
import { useUser } from "@clerk/nextjs";
import { identifyUser } from "@/lib/posthog";
import { useEffect } from "react";

function usePostHogUser() {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        created_at: user.createdAt
      });
    }
  }, [user]);
}
```

