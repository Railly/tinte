import { cn } from "@/lib";

interface ReplitIconProps {
  className?: string;
}

export function ReplitIcon({ className }: ReplitIconProps) {
  return (
    <svg className={cn("w-4 h-4", className)} width="53.333333333333336" height="64" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z" fill="#F26207"/>
      <path d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z" fill="#F26207"/>
      <path d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z" fill="#F26207"/>
    </svg>
  );
}