export default function WorkbenchLoading() {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-ping rounded-full bg-primary/20" />
        </div>
        <div className="relative flex gap-1.5">
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0ms", animationDuration: "500ms" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/75"
            style={{ animationDelay: "100ms", animationDuration: "500ms" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/50"
            style={{ animationDelay: "200ms", animationDuration: "500ms" }}
          />
        </div>
      </div>
    </div>
  );
}
