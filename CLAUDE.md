# Tinte - Theme Converter & Generator

A Next.js application for converting and generating themes between different formats (Rayso, TweakCN, VS Code) with live previews and testing capabilities.

## Project Overview

Tinte is a comprehensive theme conversion system that allows users to:

- Convert between Rayso, TweakCN, and VS Code theme formats
- Generate semantic color palettes using OKLCH color space
- Preview themes with syntax highlighting (Shiki + Monaco Editor)
- Test theme conversions with live UI previews
- Export themes in various formats

## Architecture

### Core Libraries

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS + shadcn/ui** - UI components and styling
- **Culori** - OKLCH color space manipulation
- **Shiki** - Syntax highlighting engine
- **Monaco Editor** - Code editor with theme preview
- **Bun** - Package manager and runtime

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── bingo/             # TweakCN → Rayso converter page
│   ├── vscode/            # Rayso → VS Code converter page
│   ├── experiment/        # Rayso → shadcn converter page
│   └── chat/              # Main workbench with theme editor
├── providers/             # React Context providers
│   └── theme.tsx          # Single theme context provider
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── chat/             # Chat workbench components
│   ├── shared/           # Shared theme components
│   │   ├── theme-switcher.tsx     # Light/dark mode toggle
│   │   ├── theme-selector.tsx     # Theme picker dropdown
│   │   ├── theme-editor-panel.tsx # Token editor with color inputs
│   │   └── theme-card.tsx         # Theme selection cards
│   ├── code-preview.tsx  # Shiki syntax highlighting
│   └── monaco-editor-preview.tsx # Monaco editor integration
├── hooks/                 # Custom React hooks
│   ├── use-theme.ts             # Core theme management (used by provider only)
│   └── use-chat-state.ts        # Chat workbench state
├── lib/                   # Core conversion logic
│   ├── palette-generator.ts      # OKLCH palette generation
│   ├── tinte-to-shadcn.ts       # Tinte → shadcn conversion
│   ├── tweakcn-to-tinte.ts      # TweakCN → Tinte conversion
│   ├── theme-manager.ts         # DOM manipulation & localStorage persistence
│   └── tinte-to-vscode/          # Tinte → VS Code conversion
├── types/                 # Shared TypeScript definitions
│   └── tinte.ts          # Common Tinte theme types
└── utils/                 # Theme preset data
    ├── tinte-presets.ts   # Tinte theme collection
    ├── rayso-presets.ts   # Rayso theme collection
    └── tweakcn-presets.ts # TweakCN theme collection
