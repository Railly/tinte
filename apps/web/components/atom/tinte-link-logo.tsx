"use client";
import { IconTinte } from "@/components/ui/icons";
import Link from "next/link";

export function TinteLinkLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <IconTinte />
      <h1 className="text-md font-bold">tinte</h1>
    </Link>
  );
}
