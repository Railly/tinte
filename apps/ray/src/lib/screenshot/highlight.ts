import type { ThemedToken, ThemeRegistrationRaw } from "shiki";
import { createHighlighter } from "shiki";

let highlighterCache: Awaited<ReturnType<typeof createHighlighter>> | null =
  null;

async function getHighlighter(
  theme: ThemeRegistrationRaw,
  lang: string,
) {
  if (highlighterCache) {
    const loadedLangs = highlighterCache.getLoadedLanguages();
    const loadedThemes = highlighterCache.getLoadedThemes();

    if (!loadedLangs.includes(lang as never)) {
      await highlighterCache.loadLanguage(lang as never);
    }
    if (!loadedThemes.includes(theme.name!)) {
      await highlighterCache.loadTheme(theme);
    }
    return highlighterCache;
  }

  highlighterCache = await createHighlighter({
    themes: [theme],
    langs: [lang as never],
  });

  return highlighterCache;
}

export async function highlightCode(
  code: string,
  lang: string,
  theme: ThemeRegistrationRaw,
): Promise<{ tokens: ThemedToken[][]; fg: string; bg: string }> {
  const highlighter = await getHighlighter(theme, lang);

  const { tokens, fg, bg } = highlighter.codeToTokens(code, {
    theme: theme.name!,
    lang: lang as never,
  });

  return { tokens, fg: fg || "#d4d4d4", bg: bg || "#1e1e1e" };
}
