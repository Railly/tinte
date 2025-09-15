import { headers } from "next/headers";
import { FAQ } from "@/components/home/faq";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Roadmap } from "@/components/home/roadmap";
import { Showcase } from "@/components/home/showcase";
import { Footer } from "@/components/shared/footer";
import { auth } from "@/lib/auth";
import { UserThemeService } from "@/lib/services/user-theme.service";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userThemes = session
    ? await UserThemeService.getUserThemes(session.user.id, 8, session.user)
    : [];

  const favoriteThemes = session
    ? await UserThemeService.getUserFavoriteThemes(session.user.id)
    : [];

  const publicThemes = await UserThemeService.getPublicThemes(8);

  return (
    <div className="min-h-screen">
      <Header />
      {session && (
        <div className="bg-muted/50 border-b">
          <div className="px-4 py-2">
            <div className="text-center text-sm text-muted-foreground">
              🎉 Welcome back,{" "}
              <strong>{session.user.name || session.user.email}</strong>!
              You&apos;re signed in and ready to create amazing themes.
            </div>
          </div>
        </div>
      )}
      <Hero />
      <Showcase
        session={session}
        userThemes={userThemes}
        publicThemes={publicThemes}
        favoriteThemes={favoriteThemes}
      />
      <Roadmap />
      <FAQ />
      <Footer />
    </div>
  );
}
