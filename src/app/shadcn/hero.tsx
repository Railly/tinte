export function Hero() {
  return (
    <div className="container mx-auto my-4 flex flex-col items-center justify-center gap-4">
      <h1 className="max-w-lg text-balance text-center font-bold text-4xl">
        <span className="animate-hero-a">Create</span>,{" "}
        <span className="animate-hero-b">Customize</span> and{" "}
        <span className="animate-hero-c">Apply</span> your shadcn/ui theme
      </h1>
    </div>
  );
}
