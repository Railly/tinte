# Tinte Figma Plugin

Sync Tinte themes to Figma variables with light/dark mode support.

## Features

- ✅ Fetch themes from Tinte API
- ✅ Create Figma variable collections
- ✅ Light/Dark mode support
- ✅ 37 shadcn/ui color tokens
- ✅ Update existing collections

## Development

### Prerequisites

- [Figma Desktop App](https://www.figma.com/downloads/)
- Bun or npm installed
- Access to a Tinte theme ID

### Setup

1. Install dependencies:
```bash
bun install
# or from root: bun run figma:install
```

2. Build the plugin:
```bash
bun run build
# or from root: bun run figma:build
```

3. Watch mode (auto-rebuild on changes):
```bash
bun run watch
# or from root: bun run figma:watch
```

## Testing in Figma Desktop

### Step 1: Load Plugin in Figma

1. Open **Figma Desktop App** (not browser!)
2. Open any file or create a new one
3. Go to `Plugins` → `Development` → `Import plugin from manifest...`
4. Navigate to `/figma-plugin/manifest.json` and select it
5. The plugin will now appear in `Plugins` → `Development` → `Tinte Theme Sync`

### Step 2: Get a Theme ID

1. Go to [tinte.railly.dev/themes](https://tinte.railly.dev/themes)
2. Find a public theme you like
3. Copy the theme ID from the URL or theme card
   - Example ID: `cm5zp123abc456def789`

### Step 3: Sync Theme

1. In Figma, run the plugin: `Plugins` → `Development` → `Tinte Theme Sync`
2. Paste the theme ID into the input field
3. Click **"Sync Theme"**
4. Wait for confirmation: `✅ Successfully synced "[Theme Name]" theme!`

### Step 4: Verify Variables

1. Open the **Variables panel** in Figma (right sidebar)
2. You should see a new collection with the theme name
3. Click on it to see:
   - **Modes**: Light and Dark
   - **Variables**: All 37 shadcn tokens (background, foreground, primary, etc.)
4. Toggle between Light/Dark modes to see color changes

### Step 5: Use Variables

1. Select any shape or text layer
2. Click on the fill color
3. Choose a variable from the synced collection
4. Switch between Light/Dark modes to see it update automatically

## Troubleshooting

### Plugin won't load
- Make sure you're using **Figma Desktop**, not the browser
- Check that `dist/code.js` and `dist/ui.html` exist (run `bun run build`)
- Try reloading: `Plugins` → `Development` → `Reload`

### "Failed to fetch theme" error
- Verify the theme ID is correct
- Check that the theme is **public** on Tinte
- Ensure your internet connection is working
- Try the API endpoint directly: `https://tinte.railly.dev/api/figma/themes/[THEME_ID]`

### "Network request blocked"
- Check `manifest.json` has correct `networkAccess.allowedDomains`
- Restart Figma Desktop after changing manifest

### Colors look wrong
- Verify the theme has valid hex colors in the database
- Check the browser console for conversion errors

## API Endpoint

The plugin uses: `GET /api/figma/themes/[id]`

**Response format**:
```json
{
  "id": "cm5zp123abc",
  "name": "Theme Name",
  "description": "Theme description",
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

## Development Tips

### Hot Reload

When developing, keep watch mode running:
```bash
bun run watch
```

After making changes:
1. Save your files
2. In Figma: `Plugins` → `Development` → `Tinte Theme Sync` → Right-click → `Reload`

### Testing Locally

To test against local API:

1. Update `manifest.json` to allow `localhost:3000`
2. Update `API_BASE_URL` in `src/code.ts` to `http://localhost:3000`
3. Rebuild: `bun run build`
4. Reload plugin in Figma

### Debugging

Check the Figma console:
1. `Plugins` → `Development` → `Open Console`
2. View logs from `console.log()` in `code.ts`

UI debugging:
1. Right-click on plugin UI → `Inspect`
2. Opens DevTools for the plugin's iframe

## Project Structure

```
figma-plugin/
├── manifest.json       # Plugin configuration
├── src/
│   ├── code.ts        # Main plugin logic (runs in Figma)
│   └── ui.html        # Plugin UI (iframe)
├── dist/              # Build output
│   ├── code.js
│   └── ui.html
├── package.json
├── tsconfig.json
└── README.md
```

## Token Mapping

The plugin creates these variables from shadcn tokens:

**Core Colors**:
- background, foreground
- card, card-foreground
- popover, popover-foreground
- primary, primary-foreground
- secondary, secondary-foreground
- muted, muted-foreground
- accent, accent-foreground
- destructive, destructive-foreground
- border, input, ring

**Chart Colors**:
- chart-1, chart-2, chart-3, chart-4, chart-5

**Sidebar Colors**:
- sidebar, sidebar-foreground
- sidebar-primary, sidebar-primary-foreground
- sidebar-accent, sidebar-accent-foreground
- sidebar-border, sidebar-ring

**Typography** (inherited from shadcn conversion):
- font-sans, font-serif, font-mono

**Shadows** (if available):
- shadow-2xs through shadow-2xl

## Publishing

To publish to Figma Community:

1. Update `manifest.json` with unique ID from Figma
2. Add plugin icon and screenshots
3. Follow [Figma's publishing guide](https://help.figma.com/hc/en-us/articles/360042786533)

## Contributing

Found a bug? Have a feature request? Open an issue on the main Tinte repo.

## License

Same as parent project (Tinte).
