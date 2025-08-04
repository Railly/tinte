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
│   │   ├── theme-card.tsx         # Theme selection cards
│   │   └── provider-switcher.tsx  # Provider selector with status indicators
│   ├── preview/          # Theme preview components for all providers
│   │   ├── vscode/       # VS Code theme preview components
│   │   │   ├── vscode-preview.tsx    # Main VS Code preview container
│   │   │   ├── monaco-preview.tsx    # Monaco editor component
│   │   │   ├── shiki-preview.tsx     # Shiki highlighting component
│   │   │   └── tokens-preview.tsx    # Theme tokens display
│   │   ├── shadcn/       # shadcn/ui theme preview components
│   │   │   ├── shadcn-preview.tsx    # Main shadcn preview container
│   │   │   └── demos/               # Interactive demo components
│   │   ├── alacritty/    # Alacritty terminal preview
│   │   │   └── alacritty-preview.tsx
│   │   ├── kitty/        # Kitty terminal preview
│   │   │   └── kitty-preview.tsx
│   │   ├── warp/         # Warp terminal preview
│   │   │   └── warp-preview.tsx
│   │   ├── windows-terminal/ # Windows Terminal preview
│   │   │   └── windows-terminal-preview.tsx
│   │   ├── gimp/         # GIMP palette preview
│   │   │   └── gimp-preview.tsx
│   │   └── slack/        # Slack theme preview
│   │       └── slack-preview.tsx
│   ├── unified-preview.tsx # Central preview component that routes to provider previews
│   ├── code-preview.tsx  # Shiki syntax highlighting
│   └── monaco-editor-preview.tsx # Monaco editor integration
├── hooks/                 # Custom React hooks
│   ├── use-theme.ts             # Core theme management (used by provider only)
│   ├── use-chat-state.ts        # Chat workbench state
│   ├── use-monaco-editor.ts     # Monaco editor logic & theme management
│   └── use-shiki-highlighter.ts # Shiki highlighting with debounced updates
├── lib/                   # Core conversion logic
│   ├── palette-generator.ts      # OKLCH palette generation
│   ├── tinte-to-shadcn.ts       # Tinte → shadcn conversion
│   ├── tweakcn-to-tinte.ts      # TweakCN → Tinte conversion
│   ├── theme-manager.ts         # DOM manipulation & localStorage persistence
│   ├── vscode-preview-utils.ts  # VS Code preview utilities & code templates
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
- **Modular architecture** with separated concerns and single responsibility
- **Custom hooks** for complex logic extraction and reusability
- **Predictable state management** with minimal useEffect usage

## Dependencies

### Core

- `next` - React framework
- `react` - UI library
- `typescript` - Type system
- `tailwindcss` - Utility-first CSS

### Color & Themes

- `culori` - OKLCH color manipulation
- `shiki` - Syntax highlighting with `@shikijs/monaco` integration
- `@monaco-editor/react` - Code editor
- `@shikijs/monaco` - Shiki + Monaco integration for consistent syntax highlighting
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
- **Multi-format support** for TweakCN, Rayso, Tinte, VS Code, and 8+ other providers (terminals, design tools, etc.)
- **Semantic color mapping** with perceptual consistency
- **Format-agnostic** conversion between theme systems
- **Export functionality** for generated themes
- **OKLCH color space** for better color manipulation
- **Responsive UI** with modern design patterns
- **Modular VS Code preview** with separated Monaco, Shiki, and Tokens components
- **Performance-optimized hooks** with reduced useEffect usage and predictable state
- **View transition loading states** preserved during theme switching (non-negotiable UX)
- **Universal theme previews** with rich visual representations for all supported providers

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
<ThemeProvider>{children}</ThemeProvider>;

// All components use shared context
import { useThemeContext } from "@/providers/theme";

