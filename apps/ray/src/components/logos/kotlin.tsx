interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

export function KotlinLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Kotlin</title>
      <defs>
        <linearGradient
          id="kotlin-grad"
          x1="14.65%"
          y1="85.09%"
          x2="85.35%"
          y2="14.91%"
        >
          <stop offset="0%" stopColor="#E44857" />
          <stop offset="46.88%" stopColor="#C711E1" />
          <stop offset="100%" stopColor="#7F52FF" />
        </linearGradient>
      </defs>
      <path fill="url(#kotlin-grad)" d="M24 24H0V0h24L12 12Z" />
    </svg>
  );
}
