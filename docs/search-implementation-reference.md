# Search Implementation Technical Reference

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Theme Selector│    │   Search Service │    │  Upstash Search │
│   Component     │───▶│   (Backend)      │───▶│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  useThemeSearch │    │  REST API        │    │  12,937 Themes  │
│  Hook           │    │  Endpoints       │    │  (10k uploaded) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Code Flow

### Search Request Flow
1. **User types** in theme selector
2. **useThemeSearch hook** debounces input (300ms)
3. **Fetch request** to `/api/search?q=query`
4. **SearchService** queries Upstash with reranking
5. **Results returned** as ThemeData objects
6. **Component renders** search results with loading states

### Upload Resume Flow
1. **API call** to `/api/search/resume`
2. **SearchService.getRemainingThemes()** identifies themes 10,001-12,937
3. **SearchService.upsertThemes()** uploads in 100-theme batches
4. **Progress logged** per batch completion
5. **Success/error response** returned to caller

## Key Implementation Details

### Theme Data Transformation

**Database Theme → Search Document:**
```typescript
// Input: DbTheme from database
{
  id: "abc123",
  name: "Dark Theme",
  user_id: "user1", 
  light_bg: "#ffffff",
  dark_bg: "#000000",
  // ... 26 color fields
}

// Output: Upstash Search Document
{
  id: "abc123",
  content: {
    name: "Dark Theme",
    description: "Beautiful dark theme theme shared by the community",
    author: "Community",
    provider: "tinte",
    tags: "community public shared",
    colors: "primary:#d4d4d4 secondary:#a9a9a9 accent:#ffffff"
  },
  metadata: {
    downloads: 0,
    likes: 0, 
    views: 0,
    createdAt: "2024-10-14T19:04:25.722Z",
    rawTheme: "{\"light\":{\"bg\":\"#ffffff\"...}}",
    colors: "{\"primary\":\"#d4d4d4\"...}"
  }
}
```

### Search Result Transformation

**Upstash Result → ThemeData:**
```typescript
// Input: Upstash search result
{
  id: "abc123",
  content: { name: "Dark Theme", author: "Community", ... },
  metadata: { rawTheme: "{...}", colors: "{...}", ... }
}

// Output: ThemeData object
{
  id: "abc123",
  name: "Dark Theme",
  description: "Beautiful dark theme theme shared by the community",
  author: "Community",
  provider: "tinte",
  downloads: 0,
  likes: 0,
  views: 0,
  tags: ["community", "public", "shared"],
  colors: { primary: "#d4d4d4", secondary: "#a9a9a9", ... },
  rawTheme: { light: { bg: "#ffffff", ... }, dark: { ... } },
  createdAt: "2024-10-14T19:04:25.722Z"
}
```

### Upload Strategy

**Batch Processing Logic:**
```typescript
const batchSize = 100;
const batches = [];

for (let i = 0; i < documents.length; i += batchSize) {
  batches.push(documents.slice(i, i + batchSize));
}

for (const batch of batches) {
  await this.index.upsert(batch); // Max 100 documents per call
}
```

**Resume Logic:**
```typescript
const UPLOADED_COUNT = 10000; // Known from error logs
const remainingThemes = allThemes.slice(UPLOADED_COUNT);
// Only upload themes 10,001 through 12,937
```

## Error Handling

### Daily Write Limit
```typescript
if (error.message.includes("Exceeded daily write limit")) {
  return {
    error: "Daily write limit exceeded",
    message: "Please try again in 24 hours",
    canRetryAfter: "24 hours"
  };
}
```

### Read Limit Avoidance
```typescript
// Instead of reading all themes from Upstash:
const searchResults = await this.index.search({
  query: "*",
  limit: 15000 // ❌ This hits read limits
});

// We use estimation:
const searchResults = await this.index.search({
  query: "theme",
  limit: 100 // ✅ Within limits
});
const estimatedCount = searchResults.length === 100 ? 10000 : searchResults.length;
```

