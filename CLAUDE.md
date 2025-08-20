# Tinte - Theme Converter & Generator

A Next.js application for converting themes between Rayso, TweakCN, VS Code, shadcn/ui, and 8+ other formats with live previews.

## What It Does

- Convert between theme formats (Rayso ↔ TweakCN ↔ VS Code ↔ shadcn/ui)
- Generate semantic color palettes using OKLCH color space
- Live theme editing with real-time preview
- Export themes for editors, terminals, and design tools
- Universal theme previews for all supported providers

## Tech Stack

- **Next.js 14** with TypeScript and App Router
- **Tailwind CSS + shadcn/ui** for UI components
- **Culori** for OKLCH color manipulation
- **Shiki + Monaco Editor** for syntax highlighting
- **Zustand + nuqs** for state management
- **React Context** for theme state
- **Bun** for package management

## Architecture

### Key Directories

```
src/
├── app/                  # Pages (workbench, experiment, bingo, vscode)
├── providers/theme.tsx   # Single theme context provider
├── components/
│   ├── shared/          # Theme components (switcher, selector, editor)
│   ├── preview/         # Provider-specific previews (vscode, shadcn, terminals)
│   └── workbench/       # Workbench components
├── hooks/               # Custom hooks (theme, monaco, shiki, workbench)
├── stores/              # Zustand stores (workbench, export)
├── lib/                 # Conversion logic and providers registry
└── types/               # TypeScript definitions
```

### Color Philosophy - Flexoki-Inspired

**Continuous Scale**: `bg → bg-2 → ui → ui-2 → ui-3 → tx-3 → tx-2 → tx`

- Light mode: bg (lightest) → tx (darkest)
- Dark mode: bg (darkest) → tx (lightest)
- OKLCH color space for perceptual consistency

**Token Meanings**:
- `bg`/`bg-2`: Main/elevated surfaces
- `ui`/`ui-2`/`ui-3`: Borders, hover states, active states
- `tx-3`/`tx-2`/`tx`: Faint, muted, primary text
- `primary`/`accent`/`secondary`: Functional colors

## State Management

### Theme System (Context Provider)
- Single `ThemeProvider` wraps entire app
- localStorage persistence with DOM updates
- Zero state desync between components
- Perfect SSR/hydration handling

### Workbench (Zustand + nuqs)
- **Zustand stores**: Server state (chatId, split, loading)
- **nuqs**: URL state (activeTab, provider) with automatic sync
- Zero prop drilling, zero useState/useEffect patterns
- Perfect browser navigation support

## Providers System

### Type-Safe Registry
- **ThemeProvider**: Basic conversion & export
- **PreviewableProvider**: Adds live preview component
- Registry-based with compile-time validation

### Supported Providers
**Editors**: shadcn/ui, VS Code  
**Terminals**: Alacritty, Kitty, Warp, Windows Terminal  
**Design Tools**: GIMP, Slack  

All providers have rich visual previews using actual theme data.

## Development

### Commands
```bash
bun install      # Install dependencies
bun dev          # Start development server
bun build        # Production build
bun run lint     # Lint code
bun run type-check # TypeScript validation
```

### Key Pages
- `/workbench` - Main theme editor with live preview
- `/experiment` - Rayso → shadcn conversion testing
- `/bingo` - TweakCN → Rayso conversion testing
- `/vscode` - VS Code theme preview and export

## Architecture Highlights

### VS Code Preview (Optimized)
- Modular components: monaco-preview, shiki-preview, tokens-preview
- Custom hooks: use-monaco-editor, use-shiki-highlighter
- Version-based caching, 50ms transitions, zero theme conflicts

### Monaco + Shiki Integration
- Perfect consistency using `@shikijs/monaco`
- Identical theme structure between both systems
- Smart initialization, no disposal conflicts

### Provider Previews
- All previews use real converted theme data
- Dynamic light/dark mode switching
- Type-safe integration with provider outputs
- Performance optimized with memoization

## Code Style

- No comments unless requested
- Semantic naming following Flexoki philosophy
- Type safety throughout
- Modular architecture with single responsibility
- Custom hooks for complex logic
- Minimal useEffect usage

## Testing

### Theme Conversion
- Test all format conversions (Rayso ↔ TweakCN ↔ VS Code ↔ shadcn)
- Verify WCAG contrast ratios
- Test light/dark mode switching
- Export and install themes in target applications

### State Management
- URL synchronization with browser navigation
- Theme persistence across page refreshes
- Component isolation with global state access
- No infinite loops or circular dependencies

## Key Features

- **Live workbench**: Real-time editing with instant preview
- **Universal previews**: Rich visuals for all supported providers
- **Type-safe conversions**: Compile-time validation throughout
- **Performance optimized**: Smart caching, minimal re-renders
- **URL state sync**: Shareable URLs with preserved state
- **Provider status**: Clear indicators for available vs planned providers
- **Export functionality**: Download themes in multiple formats
- **Responsive design**: Works on mobile and desktop

