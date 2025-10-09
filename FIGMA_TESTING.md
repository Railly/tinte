# 🧪 Figma Plugin MVP Testing Guide

## ✅ What's Ready

- ✅ Figma plugin built (`figma-plugin/dist/`)
- ✅ API endpoints working: `/api/figma/themes/[id]` and `/api/figma/themes/slug/[slug]`
- ✅ Middleware configured to allow public access
- ✅ Deployed to production (`www.tinte.dev`)
- ✅ Smart detection: nanoid vs slug

## 🚀 Testing Steps

### Step 1: Get a Theme Slug or ID

**Option A: Use Popular Themes (Easiest)**
Just use these slugs directly:

- `one-hunter`
- `github-dark`
- `dracula`
- Or browse: https://www.tinte.dev/themes

**Option B: Use Your Own Theme**

1. Go to https://www.tinte.dev/workbench
2. Create or load a theme
3. Make it **public** (important!)
4. Copy the slug (e.g., `my-awesome-theme`) from the URL

**Option B: Use Database**
Run this locally to get a public theme ID:

```bash
# If you have access to DB
psql $DATABASE_URL -c "SELECT id, name FROM theme WHERE is_public = true LIMIT 1;"
```

**Option C: Create Test Theme via API**

```bash
# Create a simple test theme (requires auth)
curl -X POST https://www.tinte.dev/api/themes \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Step 2: Test API Endpoint

Test with a slug (easier):

```bash
# Using slug
curl https://www.tinte.dev/api/figma/themes/slug/one-hunter | jq

# Or using ID
curl https://www.tinte.dev/api/figma/themes/THEME_ID | jq
```

**Expected Response:**

```json
{
  "id": "cm5zp...",
  "name": "Theme Name",
  "description": "...",
  "tokens": {
    "light": {
      "background": { "r": 1, "g": 1, "b": 1, "a": 1 },
      "foreground": { "r": 0, "g": 0, "b": 0, "a": 1 },
      ...
    },
    "dark": { ... }
  }
}
```

### Step 3: Setup Plugin in Figma

1. **Download Figma Desktop** (required - browser won't work!)
   - Get it: https://www.figma.com/downloads/

2. **Open Figma Desktop**
   - Create a new file or open existing one

3. **Import the plugin**
   - Go to: `Plugins` → `Development` → `Import plugin from manifest...`
   - Navigate to your repo: `figma-plugin/manifest.json`
   - Full path: `/Users/raillyhugo/Programming/crafter-station-projects/tinte/figma-plugin/manifest.json`
   - Click **"Open"**

4. **Plugin is now installed!**
   - You'll see "Tinte Theme Sync" in your Development plugins

### Step 4: Sync a Theme! 🎨

1. **Run the plugin**
   - `Plugins` → `Development` → `Tinte Theme Sync`
   - Plugin UI opens (400x600 window)

2. **Enter theme slug or ID**
   - Type the slug: `one-hunter`
   - Or nanoid: `02FUijjsnz`
   - Plugin auto-detects which one you used!

3. **Click "Sync Theme"**
   - You'll see: `🔄 Syncing theme from Tinte...`
   - Wait 2-3 seconds...
   - Success: `✅ Successfully synced "One Hunter" theme!`

**What happens:**

- Plugin fetches theme from `www.tinte.dev/api/figma/...`
- Creates a Variable Collection in Figma
- Adds Light and Dark modes
- Creates 37+ color variables with values for both modes

### Step 5: Verify in Figma

1. **Open Variables Panel**
   - Right sidebar → Variables tab (icon: 4 squares)
   - Or: Menu → `View` → `Variables`

2. **Check Collection**
   - You should see a new collection with your theme name
   - Click to expand

3. **Check Modes**
   - Should have 2 modes: "Light" and "Dark"
   - Toggle between them

4. **Check Variables**
   - Should have 37+ color variables:
     - `background`, `foreground`
     - `primary`, `primary-foreground`
     - `secondary`, `accent`, `muted`
     - `border`, `input`, `ring`
     - `chart-1` through `chart-5`
     - `sidebar-*` tokens
   - Each variable should have values for both Light and Dark modes

5. **Test Variables**
   - Create a rectangle
   - Set fill to one of your synced variables (e.g., `primary`)
   - Toggle Light/Dark mode → color should change!

## 🐛 Troubleshooting

### "Theme not found" Error

- Make sure theme ID is correct
- Verify theme `is_public = true` in database
- Check theme exists: `https://www.tinte.dev/api/themes/[ID]`

### "Network request failed"

- Check Figma Desktop (not browser)
- Verify `manifest.json` allows `www.tinte.dev`
- Check internet connection
- Try API directly in browser

### Plugin Won't Load

- Rebuild: `cd figma-plugin && bun run build`
- Check `dist/code.js` and `dist/ui.html` exist
- Restart Figma Desktop
- Re-import manifest

### API Returns 404

- Wait 1-2 minutes for deployment
- Check build logs on Netlify
- Verify endpoint exists in code

### Colors Look Wrong

- Check theme has valid hex colors
- Test conversion: `culori` should parse colors
- Check browser console for errors

## 📸 Expected Result

After successful sync, you should have:

```
Variables Panel
└── [Your Theme Name]
    ├── Modes: Light, Dark
    └── Variables:
        ├── background (Light: #fff, Dark: #000)
        ├── foreground (Light: #000, Dark: #fff)
        ├── primary (Light: #..., Dark: #...)
        ├── secondary (...)
        └── ... (37 total)
```

## 🎯 Next Steps After MVP Works

- [ ] Add theme search/browse in plugin UI
- [ ] Support private themes (Clerk auth)
- [ ] Batch import multiple themes
- [ ] Update existing collections
- [ ] Export Figma variables back to Tinte
- [ ] Publish to Figma Community

## 🎓 Tips & Best Practices

### Smart Input Detection

The plugin automatically detects what you enter:

- **Slug**: `one-hunter` → uses `/api/figma/themes/slug/one-hunter`
- **Nanoid**: `02FUijjsnz` → uses `/api/figma/themes/02FUijjsnz`

Detection rules:

- Nanoid: 10+ alphanumeric chars, NO dashes
- Slug: Has dashes (e.g., `my-theme-name`)

### Variable Organization

After syncing, your Figma file will have:

```
Local variables
└── [Theme Name]
    ├── Modes: Light, Dark
    └── Variables (37+):
        ├── background
        ├── foreground
        ├── primary
        ├── secondary
        └── ... (all shadcn tokens)
```

### Using Variables

1. Select any element
2. Click fill/stroke color
3. Choose from synced variables
4. Toggle Light/Dark mode to see it update!

### Re-syncing

- Syncing same theme again **updates** existing collection
- Useful when you edit theme on Tinte and want to refresh in Figma

### Current Limitations

- ✅ Public themes only (no auth yet)
- ✅ Requires internet (fetches live from API)
- ✅ Desktop only (browser plugins can't make network requests)

---

## 📚 Resources

- **Plugin code**: `figma-plugin/src/`
- **API docs**: This file + `figma-plugin/README.md`
- **Figma Plugin API**: https://www.figma.com/plugin-docs/
- **Report issues**: Open on GitHub

---

**Made with ❤️ for the Tinte community** 🎨
