export function BananaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient
          id="bananaGradient"
          x1="20"
          y1="20"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFE135" />
          <stop offset="50%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>
        <linearGradient
          id="bananaHighlight"
          x1="30"
          y1="25"
          x2="40"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFF8D" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFF8D" stopOpacity="0.2" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="2"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      {/* Main banana shape */}
      <path
        d="M25 75 Q30 85 40 80 Q50 75 60 65 Q70 55 75 45 Q80 35 75 25 Q70 15 60 20 Q50 25 45 35 Q40 45 35 55 Q30 65 25 75 Z"
        fill="url(#bananaGradient)"
        filter="url(#shadow)"
      />

      {/* Banana highlight */}
      <path
        d="M30 70 Q35 75 42 72 Q47 68 52 62 Q57 56 60 50 Q62 44 60 40 Q58 36 55 38 Q52 40 50 44 Q48 48 46 52 Q44 56 42 60 Q40 64 38 67 Q36 69 34 70 Q32 71 30 70 Z"
        fill="url(#bananaHighlight)"
      />

      {/* Banana curves/lines */}
      <path
        d="M32 72 Q45 68 58 52 Q68 38 65 28"
        stroke="#F57F17"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      <path
        d="M28 68 Q38 64 48 54 Q58 44 62 34"
        stroke="#F57F17"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Stem */}
      <ellipse
        cx="73"
        cy="28"
        rx="3"
        ry="6"
        fill="#4CAF50"
        transform="rotate(-25 73 28)"
      />

      {/* AI sparkle */}
      <g opacity="0.8">
        <circle cx="45" cy="45" r="1.5" fill="#FF6B35" />
        <path
          d="M45 40 L46 44 L50 45 L46 46 L45 50 L44 46 L40 45 L44 44 Z"
          fill="#FF6B35"
          opacity="0.6"
        />
      </g>

      {/* Tech elements */}
      <circle cx="55" cy="35" r="0.8" fill="#2196F3" opacity="0.7" />
      <circle cx="38" cy="58" r="0.8" fill="#9C27B0" opacity="0.7" />
    </svg>
  );
}
