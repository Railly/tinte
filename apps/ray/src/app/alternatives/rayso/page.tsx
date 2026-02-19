import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
  description:
    "Looking for Ray.so alternatives with more themes and an API? Compare Ray by Tinte (500+ themes, free API), Snappify, Carbon.now.sh, and more.",
  keywords: [
    "ray.so alternative",
    "ray.so alternatives",
    "code screenshot tool",
    "beautiful code screenshots",
    "code to image",
    "raycast code screenshots",
  ],
  alternates: {
    canonical: "/alternatives/rayso",
  },
  openGraph: {
    title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Looking for Ray.so alternatives with more themes and an API? Compare Ray by Tinte (500+ themes, free API), Snappify, Carbon.now.sh, and more.",
    url: "https://ray.tinte.dev/alternatives/rayso",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Ray.so Alternatives for Code Screenshots (2026) | Ray",
    description:
      "Looking for Ray.so alternatives with more themes and an API? Compare Ray by Tinte (500+ themes, free API), Snappify, Carbon.now.sh, and more.",
  },
};

export default function RaysoAlternativesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many themes does ray.so have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ray.so offers 17 built-in themes. For comparison, Ray by Tinte offers 500+ themes and Carbon.now.sh has around 29.",
        },
      },
      {
        "@type": "Question",
        name: "Does ray.so have an API?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, ray.so does not offer an API. Ray by Tinte provides a free REST API at ray.tinte.dev/api/v1/screenshot with 60 requests per minute and no authentication required.",
        },
      },
      {
        "@type": "Question",
        name: "Can ray.so export to SVG?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, ray.so only exports to PNG. Ray by Tinte supports PNG, SVG, and clipboard copy. Snappify supports PNG, SVG, PDF, GIF, and MP4.",
        },
      },
      {
        "@type": "Question",
        name: "Is ray.so open source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, ray.so is closed source and maintained by Raycast. Open-source alternatives include Ray by Tinte and Carbon.now.sh.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-background text-foreground py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-blue-400 mb-8 inline-block"
          >
            ← Back to Ray
          </Link>

          <h1 className="text-3xl font-bold mb-8">
            Best Ray.so Alternatives for Code Screenshots (2026)
          </h1>

          <div className="space-y-6 text-muted-foreground mb-12">
            <p>
              Ray.so by Raycast is a clean, well-designed code screenshot tool.
              However, it's limited to 17 themes, PNG-only export, no API, and
              no AI integration.
            </p>
            <p>
              If you need more themes, SVG export, a REST API, or AI assistant
              support, these alternatives deliver.
            </p>
          </div>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Feature</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Ray by Tinte
                  </th>
                  <th className="text-left py-3 px-4 font-medium">ray.so</th>
                  <th className="text-left py-3 px-4 font-medium">Carbon</th>
                  <th className="text-left py-3 px-4 font-medium">Snappify</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Themes</td>
                  <td className="py-3 px-4">500+</td>
                  <td className="py-3 px-4">17</td>
                  <td className="py-3 px-4">~29</td>
                  <td className="py-3 px-4">~50</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Languages</td>
                  <td className="py-3 px-4">16</td>
                  <td className="py-3 px-4">50+</td>
                  <td className="py-3 px-4">~75</td>
                  <td className="py-3 px-4">90+</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Export formats</td>
                  <td className="py-3 px-4">PNG, SVG, Clipboard</td>
                  <td className="py-3 px-4">PNG</td>
                  <td className="py-3 px-4">PNG, SVG</td>
                  <td className="py-3 px-4">PNG, SVG, PDF, GIF</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">API</td>
                  <td className="py-3 px-4">Free (60 req/min)</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">Paid only</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">AI skill</td>
                  <td className="py-3 px-4">Claude, Cursor</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">No</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Price</td>
                  <td className="py-3 px-4">Free</td>
                  <td className="py-3 px-4">Free</td>
                  <td className="py-3 px-4">Free</td>
                  <td className="py-3 px-4">$0-32/mo</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Open source</td>
                  <td className="py-3 px-4">Yes</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">Yes</td>
                  <td className="py-3 px-4">No</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Status</td>
                  <td className="py-3 px-4">Active</td>
                  <td className="py-3 px-4">Active</td>
                  <td className="py-3 px-4">Dormant</td>
                  <td className="py-3 px-4">Active</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Ray by Tinte</h2>
              <p className="text-muted-foreground mb-4">
                Ray by Tinte offers 500+ themes, a free REST API (60
                requests/minute, no auth required), and native AI assistant
                support for Claude Code and Cursor. It's open source and
                actively maintained.
              </p>
              <p className="text-muted-foreground mb-4">
                Honest weakness: Ray supports 16 languages compared to ray.so's
                50+. If you need syntax highlighting for a niche language,
                ray.so might be better.
              </p>
              <Link
                href="https://ray.tinte.dev"
                className="text-blue-400 hover:underline"
              >
                Visit ray.tinte.dev →
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Snappify</h2>
              <p className="text-muted-foreground mb-4">
                Snappify is the most feature-rich alternative. It supports
                animations, exports to PNG/SVG/PDF/GIF/MP4, and has a VS Code
                plugin. Paid plans unlock advanced features like the API and
                team collaboration.
              </p>
              <Link
                href="https://snappify.com"
                className="text-blue-400 hover:underline"
              >
                Visit snappify.com →
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Carbon.now.sh</h2>
              <p className="text-muted-foreground mb-4">
                Carbon pioneered the code screenshot space and has 35.9K GitHub
                stars. It's open source and supports 75+ languages. However,
                it's been dormant since December 2024 with no recent updates.
              </p>
              <Link
                href="https://carbon.now.sh"
                className="text-blue-400 hover:underline"
              >
                Visit carbon.now.sh →
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. chalk.ist</h2>
              <p className="text-muted-foreground mb-4">
                Chalk.ist takes a different approach with Markdown-based code
                screenshots. If you prefer writing Markdown over using a GUI,
                this is worth exploring.
              </p>
              <Link
                href="https://chalk.ist"
                className="text-blue-400 hover:underline"
              >
                Visit chalk.ist →
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    How many themes does ray.so have?
                  </h3>
                  <p className="text-muted-foreground">
                    Ray.so offers 17 built-in themes. For comparison, Ray by
                    Tinte offers 500+ themes and Carbon.now.sh has around 29.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Does ray.so have an API?
                  </h3>
                  <p className="text-muted-foreground">
                    No, ray.so does not offer an API. Ray by Tinte provides a
                    free REST API at ray.tinte.dev/api/v1/screenshot with 60
                    requests per minute and no authentication required.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Can ray.so export to SVG?
                  </h3>
                  <p className="text-muted-foreground">
                    No, ray.so only exports to PNG. Ray by Tinte supports PNG,
                    SVG, and clipboard copy. Snappify supports PNG, SVG, PDF,
                    GIF, and MP4.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Is ray.so open source?
                  </h3>
                  <p className="text-muted-foreground">
                    No, ray.so is closed source and maintained by Raycast.
                    Open-source alternatives include Ray by Tinte and
                    Carbon.now.sh.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-border pt-12">
              <h2 className="text-xl font-semibold mb-4">
                Try Ray by Tinte
              </h2>
              <p className="text-muted-foreground mb-4">
                500+ themes, free API, and native AI assistant support. Start
                creating beautiful code screenshots now.
              </p>
              <Link
                href="/docs"
                className="text-blue-400 hover:underline"
              >
                Read the documentation →
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
