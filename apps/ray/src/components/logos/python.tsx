interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

export function PythonLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 256 255"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Python</title>
      <defs>
        <linearGradient
          id="python-blue"
          x1="12.96%"
          y1="12.04%"
          x2="79.67%"
          y2="78.01%"
        >
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient
          id="python-yellow"
          x1="19.13%"
          y1="20.58%"
          x2="90.43%"
          y2="88.01%"
        >
          <stop offset="0%" stopColor="#FFE052" />
          <stop offset="100%" stopColor="#FFC331" />
        </linearGradient>
      </defs>
      <path
        fill="url(#python-blue)"
        d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072ZM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13Z"
      />
      <path
        fill="url(#python-yellow)"
        d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897Zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13Z"
      />
    </svg>
  );
}
