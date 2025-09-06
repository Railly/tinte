import { cn } from "@/lib";

interface AlacrittyIconProps {
  className?: string;
}

export function AlacrittyIcon({ className }: AlacrittyIconProps) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      version="1.1"
      xmlSpace="preserve"
      style={{
        clipRule: "evenodd",
        fillRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.41420996,
      }}
    >
      <defs>
        <linearGradient
          id="red-orange"
          x1="0.025171699"
          y1="0.079489581"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0,473.895,-473.895,0,547.884,192.222)"
        >
          <stop offset="0" style={{ stopColor: "#ec2802", stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: "#fcb200", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient
          xlinkHref="#red-orange"
          id="linearGradient11006"
          x1="19.0625"
          y1="0"
          x2="19"
          y2="43.25"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(1.4018804,0,0,1.3482131,21.364273,-32.960592)"
        />
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath3639">
          <path
            d="M 14.813062,26.75 19,15.945 23.186938,26.75 19,43.25 Z"
            style={{
              fill: "none",
              stroke: "#000000",
              strokeWidth: 0.03779528,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 1.41420996,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          />
        </clipPath>
        <filter
          style={{ colorInterpolation: "sRGB" }}
          id="filter1378"
          x="-0.096199476"
          width="1.192399"
          y="-0.074239448"
          height="1.1484789"
        >
          <feGaussianBlur stdDeviation="1.0020779" />
        </filter>
      </defs>
      <g style={{ display: "inline" }} transform="translate(-16,35.820639)">
        <g>
          <path
            clipPath="none"
            d="M 43.566236,2.9721345 42.175119,6.3426951 C 45.913195,17.853356 45.913195,17.853356 48,27.894557 50.086805,17.853356 50.086805,17.853356 53.824881,6.3426951 L 52.433764,2.9721345 48,-7.7705098 Z"
            style={{
              clipRule: "evenodd",
              fill: "#069efe",
              fillOpacity: 1,
              fillRule: "evenodd",
              stroke: "none",
              strokeWidth: 0.26960364,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 1.41420996,
              strokeDasharray: "none",
              strokeOpacity: 0.4330357,
              paintOrder: "stroke markers fill",
            }}
          />
          <path
            d="m 43.09342,-32.960595 h 9.81316 l 21.729148,53.92852 H 65.523505 L 48,-20.221038 30.476495,20.967925 h -9.112223 z"
            style={{
              clipRule: "evenodd",
              fill: "url(#linearGradient11006)",
              fillOpacity: 1,
              fillRule: "evenodd",
              strokeWidth: 0,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 1.41420996,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          />
          <path
            transform="matrix(1.3912031,0,0,1.3379446,21.567141,-29.104025)"
            clipPath="url(#clipPath3639)"
            style={{
              clipRule: "evenodd",
              display: "inline",
              fill: "#ffffff",
              fillOpacity: 1,
              fillRule: "evenodd",
              stroke: "none",
              strokeWidth: 0,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 0,
              strokeDasharray: "none",
              strokeDashoffset: 0,
              strokeOpacity: 1,
              paintOrder: "markers fill stroke",
              filter: "url(#filter1378)",
            }}
            d="M 19,32.395 31.5,0 6.5,0.13313911 Z"
          />
        </g>
      </g>
    </svg>
  );
}
