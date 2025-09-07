import {
  createSearchParamsCache,
  parseAsStringLiteral,
} from "nuqs/server";

// Server-side parsers and cache
export const workbenchCache = createSearchParamsCache({
  tab: parseAsStringLiteral(["agent", "colors", "tokens"]).withDefault("colors"),
});
