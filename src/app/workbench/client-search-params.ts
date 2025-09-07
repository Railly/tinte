import { parseAsStringLiteral } from "nuqs";

// Client-side parsers for workbench
export const workbenchParsers = {
  tab: parseAsStringLiteral(["agent", "colors", "tokens"] as const).withDefault(
    "colors" as const,
  ),
};
