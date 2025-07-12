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

### Project Structure

- `lib/db/schema.ts` - Database schema with RLS policies
- `lib/db/queries.ts` - RLS-aware database operations
- `lib/db/rls.ts` - RLS context management utilities
- `lib/auth-utils.ts` - Clerk authentication helpers
- `lib/actions/theme-actions.ts` - Server actions for mutations with search integration
- `lib/services/search.ts` - Upstash Search service for theme indexing/search
- `lib/stores/theme-store.ts` - Zustand client state management
- `components/` - React components (server and client)

### Security Model

1. **Authentication**: Clerk verifies user identity
2. **Authorization**: Supabase RLS policies enforce data access rules
3. **Data Isolation**: Users can only access their own themes + public themes
4. **Admin Override**: `adminDb` bypasses RLS for admin operations

### Search Integration with Upstash

- **Upstash Search** for real-time theme search and discovery
- Automatic indexing when themes are created, updated, or deleted
- Search respects RLS policies (users see only their own + public themes)
- Search service in lib/services/search.ts handles all search operations
- Graceful degradation: search failures don't break theme operations

#### Search Features

**Automatic Indexing**:
- Theme creation → Index in Upstash Search
- Theme updates → Re-index in Upstash Search  
- Theme deletion → Remove from Upstash Search
- Visibility changes → Update search metadata

**Search Operations**:
```typescript
import { searchThemes, indexTheme, deleteThemeFromIndex } from "@/lib/services/search";

// Search with user permissions
const results = await searchThemes("dark theme", { 
  userId: "user_123", 
  limit: 10 
});

// Public-only search
const publicResults = await searchThemes("minimal", { 
  publicOnly: true 
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
