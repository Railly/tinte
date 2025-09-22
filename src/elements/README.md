# Floating shadcn Theme Editor

A self-contained, floating ball theme editor that reads real values from `globals.css` and preserves original color formats. Click the Tinte logo to expand into a full editor modal.

## ✨ Key Features

- 🎯 **Reads Real Values**: Directly reads from your actual `globals.css` file
- 🎨 **Format Preservation**: Maintains original color formats (oklch→oklch, hex→hex)
- ⚡ **Live Updates**: Changes apply instantly to the entire app
- 🔄 **Culori Integration**: Uses culori for accurate color conversions
- 📱 **Floating UI**: Minimalist ball that expands to full editor
- 🌓 **Light/Dark Toggle**: Edit both theme modes
- 💾 **File Writing**: Saves changes back to globals.css
- 🔧 **Auto-Detection**: Reads CSS path from `components.json`
- 📊 **Token Grouping**: Organized by semantic categories
- 🔄 **Reload Button**: Refresh from file if needed

## 🚀 Usage

### Basic Implementation

```tsx
import { FloatingThemeEditor } from "@/elements/floating-theme-editor";

export default function MyApp() {
  return (
    <div>
      {/* Your app content */}
      <main>...</main>
      
      {/* Floating theme editor - always visible */}
      <FloatingThemeEditor 
        onChange={(theme) => {
          console.log('Theme updated:', theme);
        }}
      />
    </div>
  );
}

export default function MyApp() {
  return (
    <div>
      {/* Your app content */}
      <main>...</main>
      
      {/* Floating theme editor - always visible */}
      <FloatingThemeEditor 
        onChange={(theme) => {
          console.log('Theme updated:', theme);
        }}
      />
    </div>
  );
}
```

### Add to layout.tsx (global access)

```tsx
import { FloatingThemeEditor } from "@/elements/floating-theme-editor";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* Global floating theme editor */}
        <FloatingThemeEditor />
      </body>
    </html>
  );
}
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(theme: ShadcnTheme) => void` | `undefined` | Callback when theme changes |
| `className` | `string` | `""` | Additional CSS classes |

### Theme Structure

```typescript
interface ShadcnTheme {
  light: Record<ShadcnColorToken, string>;
  dark: Record<ShadcnColorToken, string>;
}
```

## Token Groups

The widget organizes tokens into 6 semantic groups:

1. **Background & Text** - `background`, `foreground`, `muted`, `muted-foreground`
2. **Cards & Surfaces** - `card`, `card-foreground`, `popover`, `popover-foreground` 
3. **Interactive Elements** - `primary`, `secondary`, `accent` + foregrounds
4. **Forms & States** - `border`, `input`, `ring`, `destructive`
5. **Charts** - `chart-1` through `chart-5`
6. **Sidebar** - All sidebar-related tokens

## File Writing

The widget automatically:
- Reads your `components.json` to find the CSS file path
- Updates only the `:root` and `.dark` sections
- Preserves all other CSS content
- Provides success/error feedback

## Technical Details

### Dependencies
- React 18+ with hooks
- Next.js (for the API route)
- Lucide React (for icons)
- CSS custom properties support

### Browser Support
- All modern browsers that support CSS custom properties
- Works with SSR/SSG

### File Structure
```
src/elements/
├── shadcn-token-editor.tsx  # Main widget component
└── README.md               # This documentation

src/app/api/
└── write-globals/
    └── route.ts            # API route for file writing
```

## Test Page

Visit `/token-editor-test` to see the widget in action with a live preview of all token categories.

## Distribution

To distribute this widget:

1. Copy `/src/elements/shadcn-token-editor.tsx` 
2. Copy `/src/app/api/write-globals/route.ts`
3. Ensure your project has `components.json` configured
4. Import and use anywhere in your app

The widget is completely self-contained and has no external dependencies beyond React and Next.js.