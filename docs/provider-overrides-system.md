# Provider Overrides System

A standardized, extensible system for managing provider-specific theme overrides with database persistence and real-time synchronization.

## Overview

The Provider Overrides System allows users to customize theme tokens for specific providers (shadcn/ui, VS Code, Shiki) while maintaining consistency and persistence across the application.

### Key Features

- **Unified API** across all providers
- **Database persistence** with automatic sync
- **Real-time updates** across UI components
- **Mode-aware** (light/dark) override management
- **Type-safe** implementation
- **Extensible** architecture for new providers

## Architecture

```
Database (theme table)
├── shadcn_override: { "dark": {"background": "#11070a"}, "light": {...} }
├── vscode_override: { "dark": {...}, "light": {...} }
└── shiki_override: { "dark": {...}, "light": {...} }
                   ↓
Theme Store (Zustand)
├── shadcnOverride
├── vscodeOverride
└── shikiOverride
                   ↓
useProviderOverrides Hook
├── Centralized API
├── Mode management
└── Merge logic
                   ↓
UI Panels
├── ShadcnOverridesPanel
├── VSCodeOverridesPanel
└── ShikiOverridesPanel
```

## Core Hook: `useProviderOverrides`

### Usage

```typescript
import { useProviderOverrides } from "@/hooks/use-provider-overrides";

// Generic usage
const overrides = useProviderOverrides("shadcn");
const overrides = useProviderOverrides("vscode");
const overrides = useProviderOverrides("shiki");

// Type-safe shortcuts
import { useShadcnOverrides, useVSCodeOverrides, useShikiOverrides } from "@/hooks/use-provider-overrides";

const shadcnOverrides = useShadcnOverrides();
const vscodeOverrides = useVSCodeOverrides();
const shikiOverrides = useShikiOverrides();
```

### API Reference

```typescript
interface ProviderOverrideHook<T = Record<string, any>> {
  // Current state
  overrides: T;                    // Overrides for current mode
  allOverrides: Record<string, T>; // All overrides (light + dark)
  hasAnyOverrides: boolean;        // Check if any overrides exist

  // Value access
  hasOverride: (key: string) => boolean;
  getValue: (key: string, fallback?: string) => string | undefined;
  getMergedTokens: (baseTokens: Record<string, string>) => Record<string, string>;

  // Mutations
  setOverride: (key: string, value: string) => void;
  setOverrides: (overrides: Partial<T>) => void;
  clearOverride: (key: string) => void;
  clearAllOverrides: () => void;      // Clear current mode
  resetAllOverrides: () => void;      // Clear all modes
}
```

## Database Schema

The system uses the existing theme table with JSON columns:

```sql
-- theme table
shadcn_override JSONB  -- { "light": {...}, "dark": {...} }
vscode_override JSONB  -- { "light": {...}, "dark": {...} }
shiki_override JSONB   -- { "light": {...}, "dark": {...} }
```

### Data Structure

```typescript
type OverrideData = {
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

// Example database data:
{
  "shadcn_override": {
    "dark": {
      "background": "#11070a",
      "foreground": "#ffffff",
      "primary": "#ff6b6b"
    },
    "light": {
      "background": "#ffffff",
      "foreground": "#000000"
    }
  }
}
```

## UI Panel Architecture

### Standardized Panel Pattern

All provider panels follow the same structure:

```typescript
interface ProviderPanelProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function ProviderPanel({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search tokens...",
}: ProviderPanelProps) {
  const { currentMode } = useThemeContext();
  const providerOverrides = useProviderOverrides("provider-name");

  // Panel-specific logic using standardized API
  const handleTokenChange = (key: string, value: string) => {
    providerOverrides.setOverride(key, value);
  };

  const getTokenValue = (key: string) => {
    return providerOverrides.getValue(key, getDefaultValue(key));
  };

  // Render UI...
}
```

### Current Panels

1. **ShadcnOverridesPanel** (`/components/shared/shadcn-overrides-panel.tsx`)
   - Manages shadcn/ui design tokens
   - Color tokens, fonts, shadows, radius, etc.

2. **VSCodeOverridesPanel** (`/components/shared/vscode-overrides-panel.tsx`)
   - Manages VS Code theme tokens
   - Editor colors, syntax highlighting, UI elements

3. **ShikiOverridesPanel** (`/components/shared/shiki-overrides-panel.tsx`)
   - Manages Shiki syntax highlighting CSS variables
   - Token colors, background, syntax elements

