import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface SiteHeaderProps {
  isSignedIn: boolean;
  stars?: number;
}

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#gallery", label: "Gallery" },
  { href: "#models", label: "Models" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader({ isSignedIn, stars = 532 }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-[var(--color-ui)] border-b bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-6">
        <Link className="flex items-center gap-2" href="/">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[var(--color-tx)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <rect height="20" rx="4" width="20" x="2" y="2" />
            <path d="M6 8h12M6 12h8M6 16h6" strokeLinecap="round" />
          </svg>
          <span className="font-medium text-[var(--color-tx)] text-sm tracking-tight">
            kit
            <span className="text-[var(--color-tx-3)]">.tinte.dev</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              className="text-[13px] text-[var(--color-tx-2)] transition-colors hover:text-[var(--color-tx)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden h-8 items-center gap-1.5 rounded border border-[var(--color-ui)] px-2.5 text-[12px] text-[var(--color-tx-2)] transition-colors hover:border-[var(--color-ui-2)] hover:text-[var(--color-tx)] sm:inline-flex"
            href="https://github.com/Railly/tinte"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z" />
            </svg>
            <span className="font-mono">{stars}</span>
          </a>
          {isSignedIn ? (
            <UserButton
              appearance={{ elements: { avatarBox: "h-7 w-7" } }}
            />
          ) : (
            <SignInButton mode="modal">
              <button
                className="h-8 rounded px-3 font-medium text-[12px] transition-opacity hover:opacity-85"
                style={{
                  background: "var(--color-tx)",
                  color: "var(--color-bg)",
                }}
                type="button"
              >
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
