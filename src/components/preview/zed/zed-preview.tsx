import { FileCode2, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeContext } from "@/providers/theme";
import type { ZedThemeFamily } from "@/types/zed";

interface ZedPreviewProps {
  theme: ZedThemeFamily;
  className?: string;
}

export function ZedPreview({ theme, className }: ZedPreviewProps) {
  const { currentMode } = useThemeContext();
  const currentTheme =
    currentMode === "dark"
      ? theme.themes.find((t) => t.appearance === "dark") || theme.themes[0]
      : theme.themes.find((t) => t.appearance === "light") || theme.themes[0];

  const style = currentTheme.style;

  const codeExample = `src/app/page.tsx > async function Home()

import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeGrid } from "@/components/theme-grid";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";

export const metadata: Metadata = {
  title: "Tinte - Universal Theme Generator",
  description: "Convert themes between Rayso, TweakCN, VS Code, shadcn/ui, and more",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  const favoriteThemes = session
    ? await getUserFavoriteThemes(session.user.id, 6, session.user)
    : [];

  const publicThemes = await getPublicThemes(8);
  const tweakCNThemes = await getTweakCNThemes(8);
  const tinteThemes = await getTinteThemes(8);
  const raysoThemes = await getRaysoThemes(8);

  const pageSchema = generatePageSchema({
    title: "Multi-Platform Theme Generator & Converter",
    description: siteConfig.longDescription,
    url: siteConfig.url,
    type: "WebApplication",
  });

  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <main className="min-h-screen">
        <HeroSection />

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Popular Themes</h2>
          <ThemeGrid themes={publicThemes} />
        </section>

        {favoriteThemes.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">Your Favorites</h2>
            <ThemeGrid themes={favoriteThemes} />
          </section>
        )}

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">TweakCN Themes</h2>
          <ThemeGrid themes={tweakCNThemes} />
        </section>

        <FeatureSection />
      </main>
    </>
  );
}`;

  return (
    <div
      className={`rounded-lg overflow-hidden h-full flex flex-col ${className || ""}`}
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
      }}
    >
      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - File tree */}
        <div
          className="w-56 border-r flex flex-col shrink-0"
          style={{
            backgroundColor: style["panel.background"],
            borderColor: style["border.variant"],
          }}
        >
          {/* Sidebar header */}
          <div
            className="px-3 py-2 text-xs font-semibold border-b shrink-0"
            style={{
              color: style["text.muted"],
              borderColor: style["border.variant"],
            }}
          >
            PROJECT
          </div>

          {/* File tree */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="text-xs py-1">
              <div
                className="px-3 py-1.5 flex items-center gap-2"
                style={{ color: style.text }}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="font-medium">tinte</span>
              </div>
              <div className="pl-6">
                <div
                  className="px-3 py-1.5 flex items-center gap-2"
                  style={{ color: style["text.muted"] }}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>src</span>
                </div>
                <div className="pl-4">
                  <div
                    className="px-3 py-1.5 flex items-center gap-2"
                    style={{ color: style["text.muted"] }}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>app</span>
                  </div>
                  <div className="pl-4">
                    <div
                      className="px-3 py-1.5 flex items-center gap-2"
                      style={{
                        backgroundColor: style["element.selected"],
                        color: style.text,
                      }}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span className="font-medium">page.tsx</span>
                    </div>
                    <div
                      className="px-3 py-1.5 flex items-center gap-2"
                      style={{ color: style["text.muted"] }}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>layout.tsx</span>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1.5 flex items-center gap-2"
                    style={{ color: style["text.muted"] }}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>components</span>
                  </div>
                  <div
                    className="px-3 py-1.5 flex items-center gap-2"
                    style={{ color: style["text.muted"] }}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>lib</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Editor area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Tabs */}
          <div
            className="flex items-center border-b text-xs shrink-0"
            style={{
              backgroundColor: style["tab_bar.background"],
              borderColor: style["border.variant"],
            }}
          >
            <div
              className="px-4 py-2.5 flex items-center gap-2 border-r font-medium"
              style={{
                backgroundColor: style["tab.active_background"],
                borderColor: style["border.variant"],
                color: style.text,
              }}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>page.tsx</span>
            </div>
            <div
              className="px-4 py-2.5 flex items-center gap-2"
              style={{
                backgroundColor: style["tab.inactive_background"],
                color: style["text.muted"],
              }}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>layout.tsx</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div
            className="px-4 py-1.5 text-[11px] border-b font-mono shrink-0"
            style={{
              backgroundColor: style["editor.background"],
              borderColor: style["border.variant"],
              color: style["text.muted"],
            }}
          >
            src/app/page.tsx › async function Home()
          </div>

          {/* Code editor */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex min-h-full">
              {/* Line numbers */}
              <div
                className="w-12 py-3 text-[11px] text-right font-mono select-none border-r shrink-0"
                style={{
                  backgroundColor: style["editor.gutter.background"],
                  color: style["editor.line_number"],
                  borderColor: style["border.variant"],
                }}
              >
                {codeExample.split("\n").map((_, index) => (
                  <div
                    key={index}
                    className="px-2 leading-[1.6] h-[19.2px]"
                    style={{
                      color:
                        index === 13
                          ? style["editor.active_line_number"]
                          : style["editor.line_number"],
                      fontWeight: index === 13 ? 600 : 400,
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code content */}
              <div
                className="flex-1 py-3 px-4 font-mono text-[11px]"
                style={{
                  backgroundColor: style["editor.background"],
                  color: style["editor.foreground"],
                }}
              >
                <pre className="leading-[1.6]">
                  {codeExample.split("\n").map((line, index) => {
                    const isActiveLine = index === 13;
                    return (
                      <div
                        key={index}
                        className="h-[19.2px] px-2 -mx-2"
                        style={{
                          backgroundColor: isActiveLine
                            ? style["editor.active_line.background"]
                            : "transparent",
                        }}
                      >
                        {highlightLine(line, style.syntax)}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="h-7 px-4 flex items-center justify-between text-[11px] border-t shrink-0"
        style={{
          backgroundColor: style["status_bar.background"],
          borderColor: style["border.variant"],
          color: style["text.muted"],
        }}
      >
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-medium">TypeScript JSX</span>
          <span>UTF-8</span>
          <span>Ln 14, Col 16</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span
            className="flex items-center gap-1.5"
            style={{ color: style["version_control.modified"] }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />2
          </span>
          <span>74:1</span>
          <span className="uppercase tracking-wide">--INSERT--</span>
          <span className="uppercase tracking-wide">TSX</span>
        </div>
      </div>
    </div>
  );
}

function highlightLine(line: string, syntax: any): React.ReactNode {
  if (line.includes("src/app/page.tsx")) {
    return <span style={{ color: syntax.comment?.color }}>{line}</span>;
  }

  const keywords =
    /\b(import|export|from|const|let|var|async|await|function|return|if|else|default)\b/g;
  const types = /\b(Metadata)\b/g;
  const strings = /"([^"]*)"/g;
  const numbers = /\b(\d+)\b/g;
  const booleans = /\b(true|false|null|undefined)\b/g;
  const functions = /\b([a-z][a-zA-Z0-9]*)\s*\(/g;
  const properties = /\.([a-zA-Z][a-zA-Z0-9]*)\b/g;
  const jsxTagBrackets = /(<\/?|\/>|>)/g;
  const jsxTagNames = /<\/?([a-zA-Z][a-zA-Z0-9]*)/g;
  const jsxProps = /\b([a-z][a-zA-Z0-9]*(?:HTML)?)\s*=/g;
  const constants = /\b([a-z][a-zA-Z0-9]*(?:Schema|Themes|Section|Config))\b/g;
  const operators = /(=>|=|\?|:|\|\||&&)/g;

  const result = line;
  const tokens: Array<{
    start: number;
    end: number;
    element: React.ReactNode;
    priority: number;
  }> = [];

  let match;

  while ((match = strings.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: <span style={{ color: syntax.string?.color }}>{match[0]}</span>,
      priority: 10,
    });
  }

  while ((match = keywords.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <span
          style={{
            color: syntax.keyword?.color,
            fontWeight: syntax.keyword?.font_weight || undefined,
            fontStyle: syntax.keyword?.font_style || undefined,
          }}
        >
          {match[0]}
        </span>
      ),
      priority: 9,
    });
  }

  while ((match = types.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <span
          style={{
            color: syntax.type?.color,
            fontWeight: syntax.type?.font_weight || undefined,
            fontStyle: syntax.type?.font_style || undefined,
          }}
        >
          {match[0]}
        </span>
      ),
      priority: 8,
    });
  }

  while ((match = functions.exec(line)) !== null) {
    const funcName = match[1];
    tokens.push({
      start: match.index,
      end: match.index + funcName.length,
      element: (
        <span
          style={{
            color: syntax.function?.color,
            fontWeight: syntax.function?.font_weight || undefined,
            fontStyle: syntax.function?.font_style || undefined,
          }}
        >
          {funcName}
        </span>
      ),
      priority: 7,
    });
  }

  while ((match = properties.exec(line)) !== null) {
    const propName = match[1];
    tokens.push({
      start: match.index + 1,
      end: match.index + 1 + propName.length,
      element: (
        <span style={{ color: syntax.property?.color }}>{propName}</span>
      ),
      priority: 6,
    });
  }

  while ((match = jsxTagBrackets.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <span style={{ color: syntax.punctuation?.color }}>{match[0]}</span>
      ),
      priority: 9,
    });
  }

  while ((match = jsxTagNames.exec(line)) !== null) {
    const tagName = match[1];
    tokens.push({
      start: match.index + match[0].indexOf(tagName),
      end: match.index + match[0].indexOf(tagName) + tagName.length,
      element: <span style={{ color: syntax.tag?.color }}>{tagName}</span>,
      priority: 8,
    });
  }

  while ((match = jsxProps.exec(line)) !== null) {
    const propName = match[1];
    tokens.push({
      start: match.index,
      end: match.index + propName.length,
      element: (
        <span style={{ color: syntax.attribute?.color }}>{propName}</span>
      ),
      priority: 7,
    });
  }

  while ((match = numbers.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: <span style={{ color: syntax.number?.color }}>{match[0]}</span>,
      priority: 5,
    });
  }

  while ((match = booleans.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: <span style={{ color: syntax.boolean?.color }}>{match[0]}</span>,
      priority: 6,
    });
  }

  while ((match = constants.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <span style={{ color: syntax.constant?.color }}>{match[0]}</span>
      ),
      priority: 5,
    });
  }

  while ((match = operators.exec(line)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <span style={{ color: syntax.operator?.color }}>{match[0]}</span>
      ),
      priority: 4,
    });
  }

  tokens.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.priority - a.priority;
  });

  const filtered: typeof tokens = [];
  for (const token of tokens) {
    const overlaps = filtered.some(
      (existing) =>
        (token.start >= existing.start && token.start < existing.end) ||
        (token.end > existing.start && token.end <= existing.end),
    );
    if (!overlaps) {
      filtered.push(token);
    }
  }

  filtered.sort((a, b) => a.start - b.start);

  if (filtered.length === 0) {
    return line;
  }

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const token of filtered) {
    if (token.start > lastEnd) {
      parts.push(line.substring(lastEnd, token.start));
    }
    parts.push(token.element);
    lastEnd = token.end;
  }

  if (lastEnd < line.length) {
    parts.push(line.substring(lastEnd));
  }

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>{part}</span>
      ))}
    </>
  );
}

function highlightExpression(expr: string, syntax: any): React.ReactNode {
  return highlightLine(expr, syntax);
}
