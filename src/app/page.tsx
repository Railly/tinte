import { FAQ } from "@/components/home/faq";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Roadmap } from "@/components/home/roadmap";
import { Showcase } from "@/components/home/showcase";
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
