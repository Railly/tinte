const COLORS = {
  gold: {
    light: "#FFD700",
    dark: "#FFD700",
  },
  grayscale: {
    light: "#000000",
    dark: "#FFFFFF",
  },
} as const;

export function CrafterStationLogo({
  className,
  variant = "icon",
  colorScheme = "gold",
  mode = "light",
}: {
  className?: string;
  variant?: "icon" | "wordmark" | "logo";
  colorScheme?: "gold" | "grayscale";
  mode?: "dark" | "light";
}) {
  const iconColor = COLORS[colorScheme][mode];
  const wordmarkColor = COLORS[colorScheme][mode];

  // Icon path (the CS symbol)
  const iconPath = (
    <path
      d="M118.238 16.262C111.482 11.4 99.9003 5.62505 92.2517 3.26931C74.9754 -2.31209 61.2312 0.473844 52.1188 3.50057C34.3839 9.3909 23.1637 17.3398 12.9798 32.0237C-3.018 54.7384 -1.30627 92.0001 17.4396 113.282C21.6313 118.385 23.9203 117.58 40.6062 105.794C41.1838 105.243 38.9626 101.57 35.6118 97.3194C28.0736 87.6862 23.7841 70.2632 26.209 60.5011C34.074 29.8239 72.1683 13.8835 96.3841 31.0488C101.735 34.7695 118.578 50.1432 133.719 65.2112C156.435 87.3932 163.188 92.535 168.887 92.0615C174.586 91.588 176.608 89.6589 177.27 83.5096C178.226 76.8049 175.724 72.8474 162.814 60.893C154.116 52.642 147.113 45.2566 147.134 43.8571C147.151 42.7375 153.199 38.0697 160.665 33.7035C208.922 4.47877 259.519 64.8793 219.089 103.462C213.891 108.422 204.705 113.602 198.705 115.191C191.85 116.767 160.245 117.687 120.978 117.092C47.5669 115.979 43.5706 116.758 23.9629 133.539C-1.12747 155.276 -7.39134 192.976 9.54962 220.67C31.485 256.839 79.721 266.529 114.252 241.576L126.916 232.249L141.283 241.986C164.663 258.018 183.68 261.387 206.842 254.179C253.172 239.483 271.118 182.082 241.827 143.002C238.477 138.752 236.774 138.446 232.187 140.616C218.126 148.242 218.419 147.686 226.416 164.606C232.48 177.576 233.542 182.632 231.971 192.407C227.614 216.978 208.584 233.207 184.682 232.845C166.187 232.564 160.267 228.835 126.619 195.569C108.947 178.502 92.6562 164.257 90.3799 164.222C86.1118 164.158 76.8749 172.697 76.8113 176.895C76.7943 178.015 84.341 187.088 93.8711 196.752L110.969 214.089L100.607 221.771C64.0584 248.374 13.049 215.124 25.6449 172.76C29.5392 159.94 42.8446 145.864 55.4323 141.575C60.2992 139.689 90.1929 139.023 130.598 139.635C204.863 140.762 213.705 139.496 230.998 125.2C282.576 83.4269 254.198 2.92565 187.611 2.19579C168.262 1.90235 157.675 5.66133 139.549 18.5449L130.342 25.1245L118.238 16.262Z"
      fill={iconColor}
    />
  );

  if (variant === "icon") {
    return (
      <svg
        role="img"
        viewBox="0 0 258 258"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Crafter Station Icon</title>
        {iconPath}
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        role="img"
        viewBox="0 0 400 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Crafter Station Wordmark</title>
        <text
          x="0"
          y="45"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="40"
          fontWeight="900"
          letterSpacing="-0.02em"
          fill={wordmarkColor}
        >
          CRAFTER STATION
        </text>
      </svg>
    );
  }

  // variant === "logo" (icon + wordmark)
  return (
    <svg
      role="img"
      viewBox="0 0 500 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Crafter Station Logo</title>
      {/* Icon scaled down and positioned */}
      <g transform="translate(0, 5) scale(0.27)">{iconPath}</g>
      {/* Wordmark positioned next to icon */}
      <text
        x="90"
        y="55"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="36"
        fontWeight="900"
        letterSpacing="-0.02em"
        fill={wordmarkColor}
      >
        CRAFTER STATION
      </text>
    </svg>
  );
}
