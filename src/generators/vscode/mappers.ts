import { SemanticToken } from "../../types.ts";

const mapTokenToScope = (token: SemanticToken): string | string[] => {
  const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
    classes: ["entity.name.type.class"],
    interfaces: ["entity.name.type.interface", "entity.name.type"],
    structs: ["entity.name.type.struct"],
    enums: ["entity.name.type.enum"],
    keys: ["meta.object-literal.key", "support.type.property-name"],
    methods: ["entity.name.function.method", "meta.function.method"],
    functions: [
      "entity.name.function",
      "support.function",
      "meta.function-call.generic",
    ],
    variables: ["variable", "meta.variable", "variable.other.object.property"],
    variablesOther: ["variable.other.object", "variable.other.readwrite.alias"],
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
    keywords: ["keyword"],
    keywordsControl: [
      "keyword.control.import",
      "keyword.control.from",
      "keyword.import",
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
      "punctuation.section.block",
    ],
    plain: ["source"],
  };

  return tokenToScopeMapping[token];
};

export { mapTokenToScope };
