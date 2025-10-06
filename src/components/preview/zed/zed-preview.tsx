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

  const codeExample = `import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserProfile({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={handleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}`;

  const style = currentTheme.style;

  return (
    <div
      className={`rounded-lg border overflow-hidden ${className || ""}`}
      style={{
        backgroundColor: style.background,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {/* Title bar */}
      <div
        className="px-4 py-2 border-b flex items-center justify-between text-xs"
        style={{
          backgroundColor: style["title_bar.background"],
          borderColor: style["border.variant"],
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span style={{ color: style["text.muted"] }}>UserProfile.tsx</span>
        </div>
        <span style={{ color: style["text.muted"] }}>Zed Editor</span>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center text-xs border-b"
        style={{
          backgroundColor: style["tab_bar.background"],
          borderColor: style["border.variant"],
        }}
      >
        <div
          className="px-4 py-2 border-r"
          style={{
            backgroundColor: style["tab.active_background"],
            borderColor: style["border.variant"],
          }}
        >
          <span style={{ color: style.text }}>UserProfile.tsx</span>
        </div>
        <div
          className="px-4 py-2"
          style={{
            backgroundColor: style["tab.inactive_background"],
            color: style["text.muted"],
          }}
        >
          index.ts
        </div>
      </div>

      {/* Editor */}
      <div className="flex h-96">
        {/* Gutter with line numbers */}
        <div
          className="px-3 py-4 text-xs text-right font-mono select-none border-r"
          style={{
            backgroundColor: style["editor.gutter.background"],
            color: style["editor.line_number"],
            borderColor: style["border.variant"],
          }}
        >
          {codeExample.split("\n").map((_, index) => (
            <div
              key={index}
              className="leading-relaxed"
              style={{
                color:
                  index === 8
                    ? style["editor.active_line_number"]
                    : style["editor.line_number"],
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code area */}
        <div
          className="flex-1 p-4 overflow-hidden font-mono text-sm"
          style={{
            backgroundColor: style["editor.background"],
            color: style["editor.foreground"],
          }}
        >
          <pre className="whitespace-pre-wrap leading-relaxed">
            {codeExample.split("\n").map((line, index) => {
              const isActiveLine = index === 8;
              return (
                <div
                  key={index}
                  className="px-2 -mx-2"
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

      {/* Status bar */}
      <div
        className="px-4 py-1.5 text-xs flex items-center justify-between border-t"
        style={{
          backgroundColor: style["status_bar.background"],
          borderColor: style["border.variant"],
          color: style["text.muted"],
        }}
      >
        <div className="flex items-center gap-4">
          <span>TypeScript React</span>
          <span>UTF-8</span>
          <span>Ln 9, Col 21</span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: style["version_control.modified"] }}>●</span>
          <span>{currentMode}</span>
        </div>
      </div>
    </div>
  );
}

function highlightLine(line: string, syntax: any): React.ReactNode {
  // Import statement
  if (line.includes("import")) {
    const parts = line.split(/(\bimport\b|\bfrom\b|['"][^'"]*['"])/);
    return (
      <>
        {parts.map((part, i) => {
          if (part === "import" || part === "from") {
            return (
              <span key={i} style={{ color: syntax.keyword?.color }}>
                {part}
              </span>
            );
          } else if (part.match(/^['"].*['"]$/)) {
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

  // Interface
  if (line.includes("interface")) {
    const parts = line.split(/(\binterface\b)/);
    return (
      <>
        {parts.map((part, i) =>
          part === "interface" ? (
            <span key={i} style={{ color: syntax.keyword?.color }}>
              {part}
            </span>
          ) : (
            <span key={i} style={{ color: syntax.type?.color }}>
              {part}
            </span>
          ),
        )}
      </>
    );
  }

  // Type annotations
  if (
    line.includes(": ") &&
    (line.includes("number") || line.includes("string"))
  ) {
    const parts = line.split(/(\b(?:number|string|boolean)\b)/);
    return (
      <>
        {parts.map((part, i) =>
          ["number", "string", "boolean"].includes(part) ? (
            <span key={i} style={{ color: syntax.type?.color }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  }

  // Export function
  if (line.includes("export function")) {
    const parts = line.split(/(\bexport\b|\bfunction\b)/);
    return (
      <>
        {parts.map((part, i) =>
          part === "export" || part === "function" ? (
            <span key={i} style={{ color: syntax.keyword?.color }}>
              {part}
            </span>
          ) : (
            <span key={i} style={{ color: syntax.function?.color }}>
              {part}
            </span>
          ),
        )}
      </>
    );
  }

  // const/let/var
  if (line.includes("const ") || line.includes("useState")) {
    const parts = line.split(/(\bconst\b|\buseState\b)/);
    return (
      <>
        {parts.map((part, i) => {
          if (part === "const") {
            return (
              <span key={i} style={{ color: syntax.keyword?.color }}>
                {part}
              </span>
            );
          } else if (part === "useState") {
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

  // Comments
  if (line.trim().startsWith("//")) {
    return (
      <span style={{ color: syntax.comment?.color, fontStyle: "italic" }}>
        {line}
      </span>
    );
  }

  // Return statement
  if (line.includes("return")) {
    const parts = line.split(/(\breturn\b)/);
    return (
      <>
        {parts.map((part, i) =>
          part === "return" ? (
            <span key={i} style={{ color: syntax.keyword?.color }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  }

  // JSX tags
  if (line.includes("<") && line.includes(">")) {
    const parts = line.split(/(<\/?[\w]+>?|className=|onClick=)/);
    return (
      <>
        {parts.map((part, i) => {
          if (part.match(/<\/?[\w]+>?/)) {
            return (
              <span key={i} style={{ color: syntax.tag?.color }}>
                {part}
              </span>
            );
          } else if (part === "className=" || part === "onClick=") {
            return (
              <span key={i} style={{ color: syntax.property?.color }}>
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  }

  // Strings
  if (line.includes("'") || line.includes('"')) {
    const parts = line.split(/(['"][^'"]*['"])/);
    return (
      <>
        {parts.map((part, i) =>
          part.match(/^['"].*['"]$/) ? (
            <span key={i} style={{ color: syntax.string?.color }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  }

  // Boolean
  if (line.includes("true") || line.includes("false")) {
    const parts = line.split(/(\btrue\b|\bfalse\b)/);
    return (
      <>
        {parts.map((part, i) =>
          part === "true" || part === "false" ? (
            <span key={i} style={{ color: syntax.boolean?.color }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  }

  return line;
}