## Data Flow

### Loading Overrides

1. **Theme Selection**: User selects theme from database
2. **Store Update**: Theme store loads override data from DB
3. **Hook Access**: UI components access via `useProviderOverrides`
4. **UI Render**: Panels display merged tokens (base + overrides)

```typescript
// In persistent-theme-store.ts
selectTheme: (theme) => {
  // Load overrides from database theme data
  const dbThemeOverrides = theme.overrides || {};

  set({
    shadcnOverride: dbThemeOverrides.shadcn || null,
    vscodeOverride: dbThemeOverrides.vscode || null,
    shikiOverride: dbThemeOverrides.shiki || null,
  });
}
```

### Saving Overrides

1. **Token Edit**: User modifies token in UI panel
2. **Hook Update**: `setOverride()` updates store
3. **Store Persistence**: Store saves to database on theme save
4. **Real-time Sync**: Changes reflected across all UI

```typescript
// In UI panel
const handleChange = (key: string, value: string) => {
  providerOverrides.setOverride(key, value); // Updates store + persistence
};
```

## Adding New Providers

The system is designed for easy extensibility:

### 1. Add Provider Type

```typescript
// In use-provider-overrides.ts
export type ProviderType = "shadcn" | "vscode" | "shiki" | "new-provider";
```

### 2. Update Database Schema

```sql
ALTER TABLE theme ADD COLUMN new_provider_override JSONB;
```

### 3. Update Theme Store

```typescript
// In persistent-theme-store.ts
interface PersistentThemeState {
  // ...existing
  newProviderOverride: any | null;
}

// Add actions
updateNewProviderOverride: (override: any) => void;
```

### 4. Update Hook Logic

```typescript
// In use-provider-overrides.ts
const allOverrides = useMemo(() => {
  switch (provider) {
    // ...existing cases
    case "new-provider":
      return newProviderOverride;
    default:
      return null;
  }
}, [provider, /* ...existing */, newProviderOverride]);
```

### 5. Create UI Panel

```typescript
// /components/shared/new-provider-overrides-panel.tsx
export function NewProviderOverridesPanel(props: ProviderPanelProps) {
  const newProviderOverrides = useProviderOverrides("new-provider");

  // Use standardized API for all interactions
  // ...panel implementation
}
```

### 6. Add to Router

```typescript
// In overrides-tab.tsx
if (provider === "new-provider") {
  return <NewProviderOverridesPanel {...props} />;
}
```

## Example Usage

### Basic Token Management

```typescript
const shadcnOverrides = useShadcnOverrides();

// Check if override exists
if (shadcnOverrides.hasOverride("background")) {
  console.log("Custom background set");
}

// Get value with fallback
const bgColor = shadcnOverrides.getValue("background", "#ffffff");

// Set override
shadcnOverrides.setOverride("background", "#11070a");

// Clear single override
shadcnOverrides.clearOverride("background");

// Clear all overrides for current mode
shadcnOverrides.clearAllOverrides();
```

### Token Display with Overrides

```typescript
const MyTokenInput = ({ tokenKey }: { tokenKey: string }) => {
  const { currentTokens } = useThemeContext();
  const overrides = useShadcnOverrides();

  // Get merged tokens (base + overrides)
  const mergedTokens = overrides.getMergedTokens(currentTokens);
  const currentValue = mergedTokens[tokenKey];

  const handleChange = (value: string) => {
    overrides.setOverride(tokenKey, value);
  };

  return (
    <ColorInput
      value={currentValue}
      onChange={handleChange}
    />
  );
};
```

### Mode-Aware Overrides

The system automatically handles light/dark mode switching:

```typescript
const overrides = useShadcnOverrides();

// These automatically use current mode
overrides.setOverride("background", "#11070a"); // Sets for current mode
const bgColor = overrides.getValue("background"); // Gets from current mode

// Access all modes
const allModes = overrides.allOverrides;
console.log(allModes.dark?.background);  // "#11070a"
console.log(allModes.light?.background); // undefined or light mode value
```

## Migration Guide

### From Old System

If migrating from individual provider contexts:

**Before:**
```typescript
// Old individual context
const { overrides, setOverride } = useVSCodeOverrides();
```

**After:**
```typescript
// New standardized system
const vscodeOverrides = useVSCodeOverrides();
vscodeOverrides.setOverride(key, value);
```

