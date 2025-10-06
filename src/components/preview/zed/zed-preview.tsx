import { FileCode2, FolderOpen } from "lucide-react";
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
        dangerouslySetInnerHTML={{`;

  return (
    <div
      className={`rounded-lg overflow-hidden h-full flex ${className || ""}`}
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
      }}
    >
      {/* Main content area */}
      <div className="flex h-full w-full">
        {/* Sidebar - File tree */}
        <div
          className="w-56 border-r flex flex-col"
          style={{
            backgroundColor: style["panel.background"],
            borderColor: style["border.variant"],
          }}
        >
          {/* Sidebar header */}
          <div
            className="px-3 py-2 text-xs font-semibold border-b"
            style={{
              color: style["text.muted"],
              borderColor: style["border.variant"],
            }}
          >
            PROJECT
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto text-xs">
            <div className="py-1">
              <div
                className="px-3 py-1.5 flex items-center gap-2 hover:bg-black/5"
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
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div
            className="flex items-center border-b text-xs"
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
            className="px-4 py-1.5 text-[11px] border-b font-mono"
            style={{
              backgroundColor: style["editor.background"],
              borderColor: style["border.variant"],
              color: style["text.muted"],
            }}
          >
            src/app/page.tsx › async function Home()
          </div>

          {/* Code editor */}
          <div className="flex flex-1 overflow-hidden">
            {/* Line numbers */}
            <div
              className="w-12 py-3 text-[11px] text-right font-mono select-none border-r"
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
              className="flex-1 py-3 px-4 overflow-auto font-mono text-[11px]"
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
        </div>
      </div>

      {/* Status bar */}
      <div
        className="h-7 px-4 flex items-center justify-between text-[11px] border-t"
        style={{
          backgroundColor: style["status_bar.background"],
          borderColor: style["border.variant"],
          color: style["text.muted"],
        }}
      >
        <div className="flex items-center gap-4">
          <span className="font-medium">TypeScript JSX</span>
          <span>UTF-8</span>
          <span>Ln 14, Col 16</span>
        </div>
        <div className="flex items-center gap-4">
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
  // Breadcrumb line
  if (line.includes("src/app/page.tsx")) {
    return <span style={{ color: syntax.comment?.color }}>{line}</span>;
  }

  // Const declarations
  if (line.includes("const ")) {
    const match = line.match(/(\s*)(const\s+)(\w+)(\s*=\s*)(.*)/);
    if (match) {
      const [, indent, constKw, varName, equals, rest] = match;
      return (
        <>
          <span>{indent}</span>
          <span style={{ color: syntax.keyword?.color }}>{constKw}</span>
          <span style={{ color: syntax.variable?.color }}>{varName}</span>
          <span>{equals}</span>
          {highlightExpression(rest, syntax)}
        </>
      );
    }
  }

  // Function calls
  if (
    line.includes("await get") ||
    line.includes("await getUserFavoriteThemes")
  ) {
    const parts = line.split(/(\bawait\b|\bget\w+)/);
    return (
      <>
        {parts.map((part, i) => {
          if (part === "await") {
            return (
              <span key={i} style={{ color: syntax.keyword?.color }}>
                {part}
              </span>
            );
          } else if (part.match(/^get\w+/)) {
            return (
              <span key={i} style={{ color: syntax.function?.color }}>
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  }

  // Return statement
  if (line.trim() === "return (") {
    return (
      <>
        <span>{"  "}</span>
        <span style={{ color: syntax.keyword?.color }}>return</span>
        <span> (</span>
      </>
    );
  }

  // JSX/HTML tags
  if (line.includes("<script") || line.includes("dangerouslySetInnerHTML")) {
    const parts = line.split(/(<\/?script>?|type=|dangerouslySetInnerHTML=)/);
    return (
      <>
        {parts.map((part, i) => {
          if (part.match(/<\/?script>?/)) {
            return (
              <span key={i} style={{ color: syntax.tag?.color }}>
                {part}
              </span>
            );
          } else if (part === "type=" || part === "dangerouslySetInnerHTML=") {
            return (
              <span key={i} style={{ color: syntax.property?.color }}>
                {part}
              </span>
            );
          } else if (part.match(/^"[^"]*"$/)) {
            return (
              <span key={i} style={{ color: syntax.string?.color }}>
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  }

  // Comments
  if (line.trim().startsWith("//")) {
    return (
      <span style={{ color: syntax.comment?.color, fontStyle: "italic" }}>
        {line}
      </span>
    );
  }

  // Empty lines or plain brackets
  if (
    line.trim() === "" ||
    line.trim() === "<>" ||
    line.trim().match(/^[(){}[\];,]*$/)
  ) {
    return line;
  }

  return line;
}

function highlightExpression(expr: string, syntax: any): React.ReactNode {
  // Session check
  if (expr.includes("session")) {
    return (
      <>
        <span style={{ color: syntax.variable?.color }}>session</span>
        {expr.substring(7)}
      </>
    );
  }

  // Function calls
  if (expr.match(/^\s*await\s+\w+/)) {
    const parts = expr.split(/(\bawait\b|\w+\()/);
    return (
      <>
        {parts.map((part, i) => {
          if (part === "await") {
            return (
              <span key={i} style={{ color: syntax.keyword?.color }}>
                {part}
              </span>
            );
          } else if (part.match(/^\w+\($/)) {
            return (
              <span key={i} style={{ color: syntax.function?.color }}>
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  }

  // Numbers
  if (expr.match(/^\d+/)) {
    return <span style={{ color: syntax.number?.color }}>{expr}</span>;
  }

  // Function call
  if (
    expr.includes("generatePageSchema") ||
    expr.includes("generateOrganizationSchema")
  ) {
    const match = expr.match(/(\w+)(\()/);
    if (match) {
      return (
        <>
          <span style={{ color: syntax.function?.color }}>{match[1]}</span>
          <span>{match[2]}</span>
        </>
      );
    }
  }

  return expr;
}
