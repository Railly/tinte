import type * as React from "react";

export function ElevenLabsIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 12 20"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M4 0H0V20H4V0Z" fill="currentColor" />
      <path d="M12 0H8V20H12V0Z" fill="currentColor" />
    </svg>
  );
}