### Database Migration

Existing override data will be automatically loaded by the new system. No manual migration required.

## Theme Ownership & Editing Behavior

The system handles theme editing differently based on ownership:

### Own Themes (Your Themes)

When editing themes you created:

- ✅ **No "Custom (unsaved)"** - keeps original name
- ✅ **Direct updates** - saves over existing theme
- ✅ **No new theme creation** - modifies the original
- ✅ **Preserves metadata** - keeps original ID, creation date, etc.

```typescript
// Detection logic for own themes:
const isOwnTheme =
  theme.user?.id === currentUser?.id ||
  theme.author === "You" ||
  (theme.id?.startsWith("theme_") && currentUser);

// Behavior for own themes:
if (isOwnTheme) {
  // Keep original name, just mark as edited until saved
  theme.name = theme.name.replace(" (unsaved)", "");
  // Save will UPDATE the existing theme
}
```

### Other Users' Themes

When editing themes from other users:

- 🔄 **Creates "Custom (unsaved)"** - new theme with your ownership
- 🆕 **New theme ID** - gets `custom_${timestamp}` ID
- 👤 **Your ownership** - marked as authored by you
- 💾 **Save creates new** - doesn't modify original theme

```typescript
// Behavior for others' themes:
if (!isOwnTheme) {
  // Create new custom theme
  const newTheme = {
    id: `custom_${Date.now()}`,
    name: "Custom (unsaved)",
    author: "You",
    user: currentUser,
    // ... copy theme data with your ownership
  };
}
```

### Visual Indicators

The UI provides clear feedback:

- **Own themes**: Show original name, save button says "Update"
- **Others' themes**: Show "Custom (unsaved)", save button says "Save as New"
- **Unsaved changes**: Visual indicators show pending modifications

## Best Practices

### 1. Use Type-Safe Shortcuts
```typescript
// ✅ Preferred
const shadcnOverrides = useShadcnOverrides();

// ❌ Avoid
const shadcnOverrides = useProviderOverrides("shadcn");
```

### 2. Check Override Existence
```typescript
// ✅ Good
if (overrides.hasOverride(key)) {
  return overrides.getValue(key);
}
return defaultValue;

// ✅ Better - built-in fallback
return overrides.getValue(key, defaultValue);
```

### 3. Batch Updates
```typescript
// ✅ Efficient
overrides.setOverrides({
  background: "#11070a",
  foreground: "#ffffff",
  primary: "#ff6b6b"
});

// ❌ Less efficient
overrides.setOverride("background", "#11070a");
overrides.setOverride("foreground", "#ffffff");
overrides.setOverride("primary", "#ff6b6b");
```

### 4. Mode Handling
```typescript
// ✅ Automatic mode handling
const overrides = useShadcnOverrides();
overrides.setOverride("background", "#11070a"); // Uses current mode

// ✅ Manual mode access when needed
if (overrides.allOverrides.dark?.background) {
  // Handle dark mode specific logic
}
```

## Troubleshooting

### Overrides Not Showing

1. **Check database data**: Ensure override data exists in theme table
2. **Verify hook usage**: Use correct provider type string
3. **Theme selection**: Make sure theme with overrides is selected
4. **Mode sync**: Check if override exists for current light/dark mode

### Performance Issues

1. **Avoid inline hooks**: Don't call `useProviderOverrides` inside render loops
2. **Memoize values**: Use useMemo for expensive computations
3. **Batch updates**: Use `setOverrides` instead of multiple `setOverride` calls

### Type Errors

1. **Use shortcuts**: Prefer `useShadcnOverrides()` over generic function
2. **Check provider names**: Ensure provider type matches exactly
3. **Override structure**: Verify override data structure in database

## Future Enhancements

### Planned Features

- **Override validation**: Schema validation for provider-specific tokens
- **Import/Export**: Bulk override management
- **Override presets**: Pre-configured override sets
- **Visual diff**: Show override vs base theme differences
- **Override history**: Track and revert override changes

### Extension Points

The system is designed to support:

- **Custom providers**: Third-party theme systems
- **Plugin architecture**: Provider-specific logic plugins
- **Validation rules**: Custom token validation per provider
- **Transform pipelines**: Token value transformations
- **Sync strategies**: Alternative persistence mechanisms

---

*This system provides a robust foundation for provider-specific theme customization while maintaining consistency and extensibility across the entire application.*