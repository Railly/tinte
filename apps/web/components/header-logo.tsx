"use client";
import { IconTinte } from "@/components/ui/icons";
import RHLogoIcon from "@/public/rh-logo.svg";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-3.5 px-1">
      <a
        className="flex items-center justify-center h-14"
        href="https://railly.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RHLogoIcon />
      </a>
      <span>{"/"}</span>
      <Link href="/" className="flex items-center gap-2">
        <IconTinte />
        <h1 className="text-md font-bold">tinte</h1>
      </Link>
    </div>
  );
}
