import React from "react";
import { FONT_FAMILY } from "../lib/font";

interface FileTabProps {
  fileName: string;
  filePath: string[];
  foreground: string;
  mutedForeground: string;
}

export function FileTab({
  fileName,
  filePath,
  foreground,
  mutedForeground,
}: FileTabProps) {
  const allSegments = [...filePath, fileName];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        color: mutedForeground,
      }}
    >
      {allSegments.map((segment, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ opacity: 0.5, fontSize: 10 }}>/</span>
          )}
          <span
            style={{
              color: i === allSegments.length - 1 ? foreground : mutedForeground,
              fontWeight: i === allSegments.length - 1 ? 500 : 400,
            }}
          >
            {segment}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
