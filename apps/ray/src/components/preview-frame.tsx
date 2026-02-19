import type { KeyboardEvent } from "react";
import { forwardRef, useCallback, useMemo } from "react";
import { WindowChrome } from "./window-chrome";

interface PreviewFrameProps {
  padding: number;
  gradientCss: string;
  themeBg: string;
  themeBg2: string;
  title: string;
  onTitleChange: (title: string) => void;
  fontSize: number;
  cssVariables: string;
  highlightedHtml: string;
  loading: boolean;
  code: string;
  onCodeChange: (code: string) => void;
  lineNumbers: boolean;
}

export const PreviewFrame = forwardRef<HTMLDivElement, PreviewFrameProps>(
  (
    {
      padding,
      gradientCss,
      themeBg,
      themeBg2,
      title,
      onTitleChange,
      fontSize,
      cssVariables,
      highlightedHtml,
      loading,
      code,
      onCodeChange,
      lineNumbers,
    },
    ref,
  ) => {
    const codeHtml = useMemo(() => {
      if (loading) return "";
      const varEntries = cssVariables
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("--"))
        .join(" ");
      return `<div style="${varEntries}">${highlightedHtml}</div>`;
    }, [cssVariables, highlightedHtml, loading]);

    const lineCount = code.split("\n").length;

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const target = e.currentTarget;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const newValue = `${code.substring(0, start)}  ${code.substring(end)}`;
          onCodeChange(newValue);
          requestAnimationFrame(() => {
            target.selectionStart = start + 2;
            target.selectionEnd = start + 2;
          });
        }
      },
      [code, onCodeChange],
    );

    const monoFont =
      "var(--font-geist-mono), 'Geist Mono', 'Fira Code', Menlo, monospace";

    return (
      <div
        ref={ref}
        style={{
          padding: `${padding}px`,
          background: gradientCss,
          display: "inline-block",
        }}
      >
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 68px rgba(0,0,0,0.55)",
            background: themeBg,
          }}
        >
          <WindowChrome title={title} onTitleChange={onTitleChange} bg={themeBg2} />
          <div
            style={{
              display: "flex",
              padding: "16px 24px",
              fontSize,
              fontFamily: monoFont,
              lineHeight: 1.6,
              position: "relative",
              minWidth: 400,
            }}
          >
            {lineNumbers && (
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  paddingRight: 16,
                  userSelect: "none",
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: monoFont,
                  fontSize,
                  lineHeight: 1.6,
                }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
            )}

            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              {loading ? (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                  Highlighting...
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
              )}

              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  color: "transparent",
                  caretColor: "rgba(255,255,255,0.8)",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: monoFont,
                  fontSize,
                  lineHeight: 1.6,
                  padding: 0,
                  margin: 0,
                  overflow: "hidden",
                  whiteSpace: "pre",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PreviewFrame.displayName = "PreviewFrame";
