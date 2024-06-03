import type { NextApiRequest, NextApiResponse } from "next";
import { generateVSCodeTheme } from "@/lib/core";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import multer from "multer";
import { ThemeConfig } from "@/lib/core/types";

const execPromise = util.promisify(exec);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (nextReq: NextApiRequest, nextRes: NextApiResponse) => {
  if (nextReq.method !== "POST") {
    nextRes.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log("Request received:", nextReq.method, nextReq.url);
  console.log("Headers:", nextReq.headers);

  let parsedBody;
  if (nextReq.headers["content-type"] === "application/json") {
    try {
      parsedBody = await new Promise((resolve, reject) => {
        let data = "";
        nextReq.on("data", (chunk) => {
          data += chunk;
        });
        nextReq.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      nextRes.status(400).json({ error: "Invalid JSON" });
      return;
    }
  } else {
    nextRes.status(400).json({ error: "Unsupported content type" });
    return;
  }

  const { themeConfig, isDark } = parsedBody as {
    themeConfig: ThemeConfig;
    isDark: boolean;
  };

  upload.single("file")(nextReq, nextRes, async (err: any) => {
    if (err) {
      console.error("Multer error:", err);
      nextRes.status(500).json({ error: "File upload failed" });
      return;
    }

    if (!themeConfig || typeof isDark !== "boolean") {
      nextRes.status(400).json({ error: "Invalid request parameters" });
      return;
    }

    const theme = generateVSCodeTheme(themeConfig);

    const themePath = path.join(process.cwd(), "temp-theme");
    const packageJsonPath = path.join(themePath, "package.json");
    const themeJsonPath = path.join(themePath, "themes", "theme.json");
    const readmePath = path.join(themePath, "README.md");

    try {
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
        console.log("Running vsce package...");
        await execPromise("npx vsce package", { cwd: themePath });
        const vsixPath = path.join(
          themePath,
          `${packageJson.name}-${packageJson.version}.vsix`
        );
        const vsixBuffer = fs.readFileSync(vsixPath);

        // Cleanup
        fs.rmSync(themePath, { recursive: true, force: true });

        nextRes.setHeader("Content-Type", "application/octet-stream");
        nextRes.setHeader(
          "Content-Disposition",
          `attachment; filename="${packageJson.name}-${
            isDark ? "dark" : "light"
          }-${packageJson.version}.vsix"`
        );
        nextRes.status(200).send(vsixBuffer);
      } catch (error) {
        console.error("Error running vsce package:", error);
        // Cleanup in case of error
        fs.rmSync(themePath, { recursive: true, force: true });
        nextRes.status(500).json({ error: error.message });
      }
    } catch (fsError) {
      console.error("Filesystem error:", fsError);
      nextRes.status(500).json({ error: "Filesystem operation failed" });
    }
  });
};

export default handler;
