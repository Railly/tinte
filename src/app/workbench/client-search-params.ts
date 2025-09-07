import { parseAsStringLiteral } from "nuqs";

// Client-side parsers for workbench
export const workbenchParsers = {
  tab: parseAsStringLiteral(["canonical", "overrides", "agent"] as const).withDefault(
    "canonical" as const,
  ),
};
