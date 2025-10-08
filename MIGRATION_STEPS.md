# Migration from better-auth to Clerk - Final Steps

## ✅ Completed:
1. Installed Clerk packages
2. Configured Clerk middleware and providers
3. Created webhook endpoint for user sync
4. Replaced all better-auth code with Clerk
5. Simplified user schema to use Clerk ID directly as PK
6. Created migrations to:
   - Drop better-auth tables (session, account, verification)
   - Simplify user.id to use clerk_id directly

## 🚀 Steps to deploy:

### 1. Configure Clerk Webhook (IMPORTANT - Do this first!)

In Clerk Dashboard (https://dashboard.clerk.com):
1. Go to **Webhooks** section
2. Click **Add Endpoint**
3. **Endpoint URL**: `https://your-production-domain.com/api/webhooks/clerk`
   - For development: Use ngrok or similar to expose localhost
4. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
5. Copy the **Signing Secret**
6. Add to `.env`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 2. Run Database Migrations

**⚠️ BACKUP YOUR DATABASE FIRST!**

```bash
# Option A: Apply all migrations at once
bunx drizzle-kit push

# Option B: Apply migrations one by one (safer)
psql $DATABASE_URL -f drizzle/0001_drop_better_auth_tables.sql
psql $DATABASE_URL -f drizzle/0002_simplify_user_id.sql
```

**What these migrations do:**
- `0001`: Drops `session`, `account`, `verification` tables (better-auth)
- `0002`: 
  - Updates all `theme.user_id` to use Clerk IDs
  - Updates all `user_favorites.user_id` to use Clerk IDs  
  - Removes `clerk_id` column (now redundant)
  - `user.id` now stores Clerk IDs directly (`user_xxxxx`)

### 3. Test the Migration

```bash
# Start development server
bun dev

# Test authentication flow:
# 1. Sign in with Clerk
# 2. Verify user is created in database with Clerk ID
# 3. Create a theme
# 4. Verify theme.user_id matches your Clerk user ID
# 5. Test editing/deleting your own themes
# 6. Test that you can't edit others' themes
```

### 4. Environment Variables Needed

``env
# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Clerk URLs (optional, defaults shown)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Database
DATABASE_URL=postgresql://...

# Other services (already configured)
OPENAI_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
# ... etc
```

### 5. Verify Authorization Logic

All theme authorization now works like this:

```ts
// Server actions / API routes
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth(); // Returns "user_xxxxx"

// Check if user owns theme
const isOwner = theme.user_id === userId; // ✅ Direct comparison!

// No need to:
// - Look up internal user ID
// - Match clerk_id to id
// - Any complex joins
```

### 6. Remove Old Environment Variables

After migration is complete, remove from `.env`:
```env
# ❌ No longer needed
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GITHUB_CLIENT_ID  # Clerk handles OAuth
GITHUB_CLIENT_SECRET  # Clerk handles OAuth
```

## 🎯 Final Verification Checklist

- [ ] Clerk webhook endpoint is configured and working
- [ ] `CLERK_WEBHOOK_SECRET` is set in `.env`
- [ ] Database migrations applied successfully
- [ ] Users can sign in/sign up via Clerk
- [ ] New users are created in database with Clerk IDs
- [ ] Users can create themes
- [ ] Users can only edit/delete their own themes
- [ ] User favorites work correctly
- [ ] No TypeScript errors (`bun run type-check`)
- [ ] No linting errors (`bun run lint`)
- [ ] `.next` directory rebuilt

## 🐛 Troubleshooting

### Webhook not working
- Check `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
- Verify endpoint is publicly accessible (use ngrok for local dev)
- Check server logs for webhook errors

### Users not syncing
- Verify webhook events `user.created` and `user.updated` are enabled
- Check Clerk Dashboard > Webhooks > Message Attempts for errors

### Authorization failing
- Verify `theme.user_id` matches `userId` from `auth()`
- Both should be format `user_xxxxx`
- Check database: `SELECT id, user_id FROM theme LIMIT 5;`

### Type errors after migration
- Delete `.next` directory: `rm -rf .next`
- Restart dev server: `bun dev`
