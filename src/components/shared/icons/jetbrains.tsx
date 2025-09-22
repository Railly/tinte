import { cn } from "@/lib";

interface JetBrainsIconProps {
  className?: string;
}

export function JetBrainsIcon({ className }: JetBrainsIconProps) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 257"
    >
      <defs>
        <linearGradient
          x1="25.2%"
          y1="43.3%"
          x2="99.2%"
          y2="67.4%"
          id="jetbrains-a"
        >
          <stop stopColor="#FE2857" offset="21%" />
          <stop stopColor="#293896" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="2.3%"
          y1="77.1%"
          x2="90.7%"
          y2="24.1%"
          id="jetbrains-b"
        >
          <stop stopColor="#FE2857" offset="0%" />
          <stop stopColor="#FE2857" offset="1%" />
          <stop stopColor="#FF318C" offset="86%" />
        </linearGradient>
        <linearGradient
          x1="6.3%"
          y1="13.9%"
          x2="94.6%"
          y2="87.7%"
          id="jetbrains-c"
        >
          <stop stopColor="#FF318C" offset="2%" />
          <stop stopColor="#FE2857" offset="21%" />
          <stop stopColor="#FDB60D" offset="86%" />
        </linearGradient>
        <linearGradient
          x1="91.1%"
          y1="27.7%"
          x2="2%"
          y2="68.6%"
          id="jetbrains-d"
        >
          <stop stopColor="#FDB60D" offset="1%" />
          <stop stopColor="#FCF84A" offset="86%" />
        </linearGradient>
      </defs>
      <path
        d="M112.7 117.4 42 57.6a25.6 25.6 0 1 0-24.8 43.9h.3l.7.2 89 27.1a6 6 0 0 0 2 .4 6.4 6.4 0 0 0 3.3-11.8Z"
        fill="url(#jetbrains-a)"
      />
      <path
        d="M126.8 18.7A18.6 18.6 0 0 0 98 3L11.8 55.4a25.6 25.6 0 1 0 30.6 41l77.3-63 .6-.5c4.1-3.6 6.5-8.7 6.5-14.2Z"
        fill="url(#jetbrains-b)"
      />
      <path
        d="M252.2 131.5 121.4 5.5A18.6 18.6 0 1 0 96 32.8l.2.3 139 117a12.6 12.6 0 0 0 17-18.6Z"
        fill="url(#jetbrains-c)"
      />
      <path
        d="M256 140.6a12.6 12.6 0 0 0-20-10.3L77.9 207.7a25.6 25.6 0 1 0 26.4 43.7l146.4-100.5c3.4-2.4 5.4-6.2 5.4-10.3Z"
        fill="url(#jetbrains-d)"
      />
      <path d="M75.8 76.9h102.5v102.4H75.8z" />
      <path
        d="M87 160.1h38.4v6.4H87v-6.4Zm-1.6-56.8 2.8-2.7c.6.9 1.5 1.4 2.6 1.5 1 0 1.8-.8 1.8-2.3v-10H97v10c.1 1.7-.5 3.4-1.6 4.6a6 6 0 0 1-4 1.7H91c-2 0-4-.9-5.4-2.5l-.2-.3ZM99 89.7h12.8v3.8h-8.5v2.4h7.6v3.4h-7.6v2.6h8.6v3.7h-13V89.7Zm19 3.9h-4.7v-3.9h14v3.9h-4.8v12.1h-4.4V93.6ZM87.3 112h7.5a6 6 0 0 1 4.4 1.4c.7.7 1 1.7 1 2.6 0 1.6-1 3-2.5 3.6 2 .4 3.3 2 3.2 4 0 2.8-2.2 4.5-6 4.5h-7.6v-16Zm8.5 5c0-1-.7-1.4-2-1.4h-2.2v2.8h2.1c1.4 0 2.1-.5 2.1-1.4Zm-1.5 4.5h-2.7v3h2.8c1.3 0 2-.6 2-1.5s-.5-1.4-1.8-1.5h-.3Zm17.1 6.6-3.2-4.8h-1.5v4.8h-4.4v-16h7.1a7 7 0 0 1 5.2 1.6 5 5 0 0 1 1.4 3.4v.4c.1 2.1-1.2 4.1-3.3 4.9l3.2 4.7 6.3-15.2h4.3l6.8 16.1h-4.8l-1.1-2.9h-6.2l-1.1 3h-8.7Zm13-11-1.9 4.6h3.6l-1.8-4.5ZM109 116h-2.3v3.8h2.4c1.4 0 2.4-.7 2.4-1.9 0-1.3-1-2-2.5-2Zm25-4h4.3v16H134v-16Zm6 0h4.2l5.7 8.6V112h4.4v16h-3.9l-6-8.8v8.8H140v-16Zm15 13.7 2.5-3a8.3 8.3 0 0 0 5.1 2c1.2 0 1.9-.4 1.9-1.1 0-.5-.3-.9-1.4-1.2l-.4-.2h-.3l-.7-.2h-.3l-.7-.2-.6-.2c-2.6-.8-4.4-1.9-4.4-4.6 0-3 2.4-5.1 6.2-5.1 2.4-.1 4.7.7 6.6 2.1l-2.2 3a7.8 7.8 0 0 0-4.4-1.5c-1.1 0-1.6.4-1.6 1s.3.9 1.3 1.2l.5.1.3.1.7.2c3.6.8 5.9 2 5.9 5 0 3.1-2.4 5-6 5h-.5c-2.5.2-5-.6-7-2l-.5-.4Z"
        fill="#FFF"
      />
    </svg>
  );
}
