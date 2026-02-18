import type { SVGProps } from "react";

export function Folder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10zm-.51 8.49V13h-12V7h4.49l.35-.15l.86-.86H14v1.5zm0-6.49h-6.5l-.35.15l-.86.86H2v-3h4.29l.85.85l.36.15H14z"
      />
    </svg>
  );
}
