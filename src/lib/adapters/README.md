# Theme Adapter Architecture

This directory contains the theme adapter system that allows Tinte to convert themes to multiple target formats with a unified, ergonomic API.

## Architecture Overview

```
TinteTheme (Source of Truth)
    ↓
AdapterRegistry
    ↓
Multiple Adapters (shadcn, vscode, zed, etc.)
    ↓
Target Format + Preview Components
```

## Core Concepts

### TinteTheme as Source of Truth
All theme conversions start from the `TinteTheme` type defined in `@/types/tinte.ts`. This ensures consistency and makes it easy to generate themes from LLMs or other sources.

### Adapter Interface
Each adapter implements the `ThemeAdapter` or `PreviewableAdapter` interface:

```typescript
interface ThemeAdapter<TOutput = any> {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly fileExtension: string;
  
  convert(theme: TinteTheme): TOutput;
  export?(theme: TinteTheme, filename?: string): ExportResult;
  validate?(output: TOutput): boolean;
}
```

### Registry System
The `AdapterRegistry` manages all adapters and provides:
- Registration of new adapters
- Conversion and export operations
- Batch operations across all adapters
- Type-safe adapter retrieval

## Adding New Adapters

### 1. Basic Adapter

```typescript
// lib/adapters/my-adapter.tsx
import { ThemeAdapter, AdapterMetadata } from "./types";

const myAdapter: ThemeAdapter<MyThemeFormat> = {
  id: "my-adapter",
  name: "My Theme Format",
  version: "1.0.0",
  fileExtension: "json",
  
  convert: (tinte: TinteTheme) => {
    // Convert TinteTheme to your format
    return {
      background: tinte.light.background,
      // ... other mappings
    };
  },
  
  export: (theme, filename) => ({
    content: JSON.stringify(convert(theme), null, 2),
    filename: filename || "my-theme.json",
    mimeType: "application/json",
  }),
};

export const metadata: AdapterMetadata = {
  id: "my-adapter",
  name: "My Theme Format",
  category: "editor", // or "terminal", "ui", "design", "other"
  tags: ["tag1", "tag2"],
  icon: MyIcon,
};
```

### 2. Previewable Adapter

If your adapter should have a preview component:

```typescript
// Add preview component
function MyPreview({ theme }: { theme: MyThemeFormat }) {
  return <div>Preview of {theme.name}</div>;
}

const myAdapter: PreviewableAdapter<MyThemeFormat> = {
  // ... basic adapter properties
  
  preview: {
    component: MyPreview,
    defaultProps: { /* optional default props */ },
  },
};
```

### 3. Register the Adapter

```typescript
// lib/adapters/index.ts
import { myAdapter, metadata as myMetadata } from "./my-adapter";

adapterRegistry.registerPreviewable(
  createPreviewableAdapter(myAdapter, myMetadata)
);
```

## File Structure

```
lib/adapters/
├── index.ts              # Main exports and adapter registration
├── registry.ts           # AdapterRegistry implementation
├── types.ts              # Core adapter interfaces
├── shadcn.tsx           # shadcn/ui adapter
├── vscode.tsx           # VS Code adapter
├── _template-zed.tsx    # Template for new adapters
└── README.md            # This file
```

## Usage Examples

### Convert Theme

```typescript
import { adapterRegistry } from "@/lib/adapters";

const shadcnTheme = adapterRegistry.convert("shadcn", tinteTheme);
const vscodeTheme = adapterRegistry.convert("vscode", tinteTheme);
```

### Export Theme

```typescript
const exportResult = adapterRegistry.export("shadcn", tinteTheme);
if (exportResult) {
  // Download or save exportResult.content
}
```

### Batch Operations

```typescript
const allConversions = adapterRegistry.convertAll(tinteTheme);
const allExports = adapterRegistry.exportAll(tinteTheme);
```

### Using Hooks

```typescript
import { useThemeAdapters } from "@/hooks/use-theme-adapters";

function MyComponent() {
  const { convertTheme, exportTheme, previewableAdapters } = useThemeAdapters();
  
  const shadcnTheme = convertTheme("shadcn", myTinteTheme);
  // ...
}
```

### Unified Preview Component

```typescript
import { UnifiedPreview } from "@/components/unified-preview";

<UnifiedPreview 
  theme={tinteTheme} 
  onExport={(id, filename, content) => {
    // Handle theme export
  }}
/>
```

## Best Practices

1. **Semantic Mapping**: Map Tinte tokens to semantically equivalent tokens in your target format
2. **Validation**: Implement the `validate` function to ensure output correctness
3. **Error Handling**: Handle invalid colors and missing tokens gracefully
4. **Preview Components**: Keep preview components simple and focused on showing the theme
5. **Documentation**: Include links to official theme documentation in metadata
6. **Testing**: Test your adapter with various Tinte themes to ensure robustness

## Extending the System

### Custom Categories
Add new categories to the `AdapterMetadata['category']` union in `types.ts`.

### Batch Export Formats
Extend the registry to support ZIP exports or multi-file formats.

### Validation Rules
Add more sophisticated validation rules for specific theme formats.

### Preview Modes
Extend preview components to support different modes (light/dark, syntax highlighting, etc.).

## Migration from Legacy System

The adapter system maintains backward compatibility with the existing conversion functions:
- `tinteToShadcn` → `shadcnAdapter.convert`
- `tinteToVSCode` → `vscodeAdapter.convert`

Legacy preview components are wrapped and integrated into the new system seamlessly.