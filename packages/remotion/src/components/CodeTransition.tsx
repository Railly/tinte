import React from "react";
import { interpolate } from "remotion";
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from "../lib/font";
import type { LighterResult, Token } from "@code-hike/lighter";

interface CodeTransitionProps {
  fromHighlighted: LighterResult | null;
  toHighlighted: LighterResult;
  progress: number;
  background: string;
  foreground: string;
}

function renderToken(token: Token, key: number, foreground: string) {
  return (
    <span
      key={key}
      style={{
        color: token.style.color ?? foreground,
        fontStyle: token.style.fontStyle,
        fontWeight: token.style.fontWeight,
        textDecoration: token.style.textDecoration,
      }}
    >
      {token.content}
    </span>
  );
}

export function CodeTransition({
  fromHighlighted,
  toHighlighted,
  progress,
  background,
  foreground,
}: CodeTransitionProps) {
  const toLines = toHighlighted.lines;
  const fromLines = fromHighlighted?.lines ?? [];

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE,
        lineHeight: `${FONT_SIZE * LINE_HEIGHT}px`,
        background,
        color: foreground,
        padding: "16px 0",
        whiteSpace: "pre",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {toLines.map((lineTokens, lineIdx) => {
        const hasFromLine = lineIdx < fromLines.length;
        const isNew = !hasFromLine;

        const opacity = isNew
          ? interpolate(progress, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;

        const translateY = isNew
          ? interpolate(progress, [0, 1], [8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {lineTokens.map((token, tokenIdx) =>
              renderToken(token as Token, tokenIdx, foreground),
            )}
          </div>
        );
      })}

      {fromLines.length > toLines.length &&
        fromLines.slice(toLines.length).map((lineTokens, i) => {
          const opacity = interpolate(progress, [0, 0.5], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`removed-${i}`}
              style={{ display: "flex", opacity }}
            >
              {(lineTokens as Token[]).map((token, tokenIdx) =>
                renderToken(token, tokenIdx, foreground),
              )}
            </div>
          );
        })}
    </div>
  );
}
