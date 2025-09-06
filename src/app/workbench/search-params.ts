import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsStringLiteral,
} from "nuqs/server";

// Server-side parsers and cache
export const workbenchCache = createSearchParamsCache({
  new: parseAsBoolean.withDefault(false),
  tab: parseAsStringLiteral(["chat", "design", "mapping"]).withDefault("chat"),
});
