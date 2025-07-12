# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Next.js Turbo Mode
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run db:generate` - Generate Drizzle schema files from schema definitions
- `npm run db:migrate` - Run database migrations using Drizzle Kit
- `npm run db:studio` - Open Drizzle Studio for database management

## Tech Stack Architecture

This is a themes application (VS Code, Zed, Shadcn, JetBrains, Vim themes) built with Next.js and a modern full-stack architecture featuring Row-Level Security (RLS).

### Authentication & Authorization

- **Clerk** for authentication (app/layout.tsx:19)
- **Supabase RLS** for database-level security
- Users see only their own themes + public themes by default
- Clerk user IDs are mapped to Supabase auth context for RLS policies

### Database & ORM with RLS

- **PostgreSQL** with **Drizzle ORM** and **Row-Level Security** enabled
- RLS policies defined in lib/db/schema.ts for secure multi-tenant data access
- Two database clients: `adminDb` (bypasses RLS) and `userDb` (RLS-aware)
- RLS context management in lib/db/rls.ts with `withRLS()` helper function
- Database queries in lib/db/queries.ts automatically enforce user permissions

### RLS Architecture

```typescript
// Users can only see their own themes OR public themes
pgPolicy("themes_select_policy", {
  for: "select",
  to: authenticatedRole,
  using: sql`${table.userId} = auth.uid() OR ${table.public} = true`,
});
```

### API Layer with Authentication

- **Server Actions** with Clerk authentication context
- Server actions handle all mutations (create, update, delete)
- Direct database queries for data fetching in Server Components
- Authentication enforced via `requireAuth` helper function
- RLS policies enforce data isolation at the database level

### Theme Schema

```sql
themes {
  id: serial (primary key)
  name: text (required)
  description: text (optional)
  content: text (required) - JSON theme configuration
  userId: uuid (foreign key to auth.users)
  public: boolean (default false) - controls theme visibility
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Key Usage Patterns

**Server Components** (data fetching):

```typescript
import { getUserThemes, getPublicThemes } from "@/lib/db/queries";
import { getCurrentUserId } from "@/lib/auth-utils";

const userId = await getCurrentUserId();
const themes = userId ? await getUserThemes(userId) : await getPublicThemes();
```

**Server Actions** (mutations):

```typescript
import { createThemeAction } from "@/lib/actions/theme-actions";
// Used in forms with useActionState hook
```

**Client State Management**:

```typescript
import { useThemeStore } from "@/lib/stores/theme-store";
const { selectedTheme, setSelectedTheme } = useThemeStore();
```

**Direct Database (Admin)**:

```typescript
import { adminDb } from "@/lib/db";
const allThemes = await adminDb.select().from(themes); // Bypasses RLS
```

### Infinite Scroll & Search Architecture

**Hybrid Client Strategy**:
- **Anonymous Users**: Use public Supabase client (RLS enforces public-only access)
- **Authenticated Users**: Use Clerk-authenticated Supabase client (RLS allows own + public themes)
- **Search Integration**: Upstash Search as default with infinite scroll pagination
- **Graceful Fallback**: Local search when Upstash is disabled

**User Experience Flow**:

*Anonymous Users*:
- ✅ Browse infinite scroll of public themes only
- ✅ Search through public themes with Upstash AI search
- ❌ No filter toggles (always public-only)

*Authenticated Users*:
- ✅ Browse infinite scroll with "All Themes" (own + public) or "Public Only" toggle
- ✅ Search through own + public themes OR public-only based on toggle
- ✅ AI Search vs Local Search toggle available
- ✅ All CRUD operations with automatic search indexing

**Search Modes**:
```typescript
// Default: AI-powered search with infinite scroll
useUpstashSearch: true

// Fallback: Local text filtering  
useUpstashSearch: false
```

**Authentication-Aware Components**:
```typescript
// Automatic client selection based on auth status
const supabaseClient = isSignedIn ? useClerkSupabase() : supabase;

// Permission-aware infinite scroll
const shouldFilterPublic = !isAuthenticated || showPublicOnly;
```

### Project Structure

- `lib/db/schema.ts` - Database schema with RLS policies
- `lib/db/queries.ts` - RLS-aware database operations
- `lib/auth-utils.ts` - Clerk authentication helpers
- `lib/actions/theme-actions.ts` - Server actions for mutations with search integration
- `lib/services/search.ts` - Upstash Search service for theme indexing/search
- `lib/stores/theme-store.ts` - Zustand client state management
- `lib/hooks/use-infinite-query.ts` - Supabase infinite scroll with Clerk auth
- `lib/hooks/use-infinite-search.ts` - Upstash search with infinite pagination
- `lib/hooks/use-clerk-supabase.ts` - Clerk-authenticated Supabase client
- `lib/supabase/client.ts` - Public and authenticated Supabase clients
- `components/infinite-theme-list.tsx` - Infinite scroll component for themes
- `components/theme-list-client.tsx` - Smart routing between search/browse modes
- `components/theme-search.tsx` - AI-powered search with debouncing
- `components/theme-filters.tsx` - Authentication-aware filter toggles
- `app/api/search/route.ts` - Search API with pagination and permissions

### Security Model

1. **Authentication**: Clerk verifies user identity
2. **Authorization**: Supabase RLS policies enforce data access rules
3. **Data Isolation**: Users can only access their own themes + public themes
4. **Admin Override**: `adminDb` bypasses RLS for admin operations

### Search Integration with Upstash

**Real-time AI Search**:
- **Upstash Search** with semantic understanding and reranking
- **Infinite scroll pagination** for search results  
- **Permission-aware search** respecting RLS policies
- **Automatic indexing** on all theme mutations
- **Graceful degradation** with local search fallback

**Search Architecture**:
```typescript
// Three search modes based on context
1. No Query + No Auth → Infinite scroll public themes from DB
2. No Query + Authenticated → Infinite scroll own+public themes from DB  
3. With Query → Infinite scroll search results from Upstash
```

**Search Features**:

*Automatic Indexing*:
- Theme creation → Index in Upstash Search
- Theme updates → Re-index in Upstash Search  
- Theme deletion → Remove from Upstash Search
- Visibility changes → Update search metadata

*Smart Pagination*:
- Debounced search queries (300ms)
- Infinite scroll with intersection observer
- Request cancellation prevents race conditions
- Loading states and skeleton screens

*Permission Handling*:
```typescript
// Anonymous users - public only
const results = await searchThemes("query", { publicOnly: true });

// Authenticated users - based on toggle
const results = await searchThemes("query", { 
  userId: "user_123",
  publicOnly: showPublicOnly 
});
```

**Search Data Structure**:
```typescript
{
  id: "theme-123",
  content: {
    name: "Dark Professional", 
    description: "A sleek dark theme...",
    content: "{ theme json... }",
    public: true,
    userId: "user_123"
  },
  metadata: {
    themeId: 123,
    userId: "user_123",
    public: true,
    url: "/themes/123"
  }
}
```

### Environment Setup

Requires .env.local with:

- `DATABASE_URL` - PostgreSQL connection string
- `UPSTASH_SEARCH_REST_URL` - Upstash Search endpoint
- `UPSTASH_SEARCH_REST_TOKEN` - Upstash Search authentication token
- Clerk configuration variables
- Supabase configured with `authenticated` role for RLS
