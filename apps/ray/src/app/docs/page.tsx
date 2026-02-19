import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Code Screenshot API - Free REST API | Ray by Tinte",
  description:
    "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output. No authentication required. 60 requests per minute.",
  keywords: [
    "code screenshot API",
    "programmatic code screenshots",
    "code to image API",
    "code screenshot REST API",
    "automated code screenshots",
  ],
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Code Screenshot API - Free REST API | Ray by Tinte",
    description:
      "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output.",
    url: "https://ray.tinte.dev/docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Screenshot API - Free REST API | Ray by Tinte",
    description:
      "Generate beautiful code screenshots programmatically. Free REST API with 500+ themes, 16 languages, PNG output.",
  },
};

export default function DocsPage() {
  const languages = [
    "TSX",
    "TypeScript",
    "JavaScript",
    "Python",
    "Rust",
    "Go",
    "HTML",
    "CSS",
    "JSON",
    "Bash",
    "SQL",
    "Java",
    "C++",
    "Ruby",
    "Swift",
    "Kotlin",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebAPI",
            name: "Ray Code Screenshot API",
            url: "https://ray.tinte.dev/api/v1/screenshot",
            description:
              "Generate beautiful code screenshots programmatically with 500+ themes",
            documentation: "https://ray.tinte.dev/docs",
            provider: {
              "@type": "Organization",
              name: "Tinte",
              url: "https://tinte.dev",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-background text-foreground py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="text-4xl font-bold mt-8 mb-4">Code Screenshot API</h1>
          <p className="text-lg text-zinc-400 mb-12">
            Generate beautiful code screenshots programmatically. Free, no
            authentication required.
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto mb-4">
              <pre className="whitespace-pre">{`curl -X POST https://ray.tinte.dev/api/v1/screenshot \\
  -H 'Content-Type: application/json' \\
  -d '{
    "code": "console.log(\\"Hello, World!\\")",
    "language": "javascript",
    "theme": "one-hunter"
  }' -o screenshot.png`}</pre>
            </div>
            <p className="text-zinc-400">Returns a PNG image.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Parameters</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 font-semibold">
                      Parameter
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Required
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">code</td>
                    <td className="py-3 px-4 text-zinc-400">string</td>
                    <td className="py-3 px-4 text-zinc-400">Yes</td>
                    <td className="py-3 px-4 text-zinc-400">-</td>
                    <td className="py-3 px-4 text-zinc-400">
                      The code to screenshot
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">language</td>
                    <td className="py-3 px-4 text-zinc-400">string</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">"typescript"</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Syntax highlighting language
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">theme</td>
                    <td className="py-3 px-4 text-zinc-400">string</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">"one-hunter"</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Theme slug from tinte.dev or inline TinteBlock
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">mode</td>
                    <td className="py-3 px-4 text-zinc-400">
                      "dark" | "light"
                    </td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">"dark"</td>
                    <td className="py-3 px-4 text-zinc-400">Color scheme</td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">padding</td>
                    <td className="py-3 px-4 text-zinc-400">number</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">32</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Outer padding in pixels (0-256)
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">fontSize</td>
                    <td className="py-3 px-4 text-zinc-400">number</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">14</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Font size in pixels (8-32)
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">lineNumbers</td>
                    <td className="py-3 px-4 text-zinc-400">boolean</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">true</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Show line numbers
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">title</td>
                    <td className="py-3 px-4 text-zinc-400">string</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">""</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Window title bar text
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">background</td>
                    <td className="py-3 px-4 text-zinc-400">string</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">"midnight"</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Background preset: midnight, sunset, ocean, forest, ember,
                      steel, aurora, none
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 px-4 font-mono text-sm">scale</td>
                    <td className="py-3 px-4 text-zinc-400">number</td>
                    <td className="py-3 px-4 text-zinc-400">No</td>
                    <td className="py-3 px-4 text-zinc-400">2</td>
                    <td className="py-3 px-4 text-zinc-400">
                      Resolution multiplier (1-4x)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">
              Supported Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Themes</h2>
            <p className="text-zinc-400 mb-2">
              Choose from 500+ themes. Browse the full collection at
              tinte.dev/themes.
            </p>
            <p className="text-zinc-400">
              Pass any theme slug as the <code className="text-zinc-300">theme</code> parameter, or provide an inline TinteBlock object for
              custom themes.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Code Examples</h2>

            <h3 className="text-xl font-semibold mb-3">JavaScript / Node.js</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto mb-8">
              <pre className="whitespace-pre">{`const res = await fetch("https://ray.tinte.dev/api/v1/screenshot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: 'console.log("Hello")',
    language: "javascript",
    theme: "one-hunter",
  }),
});
const blob = await res.blob();`}</pre>
            </div>

            <h3 className="text-xl font-semibold mb-3">Python</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
              <pre className="whitespace-pre">{`import requests

res = requests.post("https://ray.tinte.dev/api/v1/screenshot", json={
    "code": "print('Hello')",
    "language": "python",
    "theme": "one-hunter",
})
with open("screenshot.png", "wb") as f:
    f.write(res.content)`}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">
              AI Agent Integration
            </h2>
            <p className="text-zinc-400 mb-4">
              Ray works natively with Claude Code, Cursor, and 40+ AI agents
              via the skills protocol.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto mb-4">
              <pre className="whitespace-pre">npx skills add Railly/tinte</pre>
            </div>
            <p className="text-zinc-400">
              Once installed, just ask your AI assistant to take a code
              screenshot.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
            <p className="text-zinc-400 mb-2">
              60 requests per minute per IP address. No authentication required.
            </p>
            <p className="text-zinc-400">
              Check your current usage:{" "}
              <code className="text-zinc-300">GET /api/v1/ratelimit-status</code>
            </p>
          </section>

          <div className="flex gap-4">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              Try it now
            </Link>
            <Link
              href="/alternatives/carbon"
              className="inline-block px-6 py-3 border border-zinc-700 text-white rounded-lg font-semibold hover:bg-zinc-900 transition-colors"
            >
              View alternatives
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
