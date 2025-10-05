import { Layers } from "lucide-react";
import { DesignSystemPreview } from "@/components/preview/design-system/design-system-preview";
import type { TinteTheme } from "@/types/tinte";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface DesignSystemOutput {
  brand: {
    name: string;
    description: string;
    logos: Array<{
      variant: string;
      background: string;
      logoColor: string;
    }>;
    symbols: Array<{
      name: string;
      background: string;
      symbolColor: string;
    }>;
  };
  typography: {
    heading: {
      family: string;
      weights: string[];
      sizes: Array<{
        level: number;
        size: string;
        usage: string;
        sample: string;
      }>;
    };
    body: {
      family: string;
      weights: string[];
      variants: Array<{
        name: string;
        size: string;
        usage: string;
        sample: string;
      }>;
    };
    code: {
      family: string;
      sample: string;
    };
  };
  colors: {
    primary: {
      name: string;
      colors: Array<{
        name: string;
        hex: string;
        rgb: string;
        cmyk: string;
      }>;
    };
    neutral: {
      name: string;
      colors: Array<{
        name: string;
        hex: string;
        rgb: string;
        cmyk: string;
      }>;
    };
    semantic: {
      name: string;
      colors: Array<{
        name: string;
        hex: string;
        rgb: string;
        usage: string;
      }>;
    };
  };
  components: {
    buttons: Array<{
      variant: string;
      description: string;
      background: string;
      text: string;
      border: string;
    }>;
    inputs: Array<{
      state: string;
      background: string;
      border: string;
      text: string;
      placeholder: string;
    }>;
    cards: Array<{
      variant: string;
      background: string;
      border: string;
      shadow: string;
    }>;
  };
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
}

function hexToCmyk(hex: string): string {
  const rgb = hexToRgb(hex).split(", ").map(Number);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return `${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`;
}

