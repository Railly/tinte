import type { ShikiCssTheme, TinteBlock } from "@tinte/core";

export function mapTinteBlockToShiki(
  block: TinteBlock,
  mode: "light" | "dark",
): ShikiCssTheme {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#1e1e1e");
  const fg = block.tx || (mode === "light" ? "#000000" : "#d4d4d4");

  const variables: Record<string, string> = {
    "--shiki-background": bg,
    "--shiki-foreground": fg,
    "--shiki-token-comment":
      block.tx_3 || (mode === "light" ? "#6a737d" : "#6a9955"),
    "--shiki-token-keyword":
      block.pr || block.sc || (mode === "light" ? "#d73a49" : "#569cd6"),
    "--shiki-token-string":
      block.ac_1 || block.ac_2 || (mode === "light" ? "#032f62" : "#ce9178"),
    "--shiki-token-constant":
      block.sc || block.pr || (mode === "light" ? "#005cc5" : "#4fc1ff"),
    "--shiki-token-function":
      block.ac_2 || block.pr || (mode === "light" ? "#6f42c1" : "#dcdcaa"),
    "--shiki-token-parameter":
      block.tx_2 || (mode === "light" ? "#24292e" : "#9cdcfe"),
    "--shiki-token-punctuation":
      block.tx_2 || (mode === "light" ? "#24292e" : "#d4d4d4"),
    "--shiki-token-string-expression":
      block.ac_3 || block.ac_1 || (mode === "light" ? "#22863a" : "#b5cea8"),
    "--shiki-token-link":
      block.pr || block.sc || (mode === "light" ? "#0366d6" : "#4fc1ff"),
  };

  return { name: `tinte-${mode}`, variables };
}