## Performance Optimizations

### Frontend
- **Debouncing:** 300ms delay prevents excessive API calls
- **Memoization:** `useMemo` for combining search and built-in themes
- **Loading states:** Immediate feedback with spinner
- **Error boundaries:** Graceful degradation on search failures

### Backend
- **Batch processing:** 100 themes per upload (optimal for Upstash)
- **Progress logging:** Console output per batch for monitoring
- **Error isolation:** Single batch failure doesn't stop entire upload
- **Memory efficiency:** Streaming large datasets

### Search Engine
- **Reranking enabled:** Better result relevance
- **Semantic search:** Natural language queries work well
- **Result limiting:** Default 20 results for fast response
- **Upstash caching:** Built-in performance optimization

## Database Schema Reference

### Theme Table Fields Used
```sql
-- Core identification
id VARCHAR PRIMARY KEY
name VARCHAR NOT NULL
user_id VARCHAR
created_at TIMESTAMP
is_public BOOLEAN

-- Light mode colors (13 fields)
light_bg, light_bg_2, light_ui, light_ui_2, light_ui_3
light_tx, light_tx_2, light_tx_3
light_pr, light_sc, light_ac_1, light_ac_2, light_ac_3

-- Dark mode colors (13 fields)  
dark_bg, dark_bg_2, dark_ui, dark_ui_2, dark_ui_3
dark_tx, dark_tx_2, dark_tx_3
dark_pr, dark_sc, dark_ac_1, dark_ac_2, dark_ac_3
```

### Query for All Public Themes
```typescript
const dbThemes = await db
  .select()
  .from(theme)
  .where(eq(theme.is_public, true))
  .orderBy(desc(theme.created_at));
```

## Testing Checklist

### Upload Verification
- [ ] Status shows correct counts
- [ ] Resume only uploads remaining themes
- [ ] Error handling for daily limits
- [ ] Progress logging works
- [ ] Database order preserved

### Search Functionality  
- [ ] Real-time search works
- [ ] Loading states display
- [ ] Error states handled
- [ ] Debouncing prevents spam
- [ ] Results match query intent

### Integration Testing
- [ ] Theme selector shows search results
- [ ] Built-in themes still available
- [ ] Theme selection works
- [ ] Color previews render
- [ ] Author icons display correctly

## Configuration Reference

### Upstash Limits
- **Daily writes:** 10,000 operations
- **Read limit:** 100 queries per request
- **Document size:** Up to 1MB per document
- **Index size:** Unlimited (paid plan)

### Environment Setup
```bash
# Required environment variables
UPSTASH_SEARCH_REST_URL="https://credible-mongoose-43939-gcp-usc1-search.upstash.io"
UPSTASH_SEARCH_REST_TOKEN="..."

# Database connection (existing)
DATABASE_URL="postgresql://..."
```

### API Endpoints Summary
```
GET  /api/search                 # Search themes
POST /api/search/upload         # Initial upload (one-time)
POST /api/search/resume         # Resume incomplete upload
GET  /api/search/status         # Check upload progress  
GET  /api/search/remaining      # List pending themes
```

## Monitoring & Debugging

### Useful Logs
```bash
# Server logs during upload
"UserThemeService - All public themes count: 12937"
"Uploaded batch of 100 themes"
"Error uploading batch: Exceeded daily write limit"

# Search logs
"Search error: [error details]"
"🎨 Theme Card Debug: { themeName: '...', shadcnFonts: ... }"
```

### Debug Commands
```bash
# Check if search is working
curl "http://localhost:3000/api/search?q=test&limit=1"

# Monitor upload progress
curl http://localhost:3000/api/search/status | jq

# Get sample of remaining themes
curl http://localhost:3000/api/search/remaining | jq '.remainingThemes | .[0:5]'
```

---

**File Dependencies:** See `upstash-search-integration.md` for complete file list  
**Last Updated:** January 2025  
**Implementation Status:** 77% complete (10,000/12,937 themes uploaded)