import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  // Get the current user from Supabase Auth (server-side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Welcome to the Minimal App</h1>
        {user ? (
          <div className="text-lg">Hello, {user.email}!</div>
        ) : (
          <div className="flex gap-4">
            <Link href="/auth/login" className="underline text-blue-600">Login</Link>
            <Link href="/auth/sign-up" className="underline text-blue-600">Sign Up</Link>
          </div>
        )}
        <div className="mt-8">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}
