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
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── chat/             # Chat workbench components
│   ├── shared/           # Shared theme components
│   ├── code-preview.tsx  # Shiki syntax highlighting
│   └── monaco-editor-preview.tsx # Monaco editor integration
├── hooks/                 # Custom React hooks
│   ├── use-theme.ts             # Unified theme management (replaces old hooks)
│   └── use-chat-state.ts        # Chat workbench state
├── lib/                   # Core conversion logic
│   ├── palette-generator.ts      # OKLCH palette generation
│   ├── tinte-to-shadcn.ts       # Tinte → shadcn conversion
│   ├── tweakcn-to-tinte.ts      # TweakCN → Tinte conversion
│   ├── theme-manager.ts         # Consolidated theme logic and token management
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

## Theme Architecture (Simplified)

### Unified Theme System

The theme system has been simplified from 9 complex files to just 3 core files:

#### Core Files

1. **`lib/theme-manager.ts`** - All theme logic consolidated:
   - Theme application with view transitions
   - Token computation and DOM manipulation
   - localStorage persistence
   - Color format conversion (OKLCH/LAB → Hex)

2. **`hooks/use-theme.ts`** - Single unified hook:
   - Theme selection and mode switching
   - Token editing with real-time updates
   - Theme collections (TweakCN, Rayso, Tinte)
   - SSR/hydration handling
   - Legacy compatibility layer

3. **`components/theme-script.tsx`** - Minimal SSR script:
   - Initial theme application before React hydration
   - Prevents flash of incorrect theme
   - Reads from localStorage and applies tokens

#### Key Features

- **Single source of truth**: All theme state in `useTheme()` hook
- **No state conflicts**: Eliminated Zustand + React Context overlap
- **Direct data flow**: localStorage → hook → components
- **Real-time sync**: Tokens update immediately when themes change
- **Color conversion**: OKLCH/LAB values automatically convert to hex
- **View transitions**: Smooth theme switching with CSS view transitions

#### Usage

```tsx
// Replace all old hooks with single unified hook
import { useTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { 
    // Theme state
    activeTheme, currentMode, isDark, mounted,
    
    // Theme collections  
    allThemes, tweakcnThemes, raysoThemes, tinteThemes,
    
    // Token editing
    currentTokens, handleTokenEdit, resetTokens,
    
    // Actions
    handleThemeSelect, handleModeChange, toggleTheme
  } = useTheme();
}
```
