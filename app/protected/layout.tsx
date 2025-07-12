import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center gap-6">
        <nav className="w-full flex justify-between items-center mb-8">
          <Link href="/" className="text-lg font-bold">Home</Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </nav>
        <div className="w-full flex-1 flex flex-col items-center">
          {children}
        </div>
      </div>
    </main>
  );
}
