# Upstash Search Integration Documentation

## Overview

This document explains the Upstash Search integration for searching through 12,937 community themes in the Tinte theme browser. The implementation allows real-time search through the entire theme database with advanced features like semantic search and reranking.

## Current Status

- ✅ **10,000 themes uploaded** to Upstash Search (reached daily write limit)
- ❌ **2,937 themes remaining** to upload (will auto-resume after 24h limit reset)
- ✅ **Search functionality active** and working with uploaded themes
- ✅ **Complete infrastructure** in place for theme search

## File Structure

### Core Service Files

#### `src/lib/services/search.service.ts`
**Main search service** - Contains all Upstash Search logic:
- `upsertThemes()` - Uploads themes in batches of 100
- `searchThemes()` - Searches themes with reranking
- `getRemainingThemes()` - Identifies themes 10,001-12,937 that need upload
- `resumeUpload()` - Continues upload from where it left off
- `getUploadedThemeCount()` - Estimates uploaded themes (respects read limits)

**Key Constants:**
- `UPLOADED_COUNT = 10000` - Known successful uploads before hitting limit
- Batch size: 100 themes per upload
- Search limit: 20 results by default

#### `src/lib/services/user-theme.service.ts`
**Database service** - Updated with new method:
- `getAllPublicThemes()` - Gets all 12,937 public themes from database (no pagination)

### API Endpoints

#### `src/app/api/search/route.ts`
**Search API** - `GET /api/search?q=query&limit=20`
- Real-time theme search
- Uses Upstash Search with reranking
- Returns structured ThemeData objects

#### `src/app/api/search/upload/route.ts`
**Initial upload** - `POST /api/search/upload`
- Uploads ALL themes to Upstash (use only once)
- **⚠️ WARNING:** Will hit daily limit after 10,000 themes

#### `src/app/api/search/resume/route.ts`
**Resume upload** - `POST /api/search/resume`
- **USE THIS** to upload remaining 2,937 themes after 24h
- Smart: only uploads themes 10,001-12,937
- Handles daily limit errors gracefully

#### `src/app/api/search/status/route.ts`
**Status check** - `GET /api/search/status`
- Shows upload progress
- Lists remaining themes to upload
- Estimates uploaded count

#### `src/app/api/search/remaining/route.ts`
**Remaining themes** - `GET /api/search/remaining`
- Full list of 2,937 pending themes
- Useful for debugging and verification

### Frontend Components

#### `src/components/shared/theme-selector.tsx`
**Updated theme selector** with search integration:
- Real-time search with 300ms debounce
- Loading states with spinner
- Error handling
- Grouped results: "Built-in Themes" vs "Search Results (N)"
- Placeholder: "Search 12k+ themes..."
- Community themes show 👥 icon

#### `src/hooks/use-theme-search.ts`
**Search hook** - Manages search state:
- Debounced search queries
- Loading and error states
- Automatic API calls to `/api/search`

#### `src/hooks/use-debounce.ts`
**Utility hook** - 300ms debounce for search input

## Environment Variables

Required in `.env`:
```bash
UPSTASH_SEARCH_REST_URL="https://credible-mongoose-43939-gcp-usc1-search.upstash.io"
UPSTASH_SEARCH_REST_TOKEN="ACAFMGNyZWRpYmxlLW1vbmdvb3NlLTQzOTM5LWdjcC11c2MxYWRtaW5OR1kyT1dFNFlqa3ROemRtWmkwME1UQTRMVGd4WlRVdFl6RmpabU0yTW1GaE9USXo="
```

## Data Structure

### Theme Search Index Structure
```typescript
{
  id: string,
  content: {
    name: string,
    description: string,
    author: string,
    provider: string,
    tags: string, // Space-separated
    colors: string // "key:value key:value" format
  },
  metadata: {
    downloads: number,
    likes: number,
    views: number,
    createdAt: string,
    rawTheme: string, // JSON stringified
    colors: string // JSON stringified
  }
}
```

## How to Complete the Upload

### Option 1: Simple Resume (Recommended)
```bash
curl -X POST http://localhost:3000/api/search/resume
```

### Option 2: Check Status First
```bash
# 1. Check current status
curl http://localhost:3000/api/search/status

# 2. Resume upload (after 24h limit reset)
curl -X POST http://localhost:3000/api/search/resume
```

### Option 3: Get Detailed List
```bash
# See all remaining themes
curl http://localhost:3000/api/search/remaining
```

## Troubleshooting

### Daily Limit Errors
**Error:** `"Exceeded daily write limit: 10000"`
**Solution:** Wait 24 hours, then use `/api/search/resume`

### Read Limit Errors
**Error:** `"Exceeded max allowed read limit: 100"`
**Solution:** Already handled - we use estimation instead of full reads

### Theme Not Found in Search
**Possible causes:**
1. Theme is in the remaining 2,937 (check `/api/search/status`)
2. Search query doesn't match theme content
3. Theme has unusual characters in name/description

### Search Performance
- **Fast:** Searches are cached and optimized by Upstash
- **Debounced:** 300ms delay prevents excessive API calls
- **Limited:** 20 results max (can be increased via `limit` param)

## Testing the Search

### Test Queries
```bash
# Test dark themes
curl "http://localhost:3000/api/search?q=dark&limit=5"

# Test sunset themes  
curl "http://localhost:3000/api/search?q=sunset&limit=3"

# Test neon themes
curl "http://localhost:3000/api/search?q=neon&limit=5"
```

### Expected Results
- Should return relevant themes with full ThemeData structure
- Community themes have `author: "Community"`
- Built-in themes have specific authors (tweakcn, ray.so, tinte)

## Architecture Decisions

### Why Upstash Search?
- **Semantic search:** Better than SQL LIKE queries
- **Reranking:** Improves result relevance
- **Scalable:** Handles 12k+ themes efficiently
- **Real-time:** No indexing delays

### Why Batch Upload?
- **Rate limits:** Upstash has 10k daily write limit
- **Performance:** 100 themes per batch is optimal
- **Reliability:** Error handling per batch

### Why Estimation Instead of Full Read?
- **Read limits:** Upstash limits reads to 100 queries
- **Predictable:** We know exactly when upload stopped (theme 10,000)
- **Efficient:** No need to read all 10k+ themes

## Integration Points

### Theme Context Provider
- Located: `src/providers/theme.tsx`
- The theme selector gets themes from context
- Search results are merged with built-in themes

### Theme Browser Page
- Located: `src/app/themes/page.tsx`
- Uses the updated theme selector
- Shows both user themes and searchable community themes

### Workbench Header
- Located: `src/components/workbench/workbench-header.tsx`
- Main entry point for theme selection
- Uses the enhanced theme selector

## Future Improvements

1. **Auto-resume:** Schedule automatic upload completion
2. **Search filters:** Add filtering by author, tags, creation date
3. **Search analytics:** Track popular search terms
4. **Theme recommendations:** Use search data for suggestions
5. **Pagination:** Handle large result sets better

## Dependencies

```json
{
  "@upstash/search": "^0.1.5"
}
```

## Quick Reference Commands

```bash
# Check upload status
curl http://localhost:3000/api/search/status

# Resume upload (use after 24h)
curl -X POST http://localhost:3000/api/search/resume

# Test search
curl "http://localhost:3000/api/search?q=YOUR_QUERY"

# Get remaining themes list
curl http://localhost:3000/api/search/remaining
```

---

**Last Updated:** January 2025  
**Status:** 10,000/12,937 themes uploaded, 2,937 remaining  
**Next Action:** Run resume upload after daily limit resets (24h)