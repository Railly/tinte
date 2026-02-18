import { cn } from "@/lib";

interface WindowsTerminalIconProps {
  className?: string;
}

export function WindowsTerminalIcon({ className }: WindowsTerminalIconProps) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      width="48"
      height="36"
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="wt-paint0_linear"
          x1="36.446201"
          y1="47.825699"
          x2="11.8217"
          y2="5.1747999"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0,-6)"
        >
          <stop stopColor="#333333" />
          <stop offset="1" stopColor="#4D4D4D" />
        </linearGradient>
        <linearGradient
          id="wt-paint1_linear"
          x1="14.5276"
          y1="33.995899"
          x2="10.4841"
          y2="26.992399"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#999999" />
          <stop offset="1" stopColor="#B3B3B3" />
        </linearGradient>
        <linearGradient
          id="wt-paint4_linear"
          x1="16.2747"
          y1="30.0336"
          x2="8.73699"
          y2="16.9781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CCCCCC" />
          <stop offset="1" stopColor="#E6E6E6" />
        </linearGradient>
        <linearGradient
          id="wt-paint5_linear"
          x1="35.149601"
          y1="39.955299"
          x2="28.850401"
          y2="29.044701"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CCCCCC" />
          <stop offset="1" stopColor="#E6E6E6" />
        </linearGradient>
      </defs>
      <path d="M 0,7 H 16 V 0 H 2 C 0.9,0 0,0.9 0,2 Z" fill="#cccccc" />
      <path d="M 32,0 H 16 v 7 h 16 z" fill="#999999" />
      <path d="M 48,7 H 32 V 0 h 14 c 1.1,0 2,0.9 2,2 z" fill="#666666" />
      <path
        d="M 46,36 H 2 C 0.9,36 0,35.1 0,34 V 6 h 48 v 28 c 0,1.1 -0.9,2 -2,2 z"
        fill="url(#wt-paint0_linear)"
      />
      <g transform="translate(0,-6)">
        <path
          d="m 15.2,24.3 -8.80001,8.8 c -0.5,0.5 -0.5,1.2 0,1.6 l 1.8,1.8 C 8.69999,37 9.4,37 9.8,36.5 l 8.8,-8.8 c 0.5,-0.5 0.5,-1.2 0,-1.6 l -1.8,-1.8 c -0.4,-0.4 -1.2,-0.4 -1.6,0 z"
          fill="url(#wt-paint1_linear)"
        />
        <path
          d="m 9.8,17.3 8.8,8.8 c 0.5,0.5 0.5,1.2 0,1.6 l -1.8,1.8 c -0.5,0.5 -1.2,0.5 -1.6,0 L 6.39999,20.7 c -0.5,-0.5 -0.5,-1.2 0,-1.6 l 1.8,-1.8 C 8.59999,16.9 9.4,16.9 9.8,17.3 Z"
          fill="url(#wt-paint4_linear)"
        />
      </g>
      <g transform="translate(0,-6)">
        <path
          d="M 40,32 H 24 c -0.6,0 -1,0.4 -1,1 v 3 c 0,0.6 0.4,1 1,1 h 16 c 0.6,0 1,-0.4 1,-1 v -3 c 0,-0.6 -0.4,-1 -1,-1 z"
          fill="url(#wt-paint5_linear)"
        />
      </g>
    </svg>
  );
}
