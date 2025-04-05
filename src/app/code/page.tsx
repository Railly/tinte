import { GenerateTheme } from "./generate-theme";
import { Hero } from "./hero";

export default function ShadcnPage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto flex flex-grow flex-col">
        <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <GenerateTheme />
          <div>PREVIEW</div>
        </div>
      </main>
    </>
  );
}
