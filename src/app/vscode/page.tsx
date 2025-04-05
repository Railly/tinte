import { GenerateTheme } from "./generate-theme";
import { Hero } from "./hero";
import { VSCodeEditor } from "./editor";

export default function VSCodePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto flex flex-grow flex-col">
        <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <GenerateTheme />
          <VSCodeEditor />
        </div>
      </main>
    </>
  );
}
