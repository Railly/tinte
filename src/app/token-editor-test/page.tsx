"use client";

import { FloatingThemeEditor } from "@/elements/floating-theme-editor";

export default function TokenEditorTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Floating Theme Editor Test</h1>
          <p className="text-muted-foreground">
            This page demonstrates the floating ball theme editor that reads real values from globals.css
            and preserves original color formats (oklch→oklch, hex→hex).
          </p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">🎯 Look at the bottom-right corner for the floating theme editor!</p>
            <p className="text-sm text-muted-foreground mt-1">Click the Tinte logo to open the editor. All changes are applied instantly!</p>
          </div>
        </div>

        {/* Live Preview Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Live Preview Components</h2>
          <p className="text-sm text-muted-foreground mb-6">
            These components will change instantly when you modify colors in the floating editor.
          </p>
            <div className="space-y-4">
              {/* Background & Text */}
              <div className="p-4 bg-card border rounded-lg">
                <h3 className="text-lg font-medium text-foreground mb-2">Card Background</h3>
                <p className="text-muted-foreground">This card uses card and card-foreground tokens.</p>
              </div>

              {/* Primary Elements */}
              <div className="space-y-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
                  Secondary Button
                </button>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90">
                  Accent Button
                </button>
              </div>

              {/* Form Elements */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Input field"
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring"
                />
                <div className="p-2 border border-border rounded-md bg-muted text-muted-foreground">
                  Muted content area
                </div>
              </div>

              {/* Chart Colors */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-md`}
                    style={{ backgroundColor: `var(--chart-${i})` }}
                  />
                ))}
              </div>

              {/* Destructive */}
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">
                Destructive Action
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">How to use:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Modify any token value in the editor to see live changes</li>
            <li>Toggle between light and dark mode to edit both themes</li>
            <li>Use the "Write CSS" button to save changes to globals.css</li>
            <li>All values should be valid CSS colors (oklch format recommended)</li>
            <li>The widget is completely self-contained and can be added to any layout</li>
          </ul>
        </div>
      </div>

      {/* Floating Theme Editor */}
      <FloatingThemeEditor 
        onChange={(theme) => {
          console.log('Floating theme changed:', theme);
        }}
      />
    </div>
  );
}