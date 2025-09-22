import { BadgeCheck } from "lucide-react";
import { BrandGuidelinesPreview } from "@/components/preview/brand-guidelines/brand-guidelines-preview";
import type { TinteTheme } from "@/types/tinte";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface BrandGuidelinesOutput {
  brand: {
    name: string;
    description: string;
  };
  logo: {
    primary: string;
    variations: Array<{
      name: string;
      description: string;
      background: string;
      logo: string;
    }>;
  };
  symbol: {
    description: string;
    variations: Array<{
      name: string;
      background: string;
      color: string;
    }>;
  };
  typography: {
    primary: {
      name: string;
      family: string;
      weights: string[];
      sample: string;
    };
    secondary?: {
      name: string;
      family: string;
      weights: string[];
      sample: string;
    };
  };
  colors: {
    primary: {
      name: string;
      description: string;
      palette: Array<{
        name: string;
        hex: string;
        usage: string;
      }>;
    };
    neutral: {
      name: string;
      description: string;
      palette: Array<{
        name: string;
        hex: string;
        usage: string;
      }>;
    };
  };
  scaling: {
    description: string;
    sizes: Array<{
      percentage: number;
      usage: string;
    }>;
  };
}

export const brandGuidelinesProvider: PreviewableProvider<BrandGuidelinesOutput> =
  {
    metadata: {
      id: "brand-guidelines",
      name: "Brand Guidelines",
      icon: BadgeCheck,
      description:
        "Comprehensive brand guidelines with logo, typography, and color specifications",
      category: "design",
      tags: ["brand", "guidelines", "design-system", "documentation"],
      website: "https://example.com/brand-guidelines",
    },

    fileExtension: "html",
    mimeType: "text/html",

    convert(theme: TinteTheme, currentTheme?: any): BrandGuidelinesOutput {
      console.log({ theme, currentTheme });
      const themeName = currentTheme?.name || "";
      return {
        brand: {
          name: themeName,
          description:
            "The primary brand reflects the official logo and symbol that should be used in all communications. It combines the symbol and the logotype in a clear relationship. It should be used clearly and consistently.",
        },
        logo: {
          primary:
            "The primary logo is the official logo and should be used in most cases unless specified otherwise.",
          variations: [
            {
              name: "Dark Background",
              description: "Use on dark backgrounds",
              background: theme.dark.bg,
              logo: theme.light.tx,
            },
            {
              name: "Light Background",
              description: "Use on light backgrounds",
              background: theme.light.bg,
              logo: theme.dark.tx,
            },
            {
              name: "Primary Color",
              description: "Use on primary color backgrounds",
              background: theme.light.pr,
              logo: theme.light.bg,
            },
            {
              name: "Accent Color",
              description: "Use on accent color backgrounds",
              background: theme.light.sc,
              logo: theme.light.bg,
            },
          ],
        },
        symbol: {
          description:
            "The standalone symbol is reserved for specific applications where the full logo doesn't fit appropriately. It should be used in square or circular applications, or when space is extremely limited.",
          variations: [
            {
              name: "Dark",
              background: theme.dark.bg,
              color: theme.light.pr,
            },
            {
              name: "Primary",
              background: theme.light.pr,
              color: theme.light.bg,
            },
            {
              name: "Light",
              background: theme.light.bg_2,
              color: theme.light.pr,
            },
            {
              name: "Bright",
              background: theme.light.sc,
              color: theme.dark.tx,
            },
          ],
        },
        typography: {
          primary: {
            name: "Inter",
            family: "Inter, system-ui, sans-serif",
            weights: ["400", "500", "600", "700"],
            sample:
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n1234567890!@#$%^&*()",
          },
        },
        colors: {
          primary: {
            name: "Primary Colour",
            description: `Our primary colours reflect ${themeName}'s core brand identity. They should be used consistently across digital, print, and product experiences.`,
            palette: [
              {
                name: "HEX",
                hex: theme.light.pr,
                usage: "Primary brand color",
              },
              {
                name: "RGB(185, 255, 4)",
                hex: theme.light.pr,
                usage: "Digital applications",
              },
              {
                name: "HEX",
                hex: theme.light.sc,
                usage: "Accent color",
              },
              {
                name: "PANTONE",
                hex: theme.light.sc,
                usage: "Print applications",
              },
              {
                name: "HEX",
                hex: theme.light.sc,
                usage: "Bright variation",
              },
              {
                name: "COFFEE",
                hex: theme.dark.pr,
                usage: "Dark variation",
              },
            ],
          },
          neutral: {
            name: "Neutral Colors",
            description:
              "Supporting neutral colors for backgrounds, text, and UI elements.",
            palette: [
              {
                name: "Background",
                hex: theme.light.bg,
                usage: "Main background",
              },
              {
                name: "Surface",
                hex: theme.light.bg_2,
                usage: "Elevated surfaces",
              },
              {
                name: "Border",
                hex: theme.light.ui,
                usage: "Borders and dividers",
              },
              {
                name: "Text",
                hex: theme.light.tx,
                usage: "Primary text",
              },
              {
                name: "Muted",
                hex: theme.light.tx_2,
                usage: "Secondary text",
              },
              {
                name: "Faint",
                hex: theme.light.tx_3,
                usage: "Tertiary text",
              },
            ],
          },
        },
        scaling: {
          description:
            "Logo should scale proportionally and remain legible across all media. The minimum size for digital applications is 24px height.",
          sizes: [
            { percentage: 100, usage: "Standard size" },
            { percentage: 75, usage: "Medium applications" },
            { percentage: 50, usage: "Small applications" },
            { percentage: 25, usage: "Minimum size" },
          ],
        },
      };
    },

    export(theme: TinteTheme, filename = "brand-guidelines"): ProviderOutput {
      const guidelines = this.convert(theme);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${guidelines.brand.name} Brand Guidelines</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: ${theme.light.tx};
            background: ${theme.light.bg};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .section { margin-bottom: 4rem; }
        .grid { display: grid; gap: 2rem; }
        .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        .grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .card {
            background: ${theme.light.bg_2};
            border: 1px solid ${theme.light.ui};
            border-radius: 8px;
            padding: 2rem;
        }
        .logo-demo {
            aspect-ratio: 16/9;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .color-swatch {
            width: 100%;
            height: 120px;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        h1 { font-size: 3rem; margin-bottom: 2rem; color: ${theme.light.pr}; }
        h2 { font-size: 2rem; margin-bottom: 1.5rem; }
        h3 { font-size: 1.25rem; margin-bottom: 1rem; }
        p { color: ${theme.light.tx_2}; margin-bottom: 1rem; }
        .brand-name { font-family: ${guidelines.typography.primary.family}; }
    </style>
</head>
<body>
    <div class="container">
        <header class="section">
            <h1>${guidelines.brand.name}</h1>
            <p>${guidelines.brand.description}</p>
        </header>

        <section class="section">
            <h2>Primary Logo</h2>
            <p>${guidelines.logo.primary}</p>
            <div class="grid grid-2">
                ${guidelines.logo.variations
                  .map(
                    (variant) => `
                    <div class="card">
                        <div class="logo-demo" style="background-color: ${variant.background};">
                            <span class="brand-name" style="color: ${variant.logo}; font-size: 2rem; font-weight: 600;">● ${guidelines.brand.name.toLowerCase()}</span>
                        </div>
                        <h3>${variant.name}</h3>
                        <p>${variant.description}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <section class="section">
            <h2>Symbol</h2>
            <p>${guidelines.symbol.description}</p>
            <div class="grid grid-4">
                ${guidelines.symbol.variations
                  .map(
                    (variant) => `
                    <div class="card">
                        <div class="logo-demo" style="background-color: ${variant.background};">
                            <div style="width: 60px; height: 60px; background-color: ${variant.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <div style="width: 8px; height: 8px; background-color: ${variant.background}; border-radius: 50%;"></div>
                            </div>
                        </div>
                        <h3>${variant.name}</h3>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <section class="section">
            <h2>Typography</h2>
            <div class="card">
                <h3>${guidelines.typography.primary.name}</h3>
                <p style="font-family: ${guidelines.typography.primary.family}; font-size: 2rem; line-height: 1.2; white-space: pre-line;">${guidelines.typography.primary.sample}</p>
            </div>
        </section>

        <section class="section">
            <h2>Primary Colour</h2>
            <p>${guidelines.colors.primary.description}</p>
            <div class="grid grid-4">
                ${guidelines.colors.primary.palette
                  .map(
                    (color) => `
                    <div class="card">
                        <div class="color-swatch" style="background-color: ${color.hex};"></div>
                        <h3>${color.name}</h3>
                        <p style="font-family: monospace;">${color.hex}</p>
                        <p>${color.usage}</p>
                    </div>
                `,
                  )
                  .join("")}
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
      component: BrandGuidelinesPreview,
    },
  };
