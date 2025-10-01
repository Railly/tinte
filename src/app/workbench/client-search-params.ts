import { parseAsStringLiteral } from "nuqs";

// Client-side parsers for workbench
export const workbenchParsers = {
  tab: parseAsStringLiteral([
    "agent",
    "canonical",
    "overrides",
  ] as const).withDefault("agent" as const),
};
