import { ElementsIcon } from "@/components/shared/icons";

export function ElementsBanner() {
  return (
    <div className="w-full border-border border-dotted border-b-1">
      <div className="flex items-center justify-center px-4 py-2 mx-auto border-border border-dotted border-r-1 border-l-1 bg-muted/30">
        <p className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <ElementsIcon className="size-3 text-foreground" />
          <span className="font-semibold text-foreground">Elements</span>
          <span className="font-mono text-[0.7rem] sm:text-xs">
            tryelements.dev
          </span>
          {" — "}
          <span>Trusted shadcn registry for</span>{" "}
          <a
            href="https://tryelements.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-foreground transition-colors"
          >
            full-stack components
          </a>
        </p>
      </div>
    </div>
  );
}
