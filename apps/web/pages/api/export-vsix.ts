import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { createVSIX } from "@vscode/vsce";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemeConfig } from "@/lib/core/types";

const allowedOrigins = ["http://localhost:3000", "https://tinte.railly.dev"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin as string);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(200, headers).end();
    return;
  }

  if (req.method !== "POST") {
    res
      .writeHead(405, headers)
      .end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  if (req.headers["content-type"] !== "application/json") {
    res
      .writeHead(400, headers)
      .end(JSON.stringify({ error: "Unsupported content type" }));
    return;
  }

  let parsedBody;
  try {
    parsedBody = req.body;
  } catch (jsonError) {
    console.error("JSON parsing error:", jsonError);
    res.writeHead(400, headers).end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const { themeConfig, isDark } = parsedBody;

  try {
    const vsixBuffer = await createVSIXFile(themeConfig, isDark);
    const base64VsixBuffer = vsixBuffer.toString("base64");

    console.log("Sending VSIX file response");

    res
      .status(200)
      .setHeader(
        "Access-Control-Allow-Origin",
        headers["Access-Control-Allow-Origin"] as string
      )
      .setHeader(
        "Access-Control-Allow-Methods",
        headers["Access-Control-Allow-Methods"] as string
      )
      .setHeader(
        "Access-Control-Allow-Headers",
        headers["Access-Control-Allow-Headers"] as string
      )
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .setHeader("Content-Type", "application/octet-stream")
      .setHeader(
        "Content-Disposition",
        `attachment; filename="${themeConfig.displayName.toLowerCase().replace(/\s+/g, "-")}-${isDark ? "dark" : "light"}-0.0.1.vsix"`
      )
      .send(base64VsixBuffer);
  } catch (error: any) {
    console.error("Error creating VSIX file:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createVSIXFile(themeConfig: ThemeConfig, isDark: boolean) {
  const theme = generateVSCodeTheme(themeConfig);
  console.log({ theme }, "from export-vsix.ts");

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
    description: "A customizable VSCode theme",
    publisher: "RaillyHugo",
    version: "0.0.2",
    engines: {
      vscode: "^1.70.0",
    },
    categories: ["Themes"],
    contributes: {
      themes: [
        {
          label: themeConfig.displayName,
          uiTheme: isDark ? "vs-dark" : "vs",
          path: "./themes/theme.json",
        },
      ],
    },
  };

  fs.writeFileSync(
    readmePath,
    `<h3 align="center">
  <img src="https://raw.githubusercontent.com/Railly/website/main/public/images/private-github/tinte-logo.png" width="100" alt="Tinte Logo"/><br/>
  <img src="https://raw.githubusercontent.com/crafter-station/website/main/public/transparent.png" height="30" width="0px"/>
  ${themeConfig.displayName} ${isDark ? "Dark" : "Light"} by <a href="https://github.com/Railly/tinte" target="_blank">Tinte</a>
</h3>

<p align="center">
An opinionated multi-platform color theme generator 🎨 <br>
</p>

## Support me

If you'd like to support my work, you can do so through the following methods:

### GitHub Sponsors

<a style="margin-right: 20px;" href="https://www.github.com/sponsors/Railly">
  <img src="https://raw.githubusercontent.com/Railly/obsidian-simple-flashcards/master/github-sponsor.png" alt="Sponsor with GitHub" height="45px" />
</a>

### Buy Me a Coffee

<a href="https://www.buymeacoffee.com/raillyhugo" target="_blank">
	<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="45px">
</a>

### PayPal

<a href="https://www.paypal.com/donate/?hosted_button_id=J3PJ5N6LVZCPY">
  <img style="margin-right: 20px;" src="https://raw.githubusercontent.com/Railly/Railly/main/buttons/donate-with-paypal.png" alt="Donate with PayPal" height="45px" />
</a>

### Yape

<a href="https://donate.railly.dev?open-yape-dialog=true">
  <img style="margin-right: 20px;" src="https://raw.githubusercontent.com/Railly/donate/main/public/donate-with-yape.png" alt="Donate with PayPal" height="45px" />
</a>

## Thank You! 🙏

Your support means a lot to me and helps me continue creating valuable content and projects for the community. Thank you for considering supporting my work!

If you have any questions or just want to connect, feel free to reach out to me.

Happy coding! 💻✨`
  );

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(
    themeJsonPath,
    JSON.stringify(isDark ? theme.darkTheme : theme.lightTheme, null, 2)
  );

  // Run vsce to package the theme
  try {
    const vsixPath = path.join(
      themePath,
      `${packageJson.name}-${packageJson.version}.vsix`
    );
    await createVSIX({
      cwd: themePath,
      packagePath: vsixPath,
      allowMissingRepository: true,
      skipLicense: true,
    });
    const vsixBuffer = fs.readFileSync(vsixPath);

    console.log("VSIX file created successfully");

    // Cleanup
    fs.rmSync(themePath, { recursive: true, force: true });

    return vsixBuffer;
  } catch (error: any) {
    console.error("Error creating VSIX file:", error);

    // Cleanup in case of error
    fs.rmSync(themePath, { recursive: true, force: true });
    throw new Error(`Error creating VSIX file: ${error.message}`);
  }
}
