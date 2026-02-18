import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from "../lib/font";

interface TypingAnimationProps {
  text: string;
  charsPerSecond?: number;
  fps?: number;
  foreground: string;
  cursorColor: string;
  startFrame?: number;
}

export function TypingAnimation({
  text,
  charsPerSecond = 40,
  fps = 30,
  foreground,
  cursorColor,
  startFrame = 0,
}: TypingAnimationProps) {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = charsPerSecond / fps;
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length,
  );

  const cursorPeriodFrames = Math.round(fps * 0.53);
  const showCursor = Math.floor(elapsed / cursorPeriodFrames) % 2 === 0;

  const visible = text.slice(0, visibleChars);

  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE,
        lineHeight: `${FONT_SIZE * LINE_HEIGHT}px`,
        color: foreground,
        whiteSpace: "pre",
      }}
    >
      {visible}
      {showCursor && (
        <span style={{ color: cursorColor, fontWeight: 100 }}>|</span>
      )}
    </span>
  );
}
