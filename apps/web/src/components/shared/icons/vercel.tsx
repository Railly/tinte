import type * as React from "react";

export function VercelIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 256 222"
      width="256"
      height="222"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      className={className}
      {...props}
    >
      <title>Vercel Logo</title>
      <path fill="currentColor" d="m128 0 128 221.705H0z" />
    </svg>
  );
}
