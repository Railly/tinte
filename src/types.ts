export type Shade =
  | 50
  | 100
  | 150
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 850
  | 900
  | 950;

export type ColorName =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "magenta";

export type ColorAbbreviation =
  | "re"
  | "or"
  | "ye"
  | "gr"
  | "cy"
  | "bl"
  | "pu"
  | "ma";

export type AllColorAbbreviations =
  | ColorAbbreviation
  | `${ColorAbbreviation}-2`;

export type BaseToneAbbreviation = "tx" | "ui" | "bg";

export type AllToneAbbreviations =
  | "tx"
  | "tx-2"
  | "tx-3"
  | "ui"
  | "ui-2"
  | "ui-3"
  | "bg"
  | "bg-2";

export type ColorEntry = {
  light: string;
  dark: string;
};

export type ColorMap = {
  [key in AllColorAbbreviations]: ColorEntry;
};

export type SemanticToken =
  | "plain"
  | "classes"
  | "interfaces"
  | "structs"
  | "enums"
  | "keys"
  | "methods"
  | "functions"
  | "variables"
  | "globalVariables"
  | "localVariables"
  | "parameters"
  | "properties"
  | "strings"
  | "stringEscapeSequences"
  | "keywords"
  | "keywordsControl"
  | "storageModifiers"
  | "comments"
  | "docComments"
  | "numbers"
  | "booleans"
  | "operators"
  | "macros"
  | "preprocessor"
  | "urls"
  | "tags"
  | "jsxTags"
  | "attributes"
  | "types"
  | "constants"
  | "labels"
  | "namespaces"
  | "modules"
  | "typeParameters"
  | "exceptions"
  | "decorators"
  | "calls"
  | "punctuation"
  | "codeBlocks";

export type EditorToken = "error" | "warning" | "info" | "debug";
