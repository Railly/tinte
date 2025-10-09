# Debug Steps

1. Restart server completely (Ctrl+C and `bun dev`)

2. Test the route:
```bash
curl http://localhost:3000/api/figma/themes/TEST123
```

3. Check terminal for console.log output:
   - Should see: `[Figma API] Fetching theme by ID: TEST123`
   - If you DON'T see this, Next.js is not recognizing the route

4. If you see the log but still get 404:
   - The route IS working
   - Problem is in DB query (no theme with that ID)

5. Try with a real theme ID from your DB or test the slug route:
```bash
curl http://localhost:3000/api/figma/themes/slug/one-hunter
```

Expected to see: `[Figma API Slug] Fetching theme by slug: one-hunter`
