import { headers } from "next/headers";
import { FAQ } from "@/components/home/faq";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Roadmap } from "@/components/home/roadmap";
import { Showcase } from "@/components/home/showcase";
import { Footer } from "@/components/shared/footer";
import { auth } from "@/lib/auth";
import { getUserThemes, getUserFavoriteThemes, getPublicThemes, getTweakCNThemes, getTinteThemes, getRaysoThemes } from "@/lib/user-themes";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userThemes = session
    ? await getUserThemes(session.user.id, 8, session.user)
    : [];

  const favoriteThemes = session
    ? await getUserFavoriteThemes(session.user.id)
    : [];

  const publicThemes = await getPublicThemes(8);
  const tweakCNThemes = await getTweakCNThemes(8);
  const tinteThemes = await getTinteThemes(8);
  const raysoThemes = await getRaysoThemes(8);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Showcase
        session={session}
        userThemes={userThemes}
        publicThemes={publicThemes}
        favoriteThemes={favoriteThemes}
        tweakCNThemes={tweakCNThemes}
        tinteThemes={tinteThemes}
        raysoThemes={raysoThemes}
      />
      <Roadmap />
      <FAQ />
      <Footer />
    </div>
  );
}
