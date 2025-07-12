import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  let user = null;
  if (userId) {
    user = await currentUser();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Welcome to the Minimal App</h1>
        {user ? (
          <div className="text-lg">Hello, {user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress}!</div>
        ) : (
          <div className="flex gap-4">
            <Link href="/sign-in" className="underline text-blue-600">Login</Link>
            <Link href="/sign-up" className="underline text-blue-600">Sign Up</Link>
          </div>
        )}
      </div>
    </main>
  );
}
