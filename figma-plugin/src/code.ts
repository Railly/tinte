interface FigmaRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaTheme {
  id: string;
  name: string;
  description: string;
  tokens: {
    light: {
      colors: Record<string, FigmaRGBA>;
      numbers: Record<string, string>;
    };
    dark: {
      colors: Record<string, FigmaRGBA>;
      numbers: Record<string, string>;
    };
  };
}

const API_BASE_URL = "https://www.tinte.dev";

figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "sync-theme") {
    try {
      figma.notify("🔄 Syncing theme from Tinte...");

      const themeInput = msg.themeId.trim();
      const endpoint = `${API_BASE_URL}/api/figma/themes/${themeInput}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch theme: ${response.statusText}`);
      }

      const theme: FigmaTheme = await response.json();

      await createVariableCollection(theme);

      figma.notify(`✅ Successfully synced "${theme.name}" theme!`);
      figma.ui.postMessage({
        type: "sync-complete",
        theme: theme.name,
      });
    } catch (error) {
      console.error("Error syncing theme:", error);
      figma.notify(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          error: true,
        },
      );
      figma.ui.postMessage({
        type: "sync-error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

async function createVariableCollection(theme: FigmaTheme) {
  const existingCollections =
    await figma.variables.getLocalVariableCollectionsAsync();

  let collection = existingCollections.find((c) => c.name === theme.name);

  if (collection) {
    figma.notify("⚠️ Updating existing collection...");
  } else {
    collection = figma.variables.createVariableCollection(theme.name);
  }

  const lightMode = collection.modes[0];
  collection.renameMode(lightMode.modeId, "Light");

  let darkMode = collection.modes.find((m) => m.name === "Dark");
  if (!darkMode) {
    const darkModeId = collection.addMode("Dark");
    darkMode = collection.modes.find((m) => m.modeId === darkModeId);
  }

  if (!darkMode) {
    throw new Error("Failed to create dark mode");
  }

  const existingVars = collection.variableIds.map((id) =>
    figma.variables.getVariableById(id),
  );

  let totalVars = 0;

  // Create COLOR variables
  const colorTokenNames = theme.tokens.light.colors
    ? Object.keys(theme.tokens.light.colors)
    : [];
  for (const tokenName of colorTokenNames) {
    const lightColor = theme.tokens.light.colors[tokenName];
    const darkColor = theme.tokens.dark.colors[tokenName];

    if (!lightColor || !darkColor) continue;

    let variable = existingVars.find((v) => v && v.name === tokenName) as
      | Variable
      | undefined;

    if (!variable) {
      variable = figma.variables.createVariable(tokenName, collection, "COLOR");
    }

    variable.setValueForMode(lightMode.modeId, lightColor);
    variable.setValueForMode(darkMode.modeId, darkColor);
    totalVars++;
  }

  // Create NUMBER variables
  const numberTokenNames = theme.tokens.light.numbers
    ? Object.keys(theme.tokens.light.numbers)
    : [];
  for (const tokenName of numberTokenNames) {
    const lightValue = theme.tokens.light.numbers[tokenName];
    const darkValue = theme.tokens.dark.numbers[tokenName];

    if (!lightValue || !darkValue) continue;

    let variable = existingVars.find((v) => v && v.name === tokenName) as
      | Variable
      | undefined;

    if (!variable) {
      variable = figma.variables.createVariable(tokenName, collection, "FLOAT");
    }

    const lightNum = parseFloat(lightValue.replace(/px|rem|em/g, ""));
    const darkNum = parseFloat(darkValue.replace(/px|rem|em/g, ""));

    variable.setValueForMode(lightMode.modeId, lightNum);
    variable.setValueForMode(darkMode.modeId, darkNum);
    totalVars++;
  }

  figma.notify(`Created/updated ${totalVars} variables`);
}
