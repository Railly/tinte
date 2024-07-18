import { PRESETS } from "../constants";
import { DarkLightPalette, SemanticToken, ThemeConfig } from "./types";

export const defaultThemeConfig: ThemeConfig = {
  name: "one-hunter",
  displayName: "One Hunter",
  category: "featured",
  palette: PRESETS["One Hunter"] as DarkLightPalette,
  tokenColors: {
    plain: "text",
    classes: "accent",
    interfaces: "accent",
    structs: "accent",
    enums: "accent",
    keys: "text",
    methods: "secondary",
    functions: "accent",
    variables: "text",
    variablesOther: "secondary",
    globalVariables: "accent-2",
    localVariables: "text",
    parameters: "text",
    properties: "text",
    strings: "accent-2",
    stringEscapeSequences: "text",
    keywords: "primary",
    keywordsControl: "primary",
    storageModifiers: "primary",
    comments: "text-3",
    docComments: "text-3",
    numbers: "accent-3",
    booleans: "accent-3",
    operators: "primary",
    macros: "secondary",
    preprocessor: "accent-2",
    urls: "secondary",
    tags: "primary",
    jsxTags: "secondary",
    attributes: "accent",
    types: "secondary",
    constants: "secondary",
    labels: "accent-2",
    namespaces: "accent",
    modules: "primary",
    typeParameters: "accent",
    exceptions: "primary",
    decorators: "accent",
    calls: "text",
    punctuation: "text",
  },
};

export const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
  classes: ["entity.name.type.class"],
  interfaces: ["entity.name.type.interface", "entity.name.type"],
  structs: ["entity.name.type.struct"],
  enums: ["entity.name.type.enum"],
  keys: ["meta.object-literal.key"],
  methods: ["entity.name.function.method", "meta.function.method"],
  functions: [
    "entity.name.function",
    "support.function",
    "meta.function-call.generic",
  ],
  variables: [
    "variable",
    "meta.variable",
    "variable.other.object.property",
    "variable.other.readwrite.alias",
  ],
  variablesOther: ["variable.other.object"],
  globalVariables: ["variable.other.global", "variable.language.this"],
  localVariables: ["variable.other.local"],
  parameters: ["variable.parameter", "meta.parameter"],
  properties: ["variable.other.property", "meta.property"],
  strings: ["string", "string.other.link", "markup.inline.raw.string.markdown"],
  stringEscapeSequences: [
    "constant.character.escape",
    "constant.other.placeholder",
  ],
  keywords: ["keyword"],
  keywordsControl: [
    "keyword.control.import",
    "keyword.control.from",
    "keywaord.import",
  ],
  storageModifiers: ["storage.modifier", "keyword.modifier", "storage.type"],
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
  types: ["support.type"],
  constants: ["variable.other.constant", "variable.readonly"],
  labels: ["entity.name.label", "punctuation.definition.label"],
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
    "punctuation.section.block",
  ],
  plain: ["source", "support.type.property-name.css"],
};
export function getThemeColorDescription(colorKey: string): string {
  switch (colorKey) {
    case "text":
      return "Foreground Text - Primary. Should have high contrast against the background for readability.";
    case "text-2":
      return "Muted text - Secondary. Slightly less prominent than the primary text color.";
    case "text-3":
      return "Faint text - Tertiary. Used for less important text or subtle visual elements.";
    case "interface":
      return "Selected Indentation Guide, Selected Line Border, Matching Brackets, Spaces. Should be distinct from the background colors.";
    case "interface-2":
      return "UI borders, Indentation Guides. Subtle and harmonious with the background.";
    case "interface-3":
      return "Line Numbers, Selection Background. Should provide enough contrast with the text color.";
    case "background":
      return "Primary Background Color. Sets the overall tone of the theme. Should be easy on the eyes.";
    case "background-2":
      return "Secondary Background Color - Selected Line Background. Slightly different from the primary background for visual distinction.";
    case "primary":
      return "Keywords, Operators, Tags, Storage Modifiers. Should be prominent and easily distinguishable.";
    case "secondary":
      return "Methods, Types, Constants. Should complement the primary color and maintain good readability.";
    case "accent":
      return "Functions, Classes, Enums, Interfaces, Attributes. Should add visual interest without being overwhelming.";
    case "accent-2":
      return "Strings, Labels, Global Variables. Should be distinct from other code elements.";
    case "accent-3":
      return "Numbers, Booleans. Should be easily identifiable and consistent throughout the theme.";
    default:
      return "Custom color. Should harmonize with the overall color scheme.";
  }
}
