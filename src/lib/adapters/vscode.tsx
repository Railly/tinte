import { TinteTheme } from "@/types/tinte";
import { VSCodeTheme } from "../tinte-to-vscode/types";
import { tinteToVSCode } from "../tinte-to-vscode";
import { PreviewableAdapter, AdapterMetadata } from "./types";
import { VSCodeIcon } from "@/components/shared/icons/vscode";
import { VSCodePreview } from "@/components/preview/vscode/preview";

function convertTinteToVSCode(tinte: TinteTheme): { light: VSCodeTheme; dark: VSCodeTheme } {
  return tinteToVSCode(tinte);
}

function generateVSCodeThemeFile(themes: { light: VSCodeTheme; dark: VSCodeTheme }): string {
  return JSON.stringify({
    ...themes.dark, // Use dark as base
    extends: [
      {
        ...themes.light,
        name: themes.light.name,
        uiTheme: "vs",
      },
      {
        ...themes.dark,
        name: themes.dark.name,
        uiTheme: "vs-dark",
      }
    ]
  }, null, 2);
}

export const vscodeAdapter: PreviewableAdapter<{ light: VSCodeTheme; dark: VSCodeTheme }> = {
  id: "vscode",
  name: "VS Code",
  description: "Visual Studio Code theme format",
  version: "1.0.0",
  fileExtension: "json",
  mimeType: "application/json",

  convert: convertTinteToVSCode,

  export: (theme: TinteTheme, filename?: string) => {
    const converted = convertTinteToVSCode(theme);
    return {
      content: generateVSCodeThemeFile(converted),
      filename: filename || "vscode-theme.json",
      mimeType: "application/json",
    };
  },

  validate: (output: { light: VSCodeTheme; dark: VSCodeTheme }) => {
    return !!(output.light && output.dark && 
      output.light.colors && output.dark.colors &&
      output.light.tokenColors && output.dark.tokenColors);
  },

  preview: {
    component: VSCodePreview,
  },
};

export const vscodeAdapterMetadata: AdapterMetadata = {
  id: "vscode",
  name: "VS Code",
  description: "The most popular code editor with extensive theme support",
  category: "editor",
  tags: ["editor", "microsoft", "typescript", "javascript"],
  icon: VSCodeIcon,
  website: "https://code.visualstudio.com/",
  documentation: "https://code.visualstudio.com/api/extension-guides/color-theme",
};