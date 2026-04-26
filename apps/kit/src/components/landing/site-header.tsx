import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface SiteHeaderProps {
  isSignedIn: boolean;
  stars?: number;
}

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#products", label: "Products" },
  { href: "#socials", label: "Socials" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader({ isSignedIn, stars = 532 }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-[#2b2925] border-b bg-[#0c0c0b]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            className="font-semibold text-[#f4f1e8] tracking-tight"
            href="/"
          >
            kit.tinte.dev
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                className="text-[#a7a096] text-sm transition-colors hover:text-[#f4f1e8]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="hidden items-center gap-1.5 rounded-md border border-[#2b2925] px-3 py-1.5 text-[#a7a096] text-xs hover:border-[#3a372f] hover:text-[#f4f1e8] sm:inline-flex"
            href="https://github.com/Railly/tinte"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{stars}</span>
          </a>
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <button
                className="h-8 rounded-md bg-[#f4f1e8] px-4 font-medium text-[#0c0c0b] text-sm transition-opacity hover:opacity-90"
                type="button"
              >
                Login
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
