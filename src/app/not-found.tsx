import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Return to Tinte to continue creating and converting themes.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/404`,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-lg">
            The page you are looking for does not exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/themes">Browse Themes</Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <Link href="/workbench" className="text-primary hover:underline">
              Theme Workbench
            </Link>
            <span>•</span>
            <Link
              href="/themes?category=tinte"
              className="text-primary hover:underline"
            >
              Tinte Themes
            </Link>
            <span>•</span>
            <Link
              href="/themes?category=rayso"
              className="text-primary hover:underline"
            >
              Ray.so Themes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
