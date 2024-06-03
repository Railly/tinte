import { generateVSCodeTheme } from "@/lib/core";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { ThemeConfig } from "@/lib/core/types";
import type { NextApiRequest, NextApiResponse } from "next";

const execPromise = util.promisify(exec);

export async function createVSIXFile(
  themeConfig: ThemeConfig,
  isDark: boolean
): Promise<Buffer> {
  // Generate theme
  const theme = generateVSCodeTheme(themeConfig);

  // Define paths
  const themePath = path.join(process.cwd(), "temp-theme");
  const packageJsonPath = path.join(themePath, "package.json");
  const themeJsonPath = path.join(themePath, "themes", "theme.json");
  const readmePath = path.join(themePath, "README.md");

  // Ensure the directories exist
  fs.mkdirSync(path.join(themePath, "themes"), { recursive: true });

  // Write package.json
  const packageJson = {
    name: themeConfig.displayName.toLowerCase().replace(/\s+/g, "-"),
    displayName: themeConfig.displayName,
    publisher: "Railly Hugo",
    version: "0.0.1",
    engines: {
      vscode: "^1.40.0",
    },
    categories: ["Themes"],
    contributes: {
      themes: [
        {
          label: themeConfig.displayName,
          uiTheme: isDark ? "vs-dark" : "vs-light",
          path: "./themes/theme.json",
        },
      ],
    },
  };

  fs.writeFileSync(
    readmePath,
    `# ${themeConfig.displayName}

<h3 align="center">
  <img src="https://raw.githubusercontent.com/Railly/website/main/public/images/private-github/tinte-logo.png" width="100" alt="Tinte Logo"/><br/>
  <img src="https://raw.githubusercontent.com/crafter-station/website/main/public/transparent.png" height="30" width="0px"/>
  ${themeConfig.displayName} by Tinte
</h3>

<p align="center">
An opinionated multi-platform color theme generator 🎨 <br>
</p>

## Disclaimer

Visit the web version of this project at [Tinte](https://tinte.railly.dev)
`
  );

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(
    themeJsonPath,
    JSON.stringify(isDark ? theme.darkTheme : theme.lightTheme, null, 2)
  );

  // Run vsce to package the theme
  try {
    await execPromise("npx vsce package", { cwd: themePath });
    const vsixPath = path.join(
      themePath,
      `${packageJson.name}-${packageJson.version}.vsix`
    );
    const vsixBuffer = fs.readFileSync(vsixPath);

    // Cleanup
    fs.rmSync(themePath, { recursive: true, force: true });

    return vsixBuffer;
  } catch (error: any) {
    // Cleanup in case of error
    fs.rmSync(themePath, { recursive: true, force: true });
    throw new Error(`Error creating VSIX file: ${error.message}`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let parsedBody;
  if (req.headers["content-type"] === "application/json") {
    try {
      parsedBody = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
  } else {
    res.status(400).json({ error: "Unsupported content type" });
    return;
  }

  const { themeConfig, isDark } = parsedBody as {
    themeConfig: ThemeConfig;
    isDark: boolean;
  };

  try {
    const vsixBuffer = await createVSIXFile(themeConfig, isDark);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${themeConfig.displayName.toLowerCase().replace(/\s+/g, "-")}-${isDark ? "dark" : "light"}-0.0.1.vsix"`
    );
    res.status(200).send(vsixBuffer);
  } catch (error: any) {
    console.error("Error creating VSIX file:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
