import type { SemanticToken, TokenColorMap } from "@/lib/providers/vscode";

export interface VSCodeTokenGroup {
  label: string;
  description: string;
  tokens: {
    key: SemanticToken;
    displayName: string;
    description: string;
  }[];
}

export const VSCODE_TOKEN_GROUPS: VSCodeTokenGroup[] = [
  {
    label: "Text & Basic",
    description: "Default text and basic syntax elements",
    tokens: [
      {
        key: "plain",
        displayName: "Plain Text",
        description: "Default text color",
      },
      {
        key: "punctuation",
        displayName: "Punctuation",
        description: "Brackets, semicolons, commas",
      },
    ],
  },
  {
    label: "Type Definitions",
    description: "Classes, interfaces, types, and type parameters",
    tokens: [
      {
        key: "classes",
        displayName: "Classes",
        description: "Class names and definitions",
      },
      {
        key: "interfaces",
        displayName: "Interfaces",
        description: "Interface names",
      },
      {
        key: "structs",
        displayName: "Structs",
        description: "Struct definitions",
      },
      { key: "enums", displayName: "Enums", description: "Enum definitions" },
      { key: "types", displayName: "Types", description: "Type annotations" },
      {
        key: "typeParameters",
        displayName: "Type Parameters",
        description: "Generic type parameters",
      },
    ],
  },
  {
    label: "Functions & Methods",
    description: "Function and method definitions and calls",
    tokens: [
      {
        key: "functions",
        displayName: "Functions",
        description: "Function names and definitions",
      },
      {
        key: "methods",
        displayName: "Methods",
        description: "Method calls and definitions",
      },
      {
        key: "calls",
        displayName: "Function Calls",
        description: "Function call expressions",
      },
    ],
  },
  {
    label: "Variables & Properties",
    description: "Variable declarations and object properties",
    tokens: [
      {
        key: "variables",
        displayName: "Variables",
        description: "Local variables",
      },
      {
        key: "variablesOther",
        displayName: "Object Variables",
        description: "Object variables",
      },
      {
        key: "globalVariables",
        displayName: "Global Variables",
        description: "Global scope variables",
      },
      {
        key: "localVariables",
        displayName: "Local Variables",
        description: "Local scope variables",
      },
      {
        key: "parameters",
        displayName: "Parameters",
        description: "Function parameters",
      },
      {
        key: "properties",
        displayName: "Properties",
        description: "Object properties",
      },
      { key: "keys", displayName: "Object Keys", description: "Object keys" },
    ],
  },
  {
    label: "Language Constructs",
    description: "Keywords, operators, and control flow",
    tokens: [
      {
        key: "keywords",
        displayName: "Keywords",
        description: "if, for, while, etc.",
      },
      {
        key: "keywordsControl",
        displayName: "Control Keywords",
        description: "import, export, return",
      },
      {
        key: "storageModifiers",
        displayName: "Storage Modifiers",
        description: "const, let, var, public, private",
      },
      {
        key: "operators",
        displayName: "Operators",
        description: "+, -, *, /, =, etc.",
      },
    ],
  },
  {
    label: "Literals & Constants",
    description: "String, number, and boolean literals",
    tokens: [
      {
        key: "strings",
        displayName: "Strings",
        description: "String literals",
      },
      {
        key: "stringEscapeSequences",
        displayName: "String Escapes",
        description: "\\n, \\t, etc.",
      },
      {
        key: "numbers",
        displayName: "Numbers",
        description: "Numeric literals",
      },
      { key: "booleans", displayName: "Booleans", description: "true, false" },
      {
        key: "constants",
        displayName: "Constants",
        description: "CONSTANTS, readonly",
      },
    ],
  },
  {
    label: "Comments & Documentation",
    description: "Regular and documentation comments",
    tokens: [
      {
        key: "comments",
        displayName: "Comments",
        description: "Regular comments",
      },
      {
        key: "docComments",
        displayName: "Doc Comments",
        description: "JSDoc, docstrings",
      },
    ],
  },
  {
    label: "Web & Markup",
    description: "HTML, XML, JSX elements and attributes",
    tokens: [
      { key: "tags", displayName: "Tags", description: "HTML/XML tags" },
      {
        key: "jsxTags",
        displayName: "JSX Tags",
        description: "JSX component tags",
      },
      {
        key: "attributes",
        displayName: "Attributes",
        description: "HTML attributes",
      },
      { key: "urls", displayName: "URLs", description: "Links in comments" },
    ],
  },
  {
    label: "Advanced Constructs",
    description: "Namespaces, modules, decorators, and other advanced features",
    tokens: [
      {
        key: "namespaces",
        displayName: "Namespaces",
        description: "Namespace declarations",
      },
      { key: "modules", displayName: "Modules", description: "Module imports" },
      {
        key: "macros",
        displayName: "Macros",
        description: "Preprocessor macros",
      },
      {
        key: "preprocessor",
        displayName: "Preprocessor",
        description: "#define, #include",
      },
      {
        key: "exceptions",
        displayName: "Exceptions",
        description: "try, catch, throw",
      },
      {
        key: "decorators",
        displayName: "Decorators",
        description: "@decorators",
      },
      { key: "labels", displayName: "Labels", description: "goto labels" },
    ],
  },
];

export function createInitialVSCodeTokenGroups(): Record<string, boolean> {
  const initialGroups: Record<string, boolean> = {};
  VSCODE_TOKEN_GROUPS.forEach((group) => {
    initialGroups[group.label] = true;
  });
  return initialGroups;
}

export function createVSCodeTokenSkeletons(): VSCodeTokenGroup[] {
  return VSCODE_TOKEN_GROUPS.map((group) => ({
    ...group,
    tokens: group.tokens.map((token) => ({
      ...token,
      key: token.key,
    })),
  }));
}

export function hasValidVSCodeTokens(tokenColors?: TokenColorMap): boolean {
  if (!tokenColors) return false;

  const requiredTokens: SemanticToken[] = [
    "plain",
    "functions",
    "keywords",
    "strings",
  ];
  return requiredTokens.every((token) => token in tokenColors);
}
