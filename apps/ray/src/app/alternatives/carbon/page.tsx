import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
  description:
    "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives: Ray by Tinte (500+ themes, free API), ray.so, Snappify, and more.",
  keywords: [
    "carbon.now.sh alternative",
    "carbon alternative",
    "code screenshot tool",
    "beautiful code screenshots",
    "code to image",
  ],
  alternates: {
    canonical: "/alternatives/carbon",
  },
  openGraph: {
    title:
      "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives: Ray by Tinte (500+ themes, free API), ray.so, Snappify, and more.",
    url: "https://ray.tinte.dev/alternatives/carbon",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Best Carbon.now.sh Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Carbon.now.sh has been dormant since December 2024. Compare the best alternatives: Ray by Tinte (500+ themes, free API), ray.so, Snappify, and more.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Carbon.now.sh still maintained?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Carbon.now.sh has not received updates since December 2024. While the tool still works, there are no new features, bug fixes, or security updates being released.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best free alternative to Carbon.now.sh?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte offers 500+ themes, PNG/SVG export, clipboard copy, and a free REST API. It's open source and actively maintained.",
      },
    },
    {
      "@type": "Question",
      name: "Which code screenshot tools have an API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte offers a free REST API at ray.tinte.dev/api/v1/screenshot with 60 requests per minute. Snappify also has an API but only on paid plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use code screenshot tools with AI coding assistants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ray by Tinte has a Claude Code and Cursor skill. Install with npx skills add Railly/tinte. No other code screenshot tool offers native AI assistant integration.",
      },
    },
  ],
};

export default function CarbonAlternativesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block mb-8"
        >
          ← Back to Ray
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          Best Carbon.now.sh Alternatives for Code Screenshots (2026)
        </h1>

        <div className="space-y-4 mb-10 text-muted-foreground leading-relaxed">
          <p>
            Carbon.now.sh pioneered beautiful code screenshots and earned
            35,900+ GitHub stars. However, the project has been dormant since
            December 2024 with no updates, open bugs, and no API.
          </p>
          <p>
            Whether you need more themes, an API for automation, or AI
            assistant integration, these alternatives have you covered.
          </p>
        </div>

        <div className="overflow-x-auto mb-12">
          <table className="w-full border border-border text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-left font-semibold bg-muted/80">
                  Ray by Tinte
                </th>
                <th className="px-4 py-3 text-left font-semibold">Carbon</th>
                <th className="px-4 py-3 text-left font-semibold">ray.so</th>
                <th className="px-4 py-3 text-left font-semibold">Snappify</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-3">Themes</td>
                <td className="px-4 py-3 bg-muted/30">500+</td>
                <td className="px-4 py-3">~29</td>
                <td className="px-4 py-3">17</td>
                <td className="px-4 py-3">~50</td>
              </tr>
              <tr className="border-t border-border bg-muted/20">
                <td className="px-4 py-3">Languages</td>
                <td className="px-4 py-3 bg-muted/30">16</td>
                <td className="px-4 py-3">~75</td>
                <td className="px-4 py-3">50+</td>
                <td className="px-4 py-3">90+</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3">Export formats</td>
                <td className="px-4 py-3 bg-muted/30">
                  PNG, SVG, Clipboard
                </td>
                <td className="px-4 py-3">PNG, SVG</td>
                <td className="px-4 py-3">PNG</td>
                <td className="px-4 py-3">PNG, SVG, PDF, GIF</td>
              </tr>
              <tr className="border-t border-border bg-muted/20">
                <td className="px-4 py-3">API</td>
                <td className="px-4 py-3 bg-muted/30">Free (60 req/min)</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">Paid only</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3">AI skill</td>
                <td className="px-4 py-3 bg-muted/30">Claude, Cursor</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">No</td>
              </tr>
              <tr className="border-t border-border bg-muted/20">
                <td className="px-4 py-3">Price</td>
                <td className="px-4 py-3 bg-muted/30">Free</td>
                <td className="px-4 py-3">Free</td>
                <td className="px-4 py-3">Free</td>
                <td className="px-4 py-3">$0-32/mo</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3">Open source</td>
                <td className="px-4 py-3 bg-muted/30">Yes</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">No</td>
              </tr>
              <tr className="border-t border-border bg-muted/20">
                <td className="px-4 py-3">Status</td>
                <td className="px-4 py-3 bg-muted/30">Active</td>
                <td className="px-4 py-3">Dormant</td>
                <td className="px-4 py-3">Active</td>
                <td className="px-4 py-3">Active</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-3">1. Ray by Tinte</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Ray by Tinte offers 500+ syntax highlighting themes powered by the
              Tinte theme generator, making it the most theme-rich code
              screenshot tool available. It includes a free REST API with 60
              requests per minute, native Claude Code and Cursor skills for AI
              assistant integration, and exports to PNG, SVG, or clipboard. Ray
              is fully open source and actively maintained. Honest weakness:
              fewer programming languages (16 compared to Carbon's 75), but
              covers all major languages like JavaScript, TypeScript, Python,
              Rust, Go, and more.
            </p>
            <a
              href="https://ray.tinte.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Try Ray by Tinte
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">2. Snappify</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Snappify is a feature-rich commercial tool that goes beyond static
              screenshots with animated code snippets, infographics, and
              presentation features. It supports 90+ languages, exports to PNG,
              SVG, PDF, and GIF, and offers a professional API. However, the API
              is only available on paid plans starting at $10/month, and the
              tool is not open source. Great for content creators and educators
              who need animation capabilities.
            </p>
            <a
              href="https://snappify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Visit Snappify
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">3. ray.so</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              ray.so is Raycast's official code screenshot tool with a clean,
              minimal interface and 17 curated themes. It supports 50+
              languages and integrates seamlessly with the Raycast launcher on
              macOS. The tool is free and actively maintained, but lacks an API
              and offers fewer theme options compared to Ray by Tinte. ray.so is
              not open source.
            </p>
            <a
              href="https://ray.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Visit ray.so
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">4. chalk.ist</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              chalk.ist is a markdown-based code screenshot tool that lets you
              create beautiful code images with simple markdown syntax. It's
              free, minimal, and great for quick screenshots. However, it lacks
              advanced features like an API, theme variety, or AI integration.
            </p>
            <a
              href="https://chalk.ist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Visit chalk.ist
            </a>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Is Carbon.now.sh still maintained?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Carbon.now.sh has not received updates since December 2024.
                While the tool still works, there are no new features, bug
                fixes, or security updates being released.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                What is the best free alternative to Carbon.now.sh?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ray by Tinte offers 500+ themes, PNG/SVG export, clipboard
                copy, and a free REST API. It's open source and actively
                maintained.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Which code screenshot tools have an API?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ray by Tinte offers a free REST API at
                ray.tinte.dev/api/v1/screenshot with 60 requests per minute.
                Snappify also has an API but only on paid plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Can I use code screenshot tools with AI coding assistants?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ray by Tinte has a Claude Code and Cursor skill. Install with
                npx skills add Railly/tinte. No other code screenshot tool
                offers native AI assistant integration.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-xl font-semibold mb-4">Try Ray by Tinte</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Ready to create beautiful code screenshots with 500+ themes and a
            free API? Ray by Tinte is open source, actively maintained, and
            built for developers.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="inline-block px-6 py-2.5 border border-border text-foreground font-medium rounded-md hover:bg-muted/30 transition-colors"
            >
              Explore the API
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