export const designSystemProvider: PreviewableProvider<DesignSystemOutput> = {
  metadata: {
    id: "design-system",
    name: "Design System",
    icon: Layers,
    description:
      "A comprehensive library of custom components for consistent, beautiful interfaces",
    category: "design",
    tags: ["design-system", "components", "ui-kit", "style-guide"],
    website: "https://designsystem.example.com",
  },

  fileExtension: "html",
  mimeType: "text/html",

  convert(theme: TinteTheme): DesignSystemOutput {
    return {
      brand: {
        name: "Theme System",
        description:
          "A comprehensive library of custom components for consistent, beautiful interfaces.",
        logos: [
          {
            variant: "Light Background",
            background: theme.light.bg,
            logoColor: theme.dark.bg,
          },
          {
            variant: "Dark Background",
            background: theme.dark.bg,
            logoColor: theme.light.bg,
          },
          {
            variant: "Primary Background",
            background: theme.light.pr,
            logoColor: theme.light.bg,
          },
        ],
        symbols: [
          {
            name: "Light",
            background: theme.light.bg_2,
            symbolColor: theme.light.pr,
          },
          {
            name: "Dark",
            background: theme.dark.bg,
            symbolColor: theme.light.pr,
          },
          {
            name: "Accent",
            background: theme.light.sc,
            symbolColor: theme.light.bg,
          },
        ],
      },
      typography: {
        heading: {
          family: "inherit",
          weights: ["400", "500", "600", "700"],
          sizes: [
            {
              level: 1,
              size: "2.5rem",
              usage: "The largest heading",
              sample: "Heading 1 - The largest heading",
            },
            {
              level: 2,
              size: "2rem",
              usage: "Section header",
              sample: "Heading 2 - Section header",
            },
            {
              level: 3,
              size: "1.5rem",
              usage: "Subsection header",
              sample: "Heading 3 - Subsection header",
            },
            {
              level: 4,
              size: "1.25rem",
              usage: "Component title",
              sample: "Heading 4 - Component title",
            },
            {
              level: 5,
              size: "1.125rem",
              usage: "Small title",
              sample: "Heading 5 - Small title",
            },
            {
              level: 6,
              size: "1rem",
              usage: "Smallest heading",
              sample: "Heading 6 - Smallest heading",
            },
          ],
        },
        body: {
          family: "inherit",
          weights: ["400", "500", "600"],
          variants: [
            {
              name: "Body Text",
              size: "1rem",
              usage: "Perfect for longer paragraphs and general content",
              sample:
                "This is body text. It's perfect for longer paragraphs and general content. It has comfortable line spacing and is optimized for readability.",
            },
            {
              name: "Small Text",
              size: "0.875rem",
              usage: "Often used for captions or secondary information",
              sample:
                "This is small text, often used for captions or secondary information.",
            },
            {
              name: "Label Text",
              size: "0.75rem",
              usage: "Commonly used for form labels and UI elements",
              sample:
                "This is label text - commonly used for form labels and UI elements.",
            },
          ],
        },
        code: {
          family: "IBM Plex Sans, Consolas, monospace",
          sample: `<Heading level={1}>Heading 1 - The largest heading</Heading>
<Heading level={2}>Heading 2 - Section header</Heading>
<Heading level={3}>Heading 3 - Subsection header</Heading>`,
        },
      },
      colors: {
        primary: {
          name: "Primary Colors",
          colors: [
            {
              name: "Primary",
              hex: theme.light.pr,
              rgb: hexToRgb(theme.light.pr),
              cmyk: hexToCmyk(theme.light.pr),
            },
            {
              name: "Secondary",
              hex: theme.light.sc,
              rgb: hexToRgb(theme.light.sc),
              cmyk: hexToCmyk(theme.light.sc),
            },
            {
              name: "Accent 1",
              hex: theme.light.ac_1,
              rgb: hexToRgb(theme.light.ac_1),
              cmyk: hexToCmyk(theme.light.ac_1),
            },
          ],
        },
        neutral: {
          name: "Neutral Colors",
          colors: [
            {
              name: "Background",
              hex: theme.light.bg,
              rgb: hexToRgb(theme.light.bg),
              cmyk: hexToCmyk(theme.light.bg),
            },
            {
              name: "Surface",
              hex: theme.light.bg_2,
              rgb: hexToRgb(theme.light.bg_2),
              cmyk: hexToCmyk(theme.light.bg_2),
            },
          ],
        },
        semantic: {
          name: "UI Colors",
          colors: [
            {
              name: "Background",
              hex: theme.light.bg,
              rgb: hexToRgb(theme.light.bg),
              usage: "Main background",
            },
            {
              name: "Surface",
              hex: theme.light.bg_2,
              rgb: hexToRgb(theme.light.bg_2),
              usage: "Card backgrounds",
            },
            {
              name: "Border",
              hex: theme.light.ui,
              rgb: hexToRgb(theme.light.ui),
              usage: "Borders and dividers",
            },
            {
              name: "Text Primary",
              hex: theme.light.tx,
              rgb: hexToRgb(theme.light.tx),
              usage: "Primary text",
            },
            {
              name: "Text Secondary",
              hex: theme.light.tx_2,
              rgb: hexToRgb(theme.light.tx_2),
              usage: "Secondary text",
            },
            {
              name: "Text Muted",
              hex: theme.light.tx_3,
              rgb: hexToRgb(theme.light.tx_3),
              usage: "Muted text",
            },
          ],
        },
      },
      components: {
        buttons: [
          {
            variant: "Primary",
            description: "Main call-to-action button",
            background: theme.light.pr,
            text: theme.light.bg,
            border: theme.light.pr,
          },
          {
            variant: "Secondary",
            description: "Secondary action button",
            background: theme.light.bg,
            text: theme.light.pr,
            border: theme.light.pr,
          },
          {
            variant: "Ghost",
            description: "Subtle action button",
            background: "transparent",
            text: theme.light.tx,
            border: theme.light.ui,
          },
        ],
        inputs: [
          {
            state: "Default",
            background: theme.light.bg,
            border: theme.light.ui,
            text: theme.light.tx,
            placeholder: theme.light.tx_3,
          },
          {
            state: "Focus",
            background: theme.light.bg,
            border: theme.light.pr,
            text: theme.light.tx,
            placeholder: theme.light.tx_3,
          },
          {
            state: "Error",
            background: theme.light.bg,
            border: theme.light.ac_1,
            text: theme.light.tx,
            placeholder: theme.light.tx_3,
          },
        ],
        cards: [
          {
            variant: "Default",
            background: theme.light.bg,
            border: theme.light.ui,
            shadow: "0 1px 3px rgba(0,0,0,0.1)",
          },
          {
            variant: "Elevated",
            background: theme.light.bg_2,
            border: theme.light.ui_2,
            shadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        ],
      },
    };
  },

  export(theme: TinteTheme, filename = "design-system"): ProviderOutput {
    const system = this.convert(theme);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design System Components</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: ${theme.light.tx};
            background: ${theme.light.bg};
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .header { margin-bottom: 3rem; }
        .section { margin-bottom: 4rem; }
        .grid { display: grid; gap: 1rem; }
        .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .no-gap { gap: 0; }
        .card {
            background: ${theme.light.bg_2};
            border: 1px solid ${theme.light.ui};
            border-radius: 8px;
            padding: 2rem;
            position: relative;
        }
        .color-card {
            aspect-ratio: 1.6;
            padding: 2rem;
            border-radius: 0;
            border: none;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
        .logo-demo {
            aspect-ratio: 16/9;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 600;
            font-size: 1.5rem;
        }
        .symbol-demo {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
        }
        .symbol {
            width: 40px;
            height: 40px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .symbol::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            background: currentColor;
            border-radius: 2px 8px 2px 8px;
            transform: rotate(45deg);
        }
        .symbol::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background: currentColor;
            border-radius: 8px 2px 8px 2px;
            transform: rotate(-45deg);
        }
        .tabs {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            border-bottom: 1px solid ${theme.light.ui};
            padding-bottom: 1rem;
        }
        .tab {
            padding: 0.5rem 1rem;
            background: none;
            border: none;
            font-size: 1rem;
            cursor: pointer;
            color: ${theme.light.tx_2};
        }
        .tab.active {
            color: ${theme.light.tx};
            border-bottom: 2px solid ${theme.light.pr};
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700; }
        h2 { font-size: 2rem; margin-bottom: 1.5rem; font-weight: 600; }
        h3 { font-size: 1.25rem; margin-bottom: 1rem; font-weight: 500; }
        p { color: ${theme.light.tx_2}; margin-bottom: 1rem; }
        .subtitle { font-size: 1.125rem; color: ${theme.light.tx_2}; }
        .code {
            background: ${theme.dark.bg};
            color: ${theme.light.bg};
            padding: 1rem;
            border-radius: 6px;
            font-family: 'IBM Plex Sans', Consolas, monospace;
            font-size: 0.875rem;
            white-space: pre-line;
            margin: 1rem 0;
        }
        .color-info {
            font-size: 0.75rem;
            font-weight: 500;
            line-height: 1.2;
        }
        .blockquote {
            border-left: 4px solid ${theme.light.pr};
            padding-left: 1rem;
            font-style: italic;
            color: ${theme.light.tx_2};
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${system.brand.name}</h1>
            <p class="subtitle">${system.brand.description}</p>
        </header>

        <nav class="tabs">
            <button class="tab active">Buttons</button>
            <button class="tab">Inputs</button>
            <button class="tab">Typography</button>
            <button class="tab">Colors</button>
            <button class="tab">Spacing</button>
            <button class="tab">Borders</button>
            <button class="tab">Effects</button>
            <button class="tab">Cards</button>
            <button class="tab">States</button>
            <button class="tab">Toggles</button>
            <button class="tab">Tags</button>
            <button class="tab">Tabs</button>
        </nav>

        <!-- Brand Section -->
        <section class="section">
            <h2>Brand Identity</h2>
            <div class="grid grid-3" style="margin-bottom: 2rem;">
                ${system.brand.logos
                  .map(
                    (logo) => `
                    <div class="card">
                        <div class="logo-demo" style="background-color: ${logo.background}; color: ${logo.logoColor};">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div class="symbol" style="color: ${logo.logoColor};"></div>
                                ${system.brand.name}
                            </div>
                        </div>
                        <h3>${logo.variant}</h3>
                    </div>
                `,
                  )
                  .join("")}
            </div>

            <div class="grid grid-3">
                ${system.brand.symbols
                  .map(
                    (symbol) => `
                    <div class="card">
                        <div class="symbol-demo" style="background-color: ${symbol.background};">
                            <div class="symbol" style="color: ${symbol.symbolColor};"></div>
                        </div>
                        <h3>${symbol.name}</h3>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <!-- Typography Section -->
        <section class="section">
            <h2>Typography</h2>

            <div class="card" style="margin-bottom: 2rem;">
                <h3>Headings</h3>
                ${system.typography.heading.sizes
                  .map(
                    (heading) => `
                    <div style="margin-bottom: 1.5rem;">
                        <h${heading.level} style="font-size: ${heading.size}; margin-bottom: 0.5rem;">${heading.sample}</h${heading.level}>
                    </div>
                `,
                  )
                  .join("")}

                <div class="code">Headings
${system.typography.heading.sizes
  .slice(0, 3)
  .map((h) => `<Heading level={${h.level}}>${h.sample}</Heading>`)
  .join("\n")}</div>
            </div>

            <div class="card">
                <h3>Text Variants</h3>
                ${system.typography.body.variants
                  .map(
                    (variant) => `
                    <div style="margin-bottom: 2rem;">
                        <p style="font-size: ${variant.size}; margin-bottom: 0.5rem;">${variant.sample}</p>
                        <small style="color: ${theme.light.tx_3};">${variant.usage}</small>
                    </div>
                `,
                  )
                  .join("")}

                <div class="blockquote">
                    "This is a blockquote. It's styled with a left border and italic text to distinguish quoted content from regular text."
                </div>

                <div class="code">Text Variants
${system.typography.body.variants.map((v) => `<Text variant="${v.name.toLowerCase().replace(" ", "-")}">${v.sample.slice(0, 30)}...</Text>`).join("\n")}</div>
            </div>
        </section>

        <!-- Colors Section -->
        <section class="section">
            <h2>Colors</h2>

            <!-- Primary Colors Grid -->
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Primary Colors</h3>
                <div class="grid grid-3 no-gap">
                    ${system.colors.primary.colors
                      .map(
                        (color) => `
                        <div class="color-card" style="background-color: ${color.hex};">
                            <div class="color-info">
                                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${color.name}</div>
                                <div>HEX - ${color.hex}</div>
                                <div>RGB - (${color.rgb})</div>
                                <div>CMYK - (${color.cmyk})</div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <!-- Neutral Colors Grid -->
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Neutral Colors</h3>
                <div class="grid grid-2 no-gap">
                    ${system.colors.neutral.colors
                      .map(
                        (color) => `
                        <div class="color-card" style="background-color: ${color.hex}; color: ${theme.dark.tx};">
                            <div class="color-info">
                                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${color.name}</div>
                                <div>HEX - ${color.hex}</div>
                                <div>RGB - (${color.rgb})</div>
                                <div>CMYK - (${color.cmyk})</div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <!-- UI Colors -->
            <div class="grid grid-3">
                ${system.colors.semantic.colors
                  .map(
                    (color) => `
                    <div class="card">
                        <div style="width: 100%; height: 100px; background-color: ${color.hex}; border-radius: 4px; margin-bottom: 1rem; border: 1px solid ${theme.light.ui};"></div>
                        <h3>${color.name}</h3>
                        <p style="font-family: monospace; font-size: 0.875rem;">${color.hex}</p>
                        <p style="font-size: 0.875rem;">${color.usage}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <!-- Components Section -->
        <section class="section">
            <h2>Components</h2>

            <div class="grid grid-2">
                <div class="card">
                    <h3>Buttons</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        ${system.components.buttons
                          .map(
                            (button) => `
                            <button style="
                                background: ${button.background};
                                color: ${button.text};
                                border: 1px solid ${button.border};
                                padding: 0.75rem 1.5rem;
                                border-radius: 6px;
                                font-weight: 500;
                                cursor: pointer;
                            ">${button.variant} Button</button>
                        `,
                          )
                          .join("")}
                    </div>
                </div>

                <div class="card">
                    <h3>Form Inputs</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        ${system.components.inputs
                          .map(
                            (input) => `
                            <input
                                type="text"
                                placeholder="${input.state} input state"
                                style="
                                    background: ${input.background};
                                    border: 1px solid ${input.border};
                                    color: ${input.text};
                                    padding: 0.75rem;
                                    border-radius: 6px;
                                    width: 100%;
                                "
                            />
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </section>
    </div>
</body>
</html>`;

    return {
      content: html,
      filename: `${filename}.html`,
      mimeType: this.mimeType,
    };
  },

  preview: {
    component: DesignSystemPreview,
  },
};
