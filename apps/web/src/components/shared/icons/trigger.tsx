import type * as React from "react";

export function TriggerIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.6889 52.2795L60.4195 20L106.839 100H14L32.7305 67.7195L45.9801 75.3312L40.5003 84.7756H80.3387L60.4195 50.4478L54.9396 59.8922L41.6889 52.2795Z"
        fill="url(#paint0_linear_173_117)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_173_117"
          x1="89.1675"
          y1="100"
          x2="88.3094"
          y2="43.5225"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41FF54" />
          <stop offset="1" stopColor="#E7FF52" />
        </linearGradient>
      </defs>
    </svg>
  );
}
