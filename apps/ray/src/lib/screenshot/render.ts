import type { ThemedToken } from "shiki";
import type { ReactElement } from "react";
import { createElement } from "react";
import { GRADIENTS } from "@/lib/gradients";

interface ScreenshotRenderOptions {
  tokens: ThemedToken[][];
  bg: string;
  bg2: string;
  fg: string;
  gradient: string;
  padding: number;
  fontSize: number;
  lineNumbers: boolean;
  title: string;
}

function resolveGradient(gradientId: string): string {
  const gradient = GRADIENTS.find((g) => g.id === gradientId);
  return gradient?.css ?? GRADIENTS[0].css;
}

export function buildScreenshotJsx(
  options: ScreenshotRenderOptions,
): ReactElement {
  const {
    tokens,
    bg,
    bg2,
    fg,
    gradient,
    padding,
    fontSize,
    lineNumbers,
    title,
  } = options;

  const gradientCss = resolveGradient(gradient);
  const lineCount = tokens.length;

  const lineNumberElements = lineNumbers
    ? createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "flex-end",
            paddingRight: 16,
            color: "rgba(255,255,255,0.2)",
            fontFamily: "Geist Mono",
            fontSize,
            lineHeight: 1.6,
          },
        },
        ...Array.from({ length: lineCount }, (_, i) =>
          createElement("span", { key: i }, String(i + 1)),
        ),
      )
    : null;

  const codeLines = tokens.map((line, lineIdx) =>
    createElement(
      "div",
      {
        key: lineIdx,
        style: {
          display: "flex",
          minHeight: `${fontSize * 1.6}px`,
        },
      },
      line.length === 0
        ? createElement("span", null, " ")
        : line.map((token, tokenIdx) =>
            createElement(
              "span",
              {
                key: tokenIdx,
                style: {
                  color: token.color || fg,
                  ...(token.fontStyle === 1
                    ? { fontStyle: "italic" as const }
                    : {}),
                  ...(token.fontStyle === 2
                    ? { fontWeight: "bold" as const }
                    : {}),
                },
              },
              token.content,
            ),
          ),
    ),
  );

  const trafficLights = createElement(
    "div",
    { style: { display: "flex", gap: 8, alignItems: "center" } },
    createElement("div", {
      style: {
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#FF5F57",
      },
    }),
    createElement("div", {
      style: {
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#FFBD2E",
      },
    }),
    createElement("div", {
      style: {
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#28C840",
      },
    }),
  );

  const titleElement = title
    ? createElement(
        "div",
        {
          style: {
            position: "absolute" as const,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Geist Mono",
            whiteSpace: "nowrap" as const,
          },
        },
        title,
      )
    : null;

  const windowChrome = createElement(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        height: 40,
        padding: "0 16px",
        background: bg2,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative" as const,
      },
    },
    trafficLights,
    titleElement,
  );

  return createElement(
    "div",
    {
      style: {
        display: "flex",
        padding: `${padding}px`,
        background:
          gradientCss === "transparent" ? "transparent" : gradientCss,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      },
    },
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column" as const,
          borderRadius: 12,
          overflow: "hidden" as const,
          boxShadow: "0 20px 68px rgba(0,0,0,0.55)",
          background: bg,
        },
      },
      windowChrome,
      createElement(
        "div",
        {
          style: {
            display: "flex",
            padding: "16px 24px",
            fontSize,
            fontFamily: "Geist Mono",
            lineHeight: 1.6,
            whiteSpace: "pre" as const,
          },
        },
        lineNumberElements,
        createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column" as const,
            },
          },
          ...codeLines,
        ),
      ),
    ),
  );
}
