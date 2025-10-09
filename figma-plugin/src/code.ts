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
    light: Record<string, FigmaRGBA>;
    dark: Record<string, FigmaRGBA>;
  };
}

const API_BASE_URL = "https://www.tinte.dev";

figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "sync-theme") {
    try {
      figma.notify("🔄 Syncing theme from Tinte...");

      const themeId = msg.themeId;
      const response = await fetch(
        `${API_BASE_URL}/api/figma/themes/${themeId}`,
      );

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

  const tokenNames = Object.keys(theme.tokens.light);

  for (const tokenName of tokenNames) {
    const lightColor = theme.tokens.light[tokenName];
    const darkColor = theme.tokens.dark[tokenName];

    if (!lightColor || !darkColor) continue;

    const existingVars = collection.variableIds.map((id) =>
      figma.variables.getVariableById(id),
    );
    let variable = existingVars.find((v) => v?.name === tokenName) as
      | Variable
      | undefined;

    if (!variable) {
      variable = figma.variables.createVariable(tokenName, collection, "COLOR");
    }

    variable.setValueForMode(lightMode.modeId, lightColor);
    variable.setValueForMode(darkMode.modeId, darkColor);
  }

  figma.notify(`Created/updated ${tokenNames.length} color variables`);
}
