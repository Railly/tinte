import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";

export const rayParsers = {
  theme: parseAsString.withDefault("crafter-station"),
  mode: parseAsStringLiteral(["light", "dark"] as const).withDefault("dark"),
  lang: parseAsString.withDefault("tsx"),
  padding: parseAsInteger.withDefault(32),
  fontSize: parseAsInteger.withDefault(14),
  lineNumbers: parseAsStringLiteral(["on", "off"] as const).withDefault("on"),
  bg: parseAsString.withDefault("midnight"),
  title: parseAsString.withDefault(""),
};
