import { cn } from "@/lib";

interface ZedIconProps {
  className?: string;
}

export function ZedIcon({ className }: ZedIconProps) {
  return (
    <svg className={cn("w-4 h-4", className)} xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="none" viewBox="0 0 96 96">
      <g clipPath="url(#zed-a)">
        <path fill="currentColor" fillRule="evenodd" d="M9 6a3 3 0 0 0-3 3v66H0V9a9 9 0 0 1 9-9h80.379c4.009 0 6.016 4.847 3.182 7.682L43.055 57.187H57V51h6v7.688a4.5 4.5 0 0 1-4.5 4.5H37.055L26.743 73.5H73.5V36h6v37.5a6 6 0 0 1-6 6H20.743L10.243 90H87a3 3 0 0 0 3-3V21h6v66a9 9 0 0 1-9 9H6.621c-4.009 0-6.016-4.847-3.182-7.682L52.757 39H39v6h-6v-7.5a4.5 4.5 0 0 1 4.5-4.5h21.257l10.5-10.5H22.5V60h-6V22.5a6 6 0 0 1 6-6h52.757L85.757 6H9Z" clipRule="evenodd"/>
      </g>
      <defs>
        <clipPath id="zed-a">
          <path fill="#fff" d="M0 0h96v96H0z"/>
        </clipPath>
      </defs>
    </svg>
  );
}