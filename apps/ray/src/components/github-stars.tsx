import { GithubLogo } from "@/components/logos/github";
import { Star } from "lucide-react";

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Railly/tinte",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

export async function GithubStars() {
  const stars = await getStarCount();

  return (
    <a
      href="https://github.com/Railly/tinte"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <GithubLogo className="size-3.5" />
      {stars !== null && (
        <span className="flex items-center gap-0.5">
          <Star className="size-2.5 fill-current" />
          {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
        </span>
      )}
    </a>
  );
}
