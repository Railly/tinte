# 🎨 Tinte CLI

> Beautiful editor themes with the best DX - install themes instantly to VS Code and Cursor

## ✨ Features

- **Multi-Editor Support** - Install to VS Code and Cursor with simple flags
- **Instant Installation** - Download and install editor themes in one command
- **Multiple Sources** - Install from theme IDs, URLs, or local JSON files
- **Auto Editor Management** - Automatically closes editor after installation for instant apply
- **Light/Dark Variants** - Choose your preferred theme variant
- **Clean Temporary Files** - Smart cleanup of downloaded theme files
- **Cross-Platform** - Works on macOS, Windows, and Linux

## 🚀 Quick Start

```bash
# Install globally
npm install -g @tinte/cli

# Or use with npx/bunx (no installation needed)
bunx @tinte/cli flexoki-theme
```

## 📖 Usage

### Install Theme by ID
```bash
# Install to VS Code (default)
tinte flexoki-theme
tinte catppuccin-mocha
tinte nord-theme

# Install to Cursor
tinte flexoki-theme --cursor
tinte catppuccin-mocha --cursor
```

### Install from URL
```bash
# Direct theme URL to VS Code
tinte https://tinte.dev/api/themes/abc123

# Theme share URL to Cursor
tinte https://tinte.dev/r/my-awesome-theme --cursor
```

### Install from Local File
```bash
# Local JSON theme file to VS Code
tinte ./my-custom-theme.json

# Local theme to Cursor
tinte ../themes/work-theme.json --cursor
```

### Options

```bash
# Install light variant
tinte flexoki-theme --light

# Install dark variant (default)
tinte flexoki-theme --dark

# Install to Cursor
tinte flexoki-theme --cursor

# Don't auto-close editor
tinte flexoki-theme --no-close

# Custom auto-close timeout
tinte flexoki-theme --timeout=5000

# Combine options
tinte flexoki-theme --cursor --light --no-close
```

### List Installed Themes
```bash
# List themes in VS Code
tinte list

# List themes in Cursor
tinte list --cursor
```

### Cleanup Temporary Files
```bash
tinte cleanup
```

## 🔧 Advanced Usage

### Programmatic API

```typescript
import { TinteCLI } from '@tinte/cli';

const cli = new TinteCLI();

// Install theme from theme data
await cli.installTheme(
  {
    light: { bg: '#ffffff', tx: '#000000', /* ... */ },
    dark: { bg: '#000000', tx: '#ffffff', /* ... */ }
  },
  'My Custom Theme',
  { variant: 'dark', autoClose: true }
);

// Install from URL
await cli.installFromUrl('https://tinte.dev/api/themes/abc123');

// Install from file
await cli.installFromFile('./theme.json', 'My Theme');

// Quick install (auto-detect source)
await cli.quick('flexoki-theme');
```

### Theme File Format

```json
{
  "name": "My Custom Theme",
  "displayName": "My Custom Theme",
  "rawTheme": {
    "light": {
      "bg": "#ffffff",
      "tx": "#000000",
      "pr": "#0066cc",
      "sc": "#6366f1",
      "ac_1": "#06b6d4",
      "ac_2": "#84cc16",
      "ac_3": "#f59e0b",
      "ui": "#e5e7eb",
      "ui_2": "#d1d5db",
      "ui_3": "#9ca3af",
      "bg_2": "#f9fafb",
      "tx_2": "#6b7280",
      "tx_3": "#9ca3af"
    },
    "dark": {
      "bg": "#000000",
      "tx": "#ffffff",
      "pr": "#3b82f6",
      "sc": "#8b5cf6",
      "ac_1": "#06b6d4",
      "ac_2": "#84cc16",
      "ac_3": "#f59e0b",
      "ui": "#374151",
      "ui_2": "#4b5563",
      "ui_3": "#6b7280",
      "bg_2": "#111827",
      "tx_2": "#9ca3af",
      "tx_3": "#6b7280"
    }
  }
}
```

## 🎯 Best DX Workflow

1. **Create/Edit Theme** - Use [Tinte Workbench](https://tinte.dev/workbench) to design your theme
2. **Export Theme** - Get your theme ID or download JSON
3. **Install Instantly** - `bunx @tinte/cli your-theme-id`
4. **VS Code Auto-Closes** - Theme is ready when you reopen!
5. **Iterate Fast** - Repeat the process for quick theme iterations

## 🛠️ Requirements

- **Node.js** 16+
- **VS Code** installed with `code` command available in PATH
- **Internet connection** for fetching themes from Tinte

## 🤝 Integration with Tinte Ecosystem

This CLI integrates seamlessly with:

- **[Tinte Workbench](https://tinte.dev/workbench)** - Visual theme editor
- **[Tinte API](https://tinte.dev/api)** - Theme data and conversion
- **[Tinte Themes](https://tinte.dev/themes)** - Community theme gallery
- **VS Code Extension Generation** - Automatic VSIX creation with your branding

## 📋 Examples

### Development Workflow
```bash
# Edit theme in Tinte Workbench → Get theme ID → Install
bunx @tinte/cli abc123-your-theme-id

# Test local theme file
bunx @tinte/cli ./dist/my-theme.json --light --no-close

# Quick theme switching
bunx @tinte/cli flexoki-theme
bunx @tinte/cli catppuccin-mocha
bunx @tinte/cli nord-theme
```

### Team Sharing
```bash
# Share theme URL with team
bunx @tinte/cli https://tinte.dev/r/team-brand-theme

# Install from company theme repository
bunx @tinte/cli https://themes.company.com/api/themes/brand-dark
```

## 🚀 Coming Soon

- **Theme Sync** - Sync themes across devices
- **Auto-Update** - Keep themes updated automatically
- **Theme Sets** - Install multiple related themes
- **Preview Mode** - Preview themes before installing
- **Git Integration** - Version control for themes

## 📝 License

MIT © [Tinte](https://tinte.dev)

---

**Made with ❤️ by the Tinte team**

[Website](https://tinte.dev) • [GitHub](https://github.com/Railly/tinte) • [Twitter](https://twitter.com/raillyhugo)