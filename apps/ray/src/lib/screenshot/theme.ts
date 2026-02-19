import type { TinteBlock } from "@tinte/core";
import type { ThemeRegistrationRaw } from "shiki";

export function tinteBlockToTextMateTheme(
  block: TinteBlock,
  mode: "light" | "dark",
): ThemeRegistrationRaw {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#1e1e1e");
  const fg = block.tx || (mode === "light" ? "#000000" : "#d4d4d4");
  const comment =
    block.tx_3 || (mode === "light" ? "#6a737d" : "#6a9955");
  const keyword =
    block.pr || block.sc || (mode === "light" ? "#d73a49" : "#569cd6");
  const string =
    block.ac_1 || block.ac_2 || (mode === "light" ? "#032f62" : "#ce9178");
  const constant =
    block.sc || block.pr || (mode === "light" ? "#005cc5" : "#4fc1ff");
  const func =
    block.ac_2 || block.pr || (mode === "light" ? "#6f42c1" : "#dcdcaa");
  const parameter =
    block.tx_2 || (mode === "light" ? "#24292e" : "#9cdcfe");
  const punctuation =
    block.tx_2 || (mode === "light" ? "#24292e" : "#d4d4d4");
  const stringExpression =
    block.ac_3 || block.ac_1 || (mode === "light" ? "#22863a" : "#b5cea8");

  return {
    name: `tinte-${mode}`,
    type: mode === "light" ? "light" : "dark",
    colors: {
      "editor.background": bg,
      "editor.foreground": fg,
    },
    settings: [
      { settings: { foreground: fg, background: bg } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: comment, fontStyle: "italic" },
      },
      {
        scope: [
          "keyword",
          "storage.type",
          "storage.modifier",
          "keyword.control",
          "keyword.operator.expression",
          "keyword.operator.new",
        ],
        settings: { foreground: keyword },
      },
      {
        scope: ["string", "string.quoted"],
        settings: { foreground: string },
      },
      {
        scope: [
          "constant",
          "constant.numeric",
          "constant.language",
          "support.constant",
          "variable.other.constant",
        ],
        settings: { foreground: constant },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call",
        ],
        settings: { foreground: func },
      },
      {
        scope: [
          "variable.parameter",
          "meta.parameter",
          "variable.other",
        ],
        settings: { foreground: parameter },
      },
      {
        scope: [
          "punctuation",
          "meta.brace",
          "punctuation.definition.tag",
        ],
        settings: { foreground: punctuation },
      },
      {
        scope: [
          "string.regexp",
          "string.template",
          "constant.other.color",
        ],
        settings: { foreground: stringExpression },
      },
      {
        scope: ["entity.name.tag", "support.class.component"],
        settings: { foreground: keyword },
      },
      {
        scope: [
          "entity.other.attribute-name",
          "entity.other.inherited-class",
        ],
        settings: { foreground: func },
      },
      {
        scope: ["entity.name.type", "support.type", "support.class"],
        settings: { foreground: constant },
      },
      {
        scope: ["keyword.operator", "keyword.operator.assignment"],
        settings: { foreground: punctuation },
      },
    ],
  };
}
