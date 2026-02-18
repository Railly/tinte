import { cn } from "@/lib";

interface CursorIconProps {
  className?: string;
}

export function CursorIcon({ className }: CursorIconProps) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="cursor-fill-0"
          x1="11.925"
          x2="11.925"
          y1="12"
          y2="24"
        >
          <stop
            offset=".16"
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity=".39"
          />
          <stop
            offset=".658"
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity=".8"
          />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="cursor-fill-1"
          x1="22.35"
          x2="11.925"
          y1="6.037"
          y2="12.15"
        >
          <stop
            offset=".182"
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity=".31"
          />
          <stop
            offset=".715"
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity="0"
          />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="cursor-fill-2"
          x1="11.925"
          x2="1.5"
          y1="0"
          y2="18"
        >
          <stop
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity=".6"
          />
          <stop
            offset=".667"
            className="[stop-color:#000] dark:[stop-color:#fff]"
            stopOpacity=".22"
          />
        </linearGradient>
      </defs>
      <path
        d="M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z"
        fill="url(#cursor-fill-0)"
      />
      <path d="M22.35 18V6L11.925 0v12l10.425 6z" fill="url(#cursor-fill-1)" />
      <path d="M11.925 0L1.5 6v12l10.425-6V0z" fill="url(#cursor-fill-2)" />
      <path
        d="M22.35 6L11.925 24V12L22.35 6z"
        className="fill-[#555] dark:fill-[#E4E4E4]"
      />
      <path
        d="M22.35 6l-10.425 6L1.5 6h20.85z"
        className="fill-[#000] dark:fill-[#fff]"
      />
    </svg>
  );
}