```

## Color Philosophy

### Flexoki-Inspired Token System

The project follows a Flexoki-inspired semantic color philosophy:

**Continuous Scale**: `bg → bg-2 → ui → ui-2 → ui-3 → tx-3 → tx-2 → tx`

- **Light mode**: bg (lightest) → tx (darkest)
- **Dark mode**: bg (darkest) → tx (lightest)
- **Exponential curve**: Natural perceptual progression
- **OKLCH color space**: Maintains perceptual consistency

### Token Meanings

- `background` / `bg`: Main surface
- `background_2` / `bg-2`: Elevated surfaces (cards, modals)
- `interface` / `ui`: Normal borders, separators
- `interface_2` / `ui-2`: Hover states, stronger borders
- `interface_3` / `ui-3`: Active states, input backgrounds
- `text_3` / `tx-3`: Faint text (comments, placeholders)
- `text_2` / `tx-2`: Muted text (punctuation, operators)
- `text` / `tx`: Primary text
- `primary`: Primary actions, keywords
- `accent`, `accent_2`, `accent_3`: Distinct functional colors
- `secondary`: Alternative actions

## Conversion Systems

### 1. Rayso → shadcn (`/lib/rayso-to-shadcn.ts`)

Converts minimal Rayso themes to comprehensive shadcn token sets:

- Uses palette generator for color ramps
- Maps to shadcn design system tokens
- Generates contrast-safe foreground colors
- Supports light/dark mode inversion

### 2. TweakCN → Rayso (`/lib/tweakcn-to-rayso.ts`)

Converts full TweakCN themes to minimal Rayso format:

- Creates Flexoki-style continuous scale
- Uses robust palette generation
- Extracts distinct accent colors with hue rotations
- Preserves semantic meaning of tokens

### 3. Rayso → VS Code (`/lib/rayso-to-vscode/`)

Converts Rayso themes to VS Code theme format:

- Maps UI colors to VS Code editor elements
- Generates TextMate token colors for syntax highlighting
- Applies opacity customizations per mode
- Follows VS Code theme structure

## Development Workflow

### Running the Project

```bash
bun install
bun dev
```

### Key Pages

- `/chat` - Main theme workbench with live editing and preview
- `/experiment` - Rayso → shadcn conversion testing
- `/bingo` - TweakCN → Rayso conversion testing
- `/vscode` - Rayso → VS Code conversion and preview

### Testing Themes

1. **Color Palette Testing**: Use palette generator with different seeds
2. **Conversion Testing**: Test conversions between all formats
3. **Preview Testing**: Verify themes in Shiki and Monaco Editor
4. **Export Testing**: Download and install generated themes

### Code Style

- **No comments** unless specifically requested
- **Semantic naming** following Flexoki philosophy
- **Type safety** with comprehensive TypeScript definitions
- **Component composition** with shadcn/ui patterns

## Dependencies

### Core

- `next` - React framework
- `react` - UI library
- `typescript` - Type system
- `tailwindcss` - Utility-first CSS

### Color & Themes

- `culori` - OKLCH color manipulation
- `shiki` - Syntax highlighting
- `@monaco-editor/react` - Code editor
- `hast-util-to-jsx-runtime` - AST to JSX conversion

### UI Components

- `@radix-ui/*` - Primitive components (via shadcn/ui)
- `lucide-react` - Icon system
- `clsx` - Conditional classes

## Build & Deployment

```bash
# Development
bun dev

# Production build
bun build
bun start

# Type checking
bun run type-check

# Linting
bun run lint
```

## Testing Commands

When testing the conversion systems:

- Use the palette generator for consistent color ramps
- Test both light and dark modes for all conversions
- Verify WCAG contrast ratios in generated themes
- Preview syntax highlighting across multiple languages
- Export and manually test themes in target applications

## Key Features

- **Live theme workbench** with real-time editing and preview
- **Synchronized token editor** with automatic color format conversion (OKLCH/LAB → Hex)
- **Theme selection** with instant visual feedback and no render delays
- **Multi-format support** for TweakCN, Rayso, Tinte, and VS Code themes
- **Semantic color mapping** with perceptual consistency
- **Format-agnostic** conversion between theme systems
- **Export functionality** for generated themes
- **OKLCH color space** for better color manipulation
- **Responsive UI** with modern design patterns

## Theme Architecture (Ultra-Resilient)

### Context-Based Single Source of Truth

The theme system uses a **React Context Provider** pattern for bulletproof state synchronization across all components:

#### Core Architecture

```
src/
├── providers/theme.tsx          # Single theme context provider
├── hooks/use-theme.ts           # Core theme logic (used only by provider)
├── lib/theme-manager.ts         # DOM manipulation & localStorage persistence
└── components/shared/
    ├── theme-switcher.tsx       # Light/dark mode toggle
    ├── theme-selector.tsx       # Theme picker dropdown
    └── theme-editor-panel.tsx   # Token editor with color inputs
```

#### Core Files

1. **`providers/theme.tsx`** - Global theme state provider:
   - Single instance of `useTheme()` hook
   - Provides theme context to entire app
   - Prevents multiple hook instances and state desync

2. **`hooks/use-theme.ts`** - Core theme logic:
   - localStorage as single source of truth
   - Theme selection with mode preservation  
   - Token editing with real-time DOM updates
   - Theme collections (TweakCN, Rayso, Tinte)

3. **`lib/theme-manager.ts`** - DOM & persistence layer:
   - Theme application with view transitions
   - Token computation and CSS custom property injection
   - Silent localStorage fallbacks
   - Color format conversion (OKLCH/LAB → Hex)

#### Context Provider Pattern

**Problem Solved**: Multiple hook instances caused state desynchronization between components.

**Solution**: Single context provider wraps entire app:

```tsx
// App Layout
<ThemeProvider>
  {children}
</ThemeProvider>

// All components use shared context
import { useThemeContext } from '@/providers/theme';

function MyComponent() {
  const { 
    // Shared theme state
    activeTheme, currentMode, isDark, mounted,
    
    // Theme collections  
    allThemes, tweakcnThemes, raysoThemes, tinteThemes,
    
    // Token editing
    currentTokens, handleTokenEdit, resetTokens,
    
    // Actions (globally synchronized)
    handleThemeSelect, handleModeChange, toggleTheme
  } = useThemeContext();
}
```

#### Component Responsibilities

- **`theme-switcher.tsx`**: Light/dark mode toggle (header)
- **`theme-selector.tsx`**: Theme picker dropdown (design panel)  
- **`theme-editor-panel.tsx`**: Live token editor with color inputs
- **`theme-card.tsx`**: Theme selection from showcase (homepage)

#### Key Benefits

- **Zero state desync**: Single context eliminates race conditions
- **Predictable behavior**: All components always see same state
- **Instant synchronization**: Mode changes update all components immediately
- **Cross-page consistency**: Theme selection from homepage properly updates editor
- **Simple debugging**: One source of truth, clear data flow
- **Type-safe**: Full TypeScript support throughout

#### Storage Keys

- `tinte-selected-theme`: Currently active theme with computed tokens
- `tinte-current-mode`: Global light/dark mode preference

#### Edge Cases Handled

✅ **Theme card navigation**: Clicking theme on homepage → navigate to `/chat/id` → editor shows correct tokens  
✅ **Mode switching**: Toggle dark/light anywhere → all components sync instantly  
✅ **Token editing**: Edit color in panel → immediate visual feedback  
✅ **Page refresh**: Theme and mode restored correctly  
✅ **SSR/hydration**: No flash of incorrect theme  

#### Testing the Resilience

1. **Homepage theme selection** → Navigate to chat → Editor shows correct tokens
2. **Mode toggle in header** → Design panel tokens update instantly  
3. **Theme change in dropdown** → All components sync immediately
4. **Token edit** → Real-time DOM updates + state persistence
5. **Page refresh** → Perfect state restoration
