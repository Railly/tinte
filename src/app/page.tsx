import { Hero } from "@/components/home/hero";
import { Showcase } from "@/components/home/showcase";
import { Header } from "@/components/shared/header";
import { Roadmap } from "@/components/home/roadmap";
import { FAQ } from "@/components/home/faq";
import { Footer } from "@/components/shared/footer";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Showcase />
      <Roadmap />
      <FAQ />
      <Footer />
    </div>
  );
}
