import { Hero } from "./hero";

export default function ShadcnPage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto flex flex-grow flex-col">
        <div className="my-8 flex flex-col gap-4">
          <p>Hi!</p>
        </div>
      </main>
    </>
  );
}