function MyComponent() {
  const {
    // Shared theme state
    activeTheme,
    currentMode,
    isDark,
    mounted,

    // Theme collections
    allThemes,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,

    // Token editing
    currentTokens,
    handleTokenEdit,
    resetTokens,

    // Actions (globally synchronized)
    handleThemeSelect,
    handleModeChange,
    toggleTheme,
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

## VS Code Preview Architecture (Recently Refactored)

### Modular Component Structure

The VS Code preview system has been refactored into a clean, modular architecture:

#### Component Hierarchy

```
/components/preview/vscode/
├── preview.tsx           # Main container with UI coordination
├── monaco-preview.tsx    # Monaco editor with hooks integration
├── shiki-preview.tsx     # Shiki highlighting with hooks integration
└── tokens-preview.tsx    # Theme tokens display and inspection
```

#### Custom Hooks

```
/hooks/
├── use-monaco-editor.ts     # Complete Monaco editor logic
└── use-shiki-highlighter.ts # Shiki highlighting with performance optimization
```

#### Utilities

```
/lib/
└── vscode-preview-utils.ts  # Code templates & theme conversion utilities
```

### Key Improvements

**🎯 Reduced Complexity**:

- Main component: 7 useEffect → 2 useEffect
- Monaco logic: Consolidated into single hook
- Shiki logic: Separated with optimized debouncing

**🚀 Performance**:

- Eliminated race conditions between multiple useEffect
- Single initialization pattern per hook
- Debounced highlighting for better UX during transitions

**🧩 Modularity**:

- Each component has single responsibility
- Hooks are reusable across different contexts
- Clear separation between UI and business logic

**⚡ Developer Experience**:

- Lower cognitive load per file
- Easier testing and debugging
- Predictable state flow without complex dependencies

**💯 Preserved UX**:

- View transition loading states maintained (150ms optimized)
- Word wrap and layout fixes preserved
- All original functionality intact

This architecture serves as a model for other complex preview components in the codebase.

## Monaco Editor + Shiki Integration (Optimized)

### Unified Syntax Highlighting System

The project achieves perfect consistency between Shiki and Monaco Editor through `@shikijs/monaco`:

#### Key Integration Features

**🎯 Consistent Theme Mapping**:

- Uses identical theme structure between `use-shiki-highlighter.ts` and `use-monaco-editor.ts`
- Same theme names: `"tinte-light"` and `"tinte-dark"`
- Identical color fallbacks and token mappings

**⚡ Optimized Performance**:

- Version-based caching system prevents unnecessary re-initialization
- Smart theme detection using `currentThemeVersionRef`
- 50ms delays for smooth transitions
- No disposal conflicts between highlighter instances

**🔄 Bulletproof Theme Switching**:

- Theme selector changes: Detects version change → Re-initializes Shiki → Applies new theme
- Mode changes: Uses existing highlighter → Instant theme switch
- Built-in fallback protection for missing themes

#### Technical Implementation

```typescript
// Version-based caching strategy
const initializeMonaco = useCallback(
  async (monaco: any) => {
    if (
      highlighterRef.current &&
      currentThemeVersionRef.current === themeVersion
    ) {
      return; // Skip if already up to date
    }

    // Create themes with consistent structure
    const lightTheme = createThemeData("light");
    const darkTheme = createThemeData("dark");

    const highlighter = await createHighlighter({
      themes: [lightTheme, darkTheme],
      langs: ["python", "go", "javascript"],
    });

    shikiToMonaco(highlighter, monaco);

    // Update version tracking
    currentThemeVersionRef.current = themeVersion;
  },
  [themeVersion]
);
```

#### Performance Optimizations

**🚀 Speed Improvements**:

- Reduced view transition time: 300ms → 150ms
- Reduced theme application delay: 100ms → 50ms
- Eliminated built-in theme fallbacks (no more `vs`/`vs-dark` conflicts)
- Smart initialization prevents redundant Shiki creation

**⚡ UX Enhancements**:

- No more blank/black screens during theme changes
- Instant feedback for theme switching
- Consistent visual appearance between Shiki and Monaco previews
- Smooth transitions without rendering delays

#### Architecture Benefits

- **Zero Theme Conflicts**: Custom themes only, no built-in theme dependencies
- **Perfect Consistency**: Shiki and Monaco use identical theme data structure
- **Predictable Performance**: Version-based caching eliminates race conditions
- **Developer-Friendly**: Single source of truth for theme structure across both systems

This integration serves as the gold standard for combining Shiki syntax highlighting with Monaco Editor in modern web applications.

## Workbench State Management (Zustand + nuqs Architecture)

### Single Source of Truth with Zustand Stores

The workbench system uses **Zustand** for state management with **nuqs** integration for URL state synchronization, eliminating prop drilling and providing scalable state architecture:

#### Store Architecture

```
src/
├── stores/
│   ├── workbench-store.ts     # Main workbench state management
│   └── export-store.ts        # Theme export functionality state
├── hooks/
│   ├── use-workbench.ts       # Unified workbench interface
│   └── use-workbench-url-sync.ts # URL ↔ store synchronization
└── components/workbench/
    ├── workbench.tsx          # Re-export for compatibility
    ├── workbench-main.tsx     # Main workbench logic
    ├── workbench-mobile.tsx   # Mobile responsive version
    ├── workbench-sidebar.tsx  # Sidebar component
    └── workbench-preview-pane.tsx # Preview pane
```

#### Core Store Files

1. **`stores/workbench-store.ts`** - Main workbench state:

   - Chat ID and static mode management
   - Tab state (`chat`, `design`, `mapping`)
   - Split view and loading states
   - Drawer state for mobile
   - Provider selection state
   - Zustand devtools and subscribeWithSelector middleware

2. **`stores/export-store.ts`** - Export functionality:

   - Export progress tracking
   - Format selection (`all`, `tinte`, `vscode`, `shadcn`)
   - Export status management
   - Separate store for clean separation of concerns

3. **`hooks/use-workbench-url-sync.ts`** - URL synchronization:

   - nuqs integration for tab and provider state
   - Bidirectional sync between URL params and store
   - Theme adapter integration
   - Perfect browser navigation support

4. **`hooks/use-workbench.ts`** - Unified interface:
   - Combines workbench, export, and URL sync state
   - Theme context integration
   - Computed values for UI state
   - Single hook for all workbench needs

#### Key Features

**🎯 Zero Prop Drilling**:

```tsx
// Before: 12+ props passed through components
<WorkbenchSidebar
  activeTab={activeTab}
  onTabChange={setActiveTab}
  split={split}
  chatLoading={loading}
  // ... 8+ more props
/>;

// After: Components access state directly
export function WorkbenchSidebar() {
  const { activeTab, split, loading } = useWorkbench();
  // Zero props needed!
}
```

**⚡ URL State Synchronization**:

- Tab changes update URL: `/workbench/abc123?tab=design`
- Provider changes: `/workbench/abc123?tab=design&provider=vscode`
- Perfect browser back/forward navigation
- Shareable URLs with preserved state

**🚀 Performance Optimized**:

```tsx
// Selective subscriptions for performance
const split = useWorkbenchStore((state) => state.split);
const { activeTab, loading } = useWorkbench((state) => ({
  activeTab: state.activeTab,
  loading: state.loading,
}));
```

**🧩 Clean Architecture**:

- Single responsibility stores
- Type-safe throughout with TypeScript
- Devtools integration for debugging
- Middleware for enhanced functionality

#### State Structure

```typescript
// Zustand Store (server state only)
interface WorkbenchState {
  chatId: string;
  isStatic: boolean;
  split: boolean;
  loading: boolean;
  seed: SeedPayload | null;
  drawerOpen: boolean;
}

// URL State (via nuqs - client state)
type WorkbenchTab = "chat" | "design" | "mapping";
// activeTab and currentProvider managed by nuqs directly

interface ExportState {
  isExporting: boolean;
  exportFormat: "all" | "tinte" | "vscode" | "shadcn" | null;
  exportProgress: number;
}
```

#### Usage Patterns

**Component Integration**:

```tsx
export function WorkbenchMain({ chatId, isStatic }: Props) {
  const {
    activeTab, // From nuqs URL state
    split, // From Zustand store
    loading, // From Zustand store
    initializeWorkbench,
    tinteTheme, // From theme context
    handleExportAll, // From theme context
    setActiveTab, // nuqs setter (updates URL)
  } = useWorkbench(isStatic ? "design" : "chat");

  useEffect(() => {
    const cleanup = initializeWorkbench(chatId, isStatic);
    return cleanup;
  }, [chatId, isStatic, initializeWorkbench]);

  // No prop drilling - all state from unified hook
}
```

**Pure nuqs URL State (No useEffect needed)**:

```tsx
// URL state management with zero useEffect/useState
export function useWorkbenchUrlSync(defaultTab: WorkbenchTab = "chat") {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: defaultTab,
    parse: (value): WorkbenchTab => {
      if (value === "design" || value === "mapping") return value;
      return "chat";
    },
  });

  const [currentProvider, setCurrentProvider] = useQueryState("provider", {
    defaultValue: "shadcn",
  });

  // No useEffect - nuqs handles URL sync automatically
  return { activeTab, currentProvider, setActiveTab, setCurrentProvider };
}
```

#### Benefits Over Previous Architecture

**Before (useState + useEffect + prop drilling)**:

- 12+ props passed through component tree
- Multiple useState hooks scattered across components
- Complex useEffect chains causing infinite loops
- State synchronization issues between components
- Circular dependencies between URL and store state
- Difficult to add new features without refactoring

**After (Zustand + nuqs - Zero useEffect)**:

- **Zero prop drilling** - Components access state directly
- **Zero useState/useEffect** for URL state - nuqs handles everything
- **Single source of truth** - Clear separation between server/client state
- **URL state automatically synchronized** - Browser navigation works perfectly
- **No infinite loops** - Eliminated circular useEffect dependencies
- **Better performance** - Selective subscriptions + no unnecessary re-renders
- **Easy to extend** - Add new features with simple store actions
- **Full TypeScript support** with devtools integration

#### Architecture Principles

**🎯 State Separation**:

- **Server State**: Zustand store (`chatId`, `split`, `loading`, `seed`, `drawerOpen`)
- **Client State**: nuqs URL params (`activeTab`, `currentProvider`)
- **Theme State**: React Context (`tinteTheme`, theme actions)

**⚡ Zero useState/useEffect Pattern**:

```tsx
// ❌ Before: Complex useState + useEffect chains
const [activeTab, setActiveTab] = useState("chat");
const [urlTab, setUrlTab] = useQueryState("tab");

useEffect(() => {
  if (urlTab !== activeTab) setActiveTab(urlTab);
}, [urlTab, activeTab]);

useEffect(() => {
  if (activeTab !== urlTab) setUrlTab(activeTab);
}, [activeTab, urlTab]); // 🔥 Infinite loop!

// ✅ After: Pure nuqs handles everything
const [activeTab, setActiveTab] = useQueryState("tab", {
  defaultValue: "chat",
});
// No useEffect needed - nuqs handles URL sync automatically
```

#### Testing State Management

1. **URL Synchronization**: Change tabs → URL updates, browser back/forward works perfectly
2. **State Persistence**: Refresh page → state restored from URL params automatically
3. **Component Isolation**: Components work independently with store access
4. **Performance**: No unnecessary re-renders with selective subscriptions
5. **Export Flow**: Export progress tracked across components via separate store
6. **Mobile Drawer**: Drawer state managed globally, accessible anywhere
7. **No Infinite Loops**: Zero circular useEffect dependencies, stable performance

#### Key Lessons Learned

**🚀 Performance Anti-Patterns Avoided**:

- ❌ Multiple useState hooks for the same logical state
- ❌ useEffect chains that update each other in circles
- ❌ Prop drilling through 4+ component levels
- ❌ Re-creating setter functions on every render
- ❌ Complex state synchronization logic scattered across components

**✅ Modern React Patterns Applied**:

- **nuqs for URL state** - Built-in synchronization, no useEffect needed
- **Zustand for global state** - Minimal boilerplate, excellent DevTools
- **Selective subscriptions** - Components only re-render when needed
- **Stable actions** - Actions don't change reference, preventing unnecessary effects
- **Single responsibility** - Each hook/store has one clear purpose

This architecture provides a **scalable, maintainable, and simple** state management solution that follows modern React best practices while avoiding common performance pitfalls. The elimination of useState/useEffect for URL state management is a key architectural decision that prevents infinite loops and improves both performance and developer experience.

## Simplified SOLID Architecture (Workbench Components)

### Pragmatic SOLID Application

The workbench components follow **simplified SOLID principles** that maintain extensibility and clean architecture without over-engineering:

#### Component Structure

```
src/components/workbench/
├── workbench.tsx              # Re-export for compatibility
├── workbench-main.tsx         # Main component with 3 clear layout strategies
├── workbench-sidebar.tsx      # Configuration-driven sidebar
├── workbench-mobile.tsx       # Mobile-specific layout
├── workbench-preview-pane.tsx # Preview rendering
├── workbench-header.tsx       # Header component
├── chat-content.tsx           # Chat tab content
├── attachment-bubble.tsx      # Chat attachments
└── workbench.config.ts        # Single configuration file
```

#### Core Principles Applied

**🎯 Single Responsibility Principle**:

- **WorkbenchMain**: Clear separation of 3 layout strategies (mobile/static/dynamic)
- **WorkbenchSidebar**: Configuration-driven with extracted theme navigation
- **Each component**: Single, clear purpose

**🔧 Open/Closed Principle**:

- **Extensible via configuration**: Add new tabs in `workbench.config.ts`
- **Layout strategies**: Easy to add new device layouts
- **No modification**: Extend functionality without changing existing code

#### Configuration-Driven Architecture

**Simple Tab Extension**:

```typescript
// workbench.config.ts - Single file for all configuration
export const WORKBENCH_TABS = [
  {
    id: "chat",
    label: "Chat",
    component: ChatContent,
    requiresLoading: true,
  },
  {
    id: "design",
    label: "Design",
    component: ThemeEditorPanel,
    requiresLoading: false,
  },
  // Easy to add new tabs:
  // { id: 'mapping', label: 'Mapping', component: MappingPanel, requiresLoading: false }
];
```

**Layout Strategy Pattern (Simplified)**:

```tsx
// WorkbenchMain - Clear 3-strategy approach
export function WorkbenchMain({ chatId, isStatic }) {
  // Mobile layout
  if (isMobile) {
    return <WorkbenchMobile {...props} />;
  }

  // Static layout (design mode)
  if (isStatic) {
    return <StaticLayout {...props} />;
  }

  // Dynamic layout (default)
  return <DynamicLayout {...props} />;
}
```

#### Key Benefits Achieved

**✅ Extensibility Without Complexity**:

- **New tabs**: Just add to config array
- **New layouts**: Add new if condition in WorkbenchMain
- **Zero prop drilling**: Maintained Zustand + nuqs architecture

**✅ Maintainability**:

- **Single config file**: All workbench configuration in one place
- **Clear separation**: Each layout strategy is obvious
- **No file explosion**: Pragmatic approach with essential files only

**✅ Developer Experience**:

- **Easy to understand**: Clear, commented layout strategies
- **Simple to extend**: Configuration-driven approach
- **Fast development**: No complex abstractions to learn

#### Usage Examples

**Adding New Tab Type**:

```typescript
// 1. Create component
export function MappingPanel() {
  return <div>Theme mapping interface</div>;
}

// 2. Add to config (workbench.config.ts)
{
  id: 'mapping',
  label: 'Mapping',
  component: MappingPanel,
  requiresLoading: false
}

// That's it! No other files need modification
```

**Adding New Layout**:

```tsx
// WorkbenchMain.tsx - Add new condition
if (isTablet && !isStatic) {
  return <TabletWorkbenchLayout {...props} />;
}
```

#### Architecture Philosophy

**Simplified SOLID** = **SOLID benefits without over-engineering**

- ✅ **Single Responsibility**: Clear component purposes
- ✅ **Open/Closed**: Extensible via configuration
- ✅ **Interface Segregation**: Props only include what's needed
- ✅ **Dependency Inversion**: Components depend on configuration, not hardcoded logic
- 🚫 **Avoid**: Strategy pattern classes, abstract factories, complex inheritance

This approach provides **90% of SOLID benefits** with **10% of the complexity**, making it perfect for a fast-moving project that needs to remain maintainable and extensible.

## Modern Provider Architecture (Type-Safe & Extensible)

### Registry-Based Provider System

The provider system has been completely modernized with a **type-safe registry architecture** that eliminates legacy patterns and provides clean extensibility:

#### Core Architecture

```
src/lib/providers/
├── types.ts                    # Core provider interfaces & types
├── registry.ts                 # Provider registry implementation
├── index.ts                    # Public API & registry setup
├── poline-base.ts             # Shared color mapping utilities
├── shadcn.ts                  # shadcn/ui provider (previewable)
├── vscode.ts                  # VS Code provider (previewable)
├── alacritty.ts               # Alacritty terminal provider
├── kitty.ts                   # Kitty terminal provider
├── warp.ts                    # Warp terminal provider
├── windows-terminal.ts        # Windows Terminal provider
├── gimp.ts                    # GIMP palette provider
└── slack.ts                   # Slack theme provider
```

#### Provider Type System

**Core Interfaces**:

```typescript
// Base provider interface
interface ThemeProvider<TOutput = any> {
  readonly metadata: ProviderMetadata;
  readonly fileExtension: string;
  readonly mimeType: string;

  convert(theme: TinteTheme): TOutput;
  export(theme: TinteTheme, filename?: string): ProviderOutput;
  validate?(output: TOutput): boolean;
}

// Extended interface for previewable providers
interface PreviewableProvider<TOutput = any> extends ThemeProvider<TOutput> {
  preview: {
    component: React.ComponentType<{ theme: TOutput; className?: string }>;
    defaultProps?: Record<string, any>;
  };
}

// Provider metadata structure
interface ProviderMetadata {
  id: string;
  name: string;
  description?: string;
  category: "editor" | "terminal" | "ui" | "design" | "other";
  tags: string[];
  icon?: React.ComponentType<{ className?: string }>;
  website?: string;
  documentation?: string;
}
```

#### Registry Implementation

**Type-Safe Registration**:

```typescript
export class ProviderRegistry {
  private providers = new Map<string, ThemeProvider>();
  private previewableProviders = new Map<string, PreviewableProvider>();

  register<T>(provider: ThemeProvider<T>): void {
    this.providers.set(provider.metadata.id, provider);
  }

  registerPreviewable<T>(provider: PreviewableProvider<T>): void {
    this.previewableProviders.set(provider.metadata.id, provider);
    this.providers.set(provider.metadata.id, provider);
  }

  // Type-safe retrieval methods
  get(id: string): ThemeProvider | undefined;
  getPreviewable(id: string): PreviewableProvider | undefined;
  getAll(): ThemeProvider[];
  getAllPreviewable(): PreviewableProvider[];
  // ... conversion & export methods
}
```

#### Public API

**Clean Function-Based Interface**:

```typescript
// Public API functions (replaces legacy providerRegistry object)
export function getAvailableProviders(): ThemeProvider[];
export function getPreviewableProviders(): PreviewableProvider[];
export function getProvidersByCategory(category: string): ThemeProvider[];
export function convertTheme<T>(
  providerId: string,
  theme: TinteTheme
): T | null;
export function exportTheme(
  providerId: string,
  theme: TinteTheme,
  filename?: string
): ProviderOutput | null;
export function convertAllThemes(theme: TinteTheme): Record<string, any>;
export function exportAllThemes(
  theme: TinteTheme
): Record<string, ProviderOutput>;
```

### Provider Implementation Examples

#### Basic Provider (Terminal/Tool)

```typescript
export const alacrittyProvider: ThemeProvider<{
  light: AlacrittyTheme;
  dark: AlacrittyTheme;
}> = {
  metadata: {
    id: "alacritty",
    name: "Alacritty",
    description: "Cross-platform, OpenGL terminal emulator",
    category: "terminal",
    tags: ["terminal", "opengl", "cross-platform"],
    icon: AlacrittyIcon,
    website: "https://alacritty.org/",
    documentation: "https://alacritty.org/config.html",
  },

  fileExtension: "yml",
  mimeType: "application/x-yaml",

  convert: (theme: TinteTheme) => ({
    light: generateAlacrittyTheme(theme, "light"),
    dark: generateAlacrittyTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => ({
    content: toYAML(alacrittyProvider.convert(theme).dark),
    filename: filename || "alacritty-theme.yml",
    mimeType: "application/x-yaml",
  }),

  validate: (output) => !!(output.light?.colors && output.dark?.colors),
};
```

#### Previewable Provider (UI/Editor)

```typescript
export const vscodeProvider: PreviewableProvider<{
  light: VSCodeTheme;
  dark: VSCodeTheme;
}> = {
  metadata: {
    id: "vscode",
    name: "VS Code",
    description: "The most popular code editor with extensive theme support",
    category: "editor",
    tags: ["editor", "microsoft", "typescript", "javascript"],
    icon: VSCodeIcon,
    website: "https://code.visualstudio.com/",
    documentation:
      "https://code.visualstudio.com/api/extension-guides/color-theme",
  },

  fileExtension: "json",
  mimeType: "application/json",
  convert: convertTinteToVSCode,
  export: (theme, filename) => ({
    /* ... */
  }),
  validate: (output) => !!(output.light?.colors && output.dark?.colors),

  preview: {
    component: VSCodePreview,
  },
};
```

### Registry Setup & Usage

#### Centralized Registration

```typescript
// src/lib/providers/index.ts - Single registry instance
const registry = new ProviderRegistry();

// Register providers by type
registry.registerPreviewable(shadcnProvider); // UI preview
registry.registerPreviewable(vscodeProvider); // Editor preview
registry.register(alacrittyProvider); // Terminal export
registry.register(kittyProvider); // Terminal export
registry.register(warpProvider); // Terminal export
registry.register(windowsTerminalProvider); // Terminal export
registry.register(gimpProvider); // Design tool export
registry.register(slackProvider); // Communication tool export
```

#### Component Usage

```typescript
// Replace legacy providerRegistry usage:

// ❌ Legacy (removed)
import { providerRegistry } from "@/lib/providers";
const output = providerRegistry.export(providerId, theme);
const providers = providerRegistry.getAllPreviewable();

// ✅ Modern (type-safe)
import { exportTheme, getPreviewableProviders } from "@/lib/providers";
const output = exportTheme(providerId, theme);
const providers = getPreviewableProviders();
```

### Key Architecture Benefits

**🎯 Type Safety**:

- **Full TypeScript support** throughout provider system
- **Compile-time validation** of provider implementations
- **IntelliSense support** for all provider methods and properties

**🔧 Clean Separation**:

- **ThemeProvider**: Basic conversion & export functionality
- **PreviewableProvider**: Adds live preview capabilities
- **Registry**: Centralized management with type-safe operations

**⚡ Performance**:

- **No runtime reflection** - all providers statically registered
- **Tree-shakeable** - unused providers eliminated in production builds
- **Efficient lookup** - Map-based provider resolution

**🧩 Extensibility**:

- **Simple provider creation** - implement interface, register once
- **Category-based organization** - group providers by application type
- **Tag-based filtering** - flexible provider discovery
- **Metadata-driven UI** - automatic integration in interface

### Provider Categories & Examples

#### Editor Providers (All Previewable)

- **shadcn/ui**: React component theme system with interactive demos
- **VS Code**: Editor theme with Monaco + Shiki integration and split views

#### Terminal Providers (All Previewable)

- **Alacritty**: GPU-accelerated terminal with syntax highlighting preview (YAML config)
- **Kitty**: Feature-rich terminal with tab interface and config display (conf format)
- **Warp**: Modern AI-powered terminal with git integration and command suggestions (YAML config)
- **Windows Terminal**: Microsoft's modern terminal with PowerShell interface (JSON config)

#### Design & Communication Tool Providers (All Previewable)

- **GIMP**: Color palette with interactive swatches and RGB display (GPL format)
- **Slack**: Team communication interface with sidebar, messages, and theme colors (JSON config)

### Migration from Legacy System

**Removed Legacy Patterns**:

- ❌ `providerRegistry` object with mixed methods
- ❌ `Provider` interface with inconsistent naming
- ❌ `meta` property (renamed to `metadata`)
- ❌ `fileExt` property (renamed to `fileExtension`)
- ❌ `docs` property (renamed to `documentation`)

**Modern Replacements**:

- ✅ **Function-based API** with clear purpose separation
- ✅ **Consistent naming** across all provider interfaces
- ✅ **Structured preview object** with component + configuration
- ✅ **Type-safe registry** with compile-time validation
- ✅ **Clean public API** without internal implementation details

### Testing Provider System

1. **Provider Registration**: All providers register without TypeScript errors
2. **Type Safety**: Provider implementations match interface contracts
3. **Conversion Testing**: Each provider converts Tinte themes correctly
4. **Export Testing**: Generated files match expected format & structure
5. **Preview Testing**: Previewable providers render without errors
6. **Category Filtering**: Providers group correctly by category/tags
7. **Registry Operations**: All CRUD operations work type-safely

This modern provider architecture provides a **scalable, type-safe, and maintainable** system for theme conversion while eliminating technical debt from the previous implementation.

## Universal Theme Preview System (Comprehensive Implementation)

### Unified Preview Architecture

The theme preview system provides rich visual representations for all supported providers through a centralized, type-safe architecture:

#### Core Components

```
src/components/
├── unified-preview.tsx          # Central routing component for all previews
├── shared/provider-switcher.tsx # Enhanced provider selector with status indicators
└── preview/                     # Provider-specific preview components
    ├── vscode/vscode-preview.tsx      # Monaco + Shiki + Tokens views
    ├── shadcn/shadcn-preview.tsx      # Interactive component demos
    ├── alacritty/alacritty-preview.tsx     # Terminal with syntax highlighting
    ├── kitty/kitty-preview.tsx            # Terminal with tabs and config
    ├── warp/warp-preview.tsx              # Modern terminal with AI features
    ├── windows-terminal/windows-terminal-preview.tsx # PowerShell interface
    ├── gimp/gimp-preview.tsx              # Color palette with RGB values
    └── slack/slack-preview.tsx            # Chat interface with theme colors
```

#### Key Features

**🎯 Real Theme Data Integration**:

- All previews use actual converted theme colors instead of hardcoded values
- Type-safe integration with provider output structures
- Dynamic color application based on current theme mode (light/dark)

**⚡ Provider Status Visualization**:

```tsx
// Provider switcher with clear status indicators
export function ProviderSwitcher() {
  const availableProviders = getAvailableProviders(); // From registry
  const plannedProviders = PLANNED_PROVIDERS.filter(/* not implemented */);

  return (
    <Command>
      <CommandGroup heading="Available">
        {availableProviders.map((provider) => (
          <CommandItem>
            <provider.icon />
            <span>{provider.name}</span>
            <CheckCircle className="text-green-500" />{" "}
            {/* Available indicator */}
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandGroup heading="Coming Soon">
        {plannedProviders.map((provider) => (
          <CommandItem disabled>
            <provider.icon />
            <span>{provider.name}</span>
            <Clock className="text-amber-500" /> {/* Coming soon indicator */}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
```

**🚀 Performance Optimizations**:

- Lazy loading of preview components
- Memoized theme conversions
- Responsive design for mobile and desktop
- Optimized re-renders using React.memo where appropriate

#### Preview Implementation Examples

**Terminal Previews** (Alacritty, Kitty, Warp, Windows Terminal):

```tsx
// Real theme data usage pattern
export function AlacrittyPreview({
  theme,
}: {
  theme: { light: AlacrittyTheme; dark: AlacrittyTheme };
}) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === "dark" ? theme.dark : theme.light;

  // Use actual theme colors for terminal elements
  const terminalColors = {
    background: currentTheme.colors.primary.background,
    foreground: currentTheme.colors.primary.foreground,
    cursor: currentTheme.colors.cursor.cursor,
    // ... map all colors from actual theme structure
  };

  return (
    <div style={{ backgroundColor: terminalColors.background }}>
      {/* Realistic terminal interface with actual colors */}
    </div>
  );
}
```

**Design Tool Previews** (GIMP, Slack):

```tsx
// GIMP palette preview with RGB conversion
export function GimpPreview({
  theme,
}: {
  theme: { light: GIMPPalette; dark: GIMPPalette };
}) {
  const currentPalette = currentMode === "dark" ? theme.dark : theme.light;

  return (
    <div>
      {/* Color swatches from actual palette data */}
      {currentPalette.colors.map((color) => (
        <div
          style={{
            backgroundColor: rgbToHex(color.red, color.green, color.blue),
          }}
          title={`${color.name}: RGB(${color.red}, ${color.green}, ${color.blue})`}
        />
      ))}
    </div>
  );
}
```

#### Central Routing System

```tsx
// Unified preview component that routes to appropriate provider preview
export function UnifiedPreview({ theme }: { theme: TinteTheme }) {
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const currentProvider = getPreviewableProvider(provider);

  if (!currentProvider) {
    return <div>No preview available for {provider}</div>;
  }

  const converted = convertTheme(currentProvider.metadata.id, theme);
  const PreviewComponent = currentProvider.preview.component;

  return (
    <div>
      <PreviewComponent theme={converted} />
    </div>
  );
}
```

### Enhanced Provider Switcher

#### Status-Aware Provider Selection

The provider switcher now provides clear visual feedback about provider availability:

**Visual Indicators**:

- ✅ **Green checkmark**: Provider is implemented and ready to use
- 🕐 **Amber clock**: Provider is planned but not yet implemented
- **Grouped sections**: "Available" and "Coming Soon" for clear organization
- **Disabled interaction**: Coming soon providers are visually muted and non-selectable

**Dynamic Detection**:

- Uses `getAvailableProviders()` from the actual registry to detect implemented providers
- Filters out duplicates between available and planned providers
- Updates automatically when new providers are registered

**Enhanced UX**:

- Wider dropdown to accommodate status indicators
- Status icon shows in both button and dropdown items
- Search functionality works across all providers
- Keyboard navigation support

#### Implementation Benefits

**🎯 User Clarity**:

- Users immediately understand which providers are ready to use
- Clear roadmap visibility for upcoming features
- No confusion about why some providers don't work

**⚡ Developer Experience**:

- Automatic detection eliminates manual status management
- Type-safe integration with provider registry
- Easy to extend when new providers are added

**🧩 Maintainability**:

- Single source of truth (provider registry) for availability
- No hardcoded provider lists to maintain
- Consistent behavior across all provider selection interfaces

### Testing Preview System

1. **Provider Detection**: Available providers show with green checkmarks
2. **Theme Application**: All previews use actual converted theme colors
3. **Mode Switching**: Light/dark mode updates all preview components
4. **Error Handling**: Graceful fallback for missing or invalid theme data
5. **Performance**: No unnecessary re-renders during theme switching
6. **Responsive Design**: Previews work correctly on mobile and desktop
7. **Type Safety**: All preview components have proper TypeScript integration

This comprehensive preview system transforms the user experience from basic "No preview available" messages to rich, interactive visualizations that accurately represent how themes will appear in each target application.
