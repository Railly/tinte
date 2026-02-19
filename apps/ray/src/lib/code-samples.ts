export const LANGUAGES = [
  "tsx",
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "html",
  "css",
  "json",
  "bash",
  "sql",
  "java",
  "cpp",
  "ruby",
  "swift",
  "kotlin",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const CODE_SAMPLES: Record<Language, string> = {
  tsx: `import { cache } from "react"
import { db } from "@/lib/db"

type User = {
  id: string
  name: string
  email: string
}

const getUser = cache(async (id: string) => {
  return db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  })
})

export default async function Profile({ id }: { id: string }) {
  const user = await getUser(id)
  if (!user) return <div>Not found</div>

  return (
    <main className="p-8">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  )
}`,

  typescript: `interface Config {
  host: string
  port: number
  debug: boolean
}

function createServer(config: Config) {
  const { host, port, debug } = config

  if (debug) {
    console.log(\`Starting server at \${host}:\${port}\`)
  }

  return {
    listen: () => Bun.serve({
      port,
      hostname: host,
      fetch(req) {
        return new Response("OK")
      },
    }),
  }
}

const server = createServer({
  host: "localhost",
  port: 3000,
  debug: true,
})`,

  javascript: `async function fetchPosts(page = 1) {
  const res = await fetch(
    \`https://api.example.com/posts?page=\${page}\`
  )
  const { data, total } = await res.json()

  return {
    posts: data.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.body.slice(0, 120),
      date: new Date(post.created_at),
    })),
    hasMore: page * 10 < total,
  }
}

const { posts, hasMore } = await fetchPosts()
console.log(\`Loaded \${posts.length} posts\`)`,

  python: `from dataclasses import dataclass
from pathlib import Path
import json

@dataclass
class Theme:
    name: str
    bg: str
    fg: str
    accent: str

    def to_css(self) -> str:
        return f"""
:root {{
  --bg: {self.bg};
  --fg: {self.fg};
  --accent: {self.accent};
}}"""

def load_themes(path: Path) -> list[Theme]:
    data = json.loads(path.read_text())
    return [Theme(**t) for t in data["themes"]]

themes = load_themes(Path("themes.json"))
for theme in themes:
    print(f"Loaded: {theme.name}")`,

  rust: `use std::collections::HashMap;

#[derive(Debug, Clone)]
struct TokenBucket {
    capacity: u32,
    tokens: u32,
    refill_rate: u32,
}

impl TokenBucket {
    fn new(capacity: u32, refill_rate: u32) -> Self {
        Self { capacity, tokens: capacity, refill_rate }
    }

    fn try_consume(&mut self, n: u32) -> bool {
        if self.tokens >= n {
            self.tokens -= n;
            true
        } else {
            false
        }
    }

    fn refill(&mut self) {
        self.tokens = (self.tokens + self.refill_rate).min(self.capacity);
    }
}

fn main() {
    let mut limiters: HashMap<&str, TokenBucket> = HashMap::new();
    limiters.insert("api", TokenBucket::new(100, 10));
}`,

  go: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type HealthCheck struct {
	Status    string    \`json:"status"\`
	Uptime    string    \`json:"uptime"\`
	Timestamp time.Time \`json:"timestamp"\`
}

var startTime = time.Now()

func healthHandler(w http.ResponseWriter, r *http.Request) {
	health := HealthCheck{
		Status:    "ok",
		Uptime:    time.Since(startTime).String(),
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(health)
}

func main() {
	http.HandleFunc("/health", healthHandler)
	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ray - Code Screenshots</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header>
    <nav class="container">
      <a href="/" class="logo">ray.tinte.dev</a>
      <ul>
        <li><a href="/docs">Docs</a></li>
        <li><a href="/themes">Themes</a></li>
      </ul>
    </nav>
  </header>
  <main class="container">
    <h1>Beautiful code screenshots</h1>
    <p>Powered by 500+ tinte themes.</p>
  </main>
</body>
</html>`,

  css: `:root {
  --bg: #09090b;
  --fg: #fafafa;
  --accent: #3b82f6;
  --radius: 0.5rem;
}

* {
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: "Geist", system-ui, sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.card {
  background: color-mix(in oklch, var(--fg) 5%, transparent);
  border: 1px solid color-mix(in oklch, var(--fg) 10%, transparent);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--accent);
  }
}`,

  json: `{
  "name": "@tinte/core",
  "version": "2.0.0",
  "description": "Theme engine for code editors",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --dts --watch",
    "test": "bun test"
  },
  "dependencies": {
    "culori": "^4.0.1",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.7.0"
  }
}`,

  bash: `#!/bin/bash
set -euo pipefail

REPO="Railly/tinte"
BRANCH="main"
OUTPUT_DIR="./dist"

echo "Building $REPO@$BRANCH..."

if ! command -v bun &> /dev/null; then
  echo "Error: bun is required" >&2
  exit 1
fi

bun install --frozen-lockfile
bun run build

BUNDLE_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l | tr -d ' ')

echo ""
echo "Build complete:"
echo "  Files: $FILE_COUNT"
echo "  Size:  $BUNDLE_SIZE"
echo "  Output: $OUTPUT_DIR"`,

  sql: `CREATE TABLE themes (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(200) NOT NULL,
  author      VARCHAR(200),
  downloads   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_themes_slug ON themes (slug);
CREATE INDEX idx_themes_downloads ON themes (downloads DESC);

SELECT
  t.name,
  t.slug,
  t.downloads,
  COUNT(DISTINCT c.id) AS color_count,
  t.created_at
FROM themes t
LEFT JOIN colors c ON c.theme_id = t.id
GROUP BY t.id
ORDER BY t.downloads DESC
LIMIT 10;`,

  java: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record Theme(String name, String slug, Map<String, String> colors) {

    public String toCss() {
        return colors.entrySet().stream()
            .map(e -> "  --" + e.getKey() + ": " + e.getValue() + ";")
            .collect(Collectors.joining(
                "\\n", ":root {\\n", "\\n}"
            ));
    }

    public static List<Theme> filterDark(List<Theme> themes) {
        return themes.stream()
            .filter(t -> {
                String bg = t.colors().getOrDefault("bg", "#ffffff");
                return isColorDark(bg);
            })
            .toList();
    }

    private static boolean isColorDark(String hex) {
        int r = Integer.parseInt(hex.substring(1, 3), 16);
        int g = Integer.parseInt(hex.substring(3, 5), 16);
        int b = Integer.parseInt(hex.substring(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Color {
    uint8_t r, g, b;

    float luminance() const {
        float rs = r / 255.0f;
        float gs = g / 255.0f;
        float bs = b / 255.0f;
        return 0.2126f * rs + 0.7152f * gs + 0.0722f * bs;
    }

    float contrast_with(const Color& other) const {
        float l1 = std::max(luminance(), other.luminance());
        float l2 = std::min(luminance(), other.luminance());
        return (l1 + 0.05f) / (l2 + 0.05f);
    }
};

int main() {
    std::vector<Color> palette = {
        {9, 9, 11}, {250, 250, 250}, {59, 130, 246}
    };

    auto bg = palette[0];
    for (const auto& c : palette) {
        std::cout << "Contrast: " << bg.contrast_with(c) << std::endl;
    }
    return 0;
}`,

  ruby: `class ThemeEngine
  attr_reader :themes

  def initialize
    @themes = []
  end

  def register(name, **colors)
    theme = {
      name: name,
      slug: name.downcase.gsub(/\\s+/, "-"),
      colors: colors,
      created_at: Time.now
    }
    @themes << theme
    theme
  end

  def find(slug)
    @themes.find { |t| t[:slug] == slug }
  end

  def dark_themes
    @themes.select { |t| dark?(t[:colors][:bg]) }
  end

  private

  def dark?(hex)
    r, g, b = hex.scan(/[0-9a-f]{2}/i).map { |c| c.to_i(16) }
    (r * 299 + g * 587 + b * 114) / 1000 < 128
  end
end

engine = ThemeEngine.new
engine.register("One Hunter", bg: "#1e2127", fg: "#abb2bf")
puts engine.dark_themes.map { |t| t[:name] }`,

  swift: `import Foundation

struct Theme: Codable, Identifiable {
    let id: UUID
    let name: String
    let slug: String
    let colors: [String: String]

    var isDark: Bool {
        guard let bg = colors["bg"] else { return false }
        return luminance(of: bg) < 0.5
    }

    private func luminance(of hex: String) -> Double {
        let clean = hex.trimmingCharacters(in: ["#"])
        let scanner = Scanner(string: clean)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)

        let r = Double((rgb >> 16) & 0xFF) / 255.0
        let g = Double((rgb >> 8) & 0xFF) / 255.0
        let b = Double(rgb & 0xFF) / 255.0

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
}

let themes: [Theme] = try JSONDecoder()
    .decode([Theme].self, from: data)
let darkThemes = themes.filter(\\.isDark)
print("Found \\(darkThemes.count) dark themes")`,

  kotlin: `data class Theme(
    val name: String,
    val slug: String,
    val colors: Map<String, String>,
) {
    val isDark: Boolean
        get() = colors["bg"]?.let { luminance(it) < 0.5 } ?: false

    fun toCss(): String = buildString {
        appendLine(":root {")
        colors.forEach { (key, value) ->
            appendLine("  --$key: $value;")
        }
        appendLine("}")
    }

    private fun luminance(hex: String): Double {
        val color = hex.removePrefix("#").toLong(16)
        val r = (color shr 16 and 0xFF) / 255.0
        val g = (color shr 8 and 0xFF) / 255.0
        val b = (color and 0xFF) / 255.0
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
}

fun main() {
    val themes = loadThemes("themes.json")
    val dark = themes.filter { it.isDark }
    println("Dark themes: \${dark.map { it.name }}")
}`,
};

export const DEFAULT_CODE = CODE_SAMPLES.tsx;
