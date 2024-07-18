"use client";
import { IconTinte } from "@/components/ui/icons";
import RHLogoIcon from "@/public/rh-logo.svg";

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <a
        className="flex items-center justify-center h-14 border-b"
        href="https://railly.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RHLogoIcon />
      </a>
      {"/"}
      <IconTinte />
      <h1 className="text-md font-bold">tinte</h1>
    </div>
  );
}
