import { semanticTokenColors, editorThemeColors } from "../index.ts";
import { ColorEntry, SemanticToken } from "../types.ts";
import { entries, toJSON, writeFile } from "../utils.ts";
import { VSCodeTokenColor } from "./types.ts";

const mapTokenToScope = (token: SemanticToken): string | string[] => {
  const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
    classes: ["entity.name.type.class"],
    interfaces: ["entity.name.type.interface"],
    structs: ["entity.name.type.struct"],
    enums: ["entity.name.type.enum"],
    keys: ["meta.object-literal.key", "support.type.property-name"],
    methods: ["entity.name.function.method", "meta.function.method"],
    functions: [
      "entity.name.function",
      "support.function",
      "	meta.function-call.generic",
    ],
    variables: ["variable", "meta.variable", "variable.other.object.property"],
    globalVariables: ["variable.other.global", "variable.language.this"],
    localVariables: ["variable.other.local"],
    parameters: ["variable.parameter", "meta.parameter"],
    properties: ["variable.other.property", "meta.property"],
    strings: [
      "string",
      "string.other.link",
      "markup.inline.raw.string.markdown",
    ],
    stringEscapeSequences: [
      "constant.character.escape",
      "constant.other.placeholder",
    ],
    keywords: ["keyword", "variable.other.object"],
    keywordsControl: [
      "keyword.control.import",
      "keyword.control.from",
      "keyword.import",
    ],
    storageModifiers: [
      "storage.modifier",
      "keyword.modifier",
      "storage.type",
      "variable.other.readwrite.alias",
    ],
    comments: ["comment", "punctuation.definition.comment"],
    docComments: ["comment.documentation", "comment.line.documentation"],
    numbers: ["constant.numeric"],
    booleans: ["constant.language.boolean", "constant.language.json"],
    operators: ["keyword.operator"],
    macros: ["entity.name.function.preprocessor", "meta.preprocessor"],
    preprocessor: ["meta.preprocessor"],
    urls: ["markup.underline.link"],
    tags: ["entity.name.tag"],
    jsxTags: ["support.class.component"],
    attributes: ["entity.other.attribute-name", "meta.attribute"],
    types: ["entity.name.type", "support.type"],
    constants: ["variable.other.constant", "variable.readonly"],
    labels: [
      "entity.name.label",
      "punctuation.definition.label",
      "entity.name.section.markdown",
    ],
    namespaces: [
      "entity.name.namespace",
      "storage.modifier.namespace",
      "markup.bold.markdown",
    ],
    modules: ["entity.name.module", "storage.modifier.module"],
    typeParameters: ["variable.type.parameter", "variable.parameter.type"],
    exceptions: ["keyword.control.exception", "keyword.control.trycatch"],
    decorators: [
      "meta.decorator",
      "punctuation.decorator",
      "entity.name.function.decorator",
    ],
    calls: ["variable.function"],
    punctuation: [
      "punctuation",
      "punctuation.terminator",
      "punctuation.definition.tag",
      "punctuation.separator",
      "punctuation.definition.string",
      "meta.separator.markdown",
    ],
    codeBlocks: ["punctuation.section.block"],
    plain: ["source"],
  };

  return tokenToScopeMapping[token];
};

type ThemeType = "light" | "dark";

const generateVSCodeTokenColors = (
  themeType: ThemeType,
  token: SemanticToken,
  color: ColorEntry
): VSCodeTokenColor => {
  const scope = mapTokenToScope(token);

  return {
    name: token,
    scope,
    settings: {
      foreground: color[themeType],
    },
  };
};

const generateVSCodeColors = (themeType: ThemeType) => {
  const vsCodeColors: Record<string, string> = {};

  for (const [token, color] of entries(editorThemeColors)) {
    vsCodeColors[token] = color[themeType];
  }

  return vsCodeColors;
};

const generateVSCodeTheme = (themeType: ThemeType) => {
  const vsCodeTokens: VSCodeTokenColor[] = [];

  for (const [token, color] of entries(semanticTokenColors)) {
    const vsCodeToken = generateVSCodeTokenColors(themeType, token, color);
    vsCodeTokens.push(vsCodeToken);
  }

  const vsCodeColors = generateVSCodeColors(themeType);

  const vsCodeTheme = {
    name: "Flexoki",
    type: themeType,
    colors: vsCodeColors,
    tokenColors: vsCodeTokens,
  };

  return vsCodeTheme;
};

console.log(generateVSCodeTheme("dark"));

writeFile(
  "./src/generators/themes/vscode.json",
  toJSON(generateVSCodeTheme("dark"))
);
