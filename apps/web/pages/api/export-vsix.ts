import type { NextApiRequest, NextApiResponse } from "next";
import { generateVSCodeTheme } from "@/lib/core";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { ThemeConfig } from "@/lib/core/types";

const execPromise = util.promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { themeConfig, isDark } = req.body as {
    themeConfig: ThemeConfig;
    isDark: boolean;
  };

  if (!themeConfig || typeof isDark !== "boolean") {
    res.status(400).json({ error: "Invalid request parameters" });
    return;
  }

  const theme = generateVSCodeTheme(themeConfig);

  const themePath = path.join(process.cwd(), "temp-theme");
  const packageJsonPath = path.join(themePath, "package.json");
  const themeJsonPath = path.join(themePath, "themes", "theme.json");
  const readmePath = path.join(themePath, "README.md");
  const imagePath = path.join(themePath, "image.png");

  fs.mkdirSync(path.join(themePath, "themes"), { recursive: true });

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
    `<h3 align="center">
  <img src="https://raw.githubusercontent.com/Railly/website/main/public/images/private-github/tinte-logo.png" width="100" alt="Tinte Logo"/><br/>
  <img src="https://raw.githubusercontent.com/crafter-station/website/main/public/transparent.png" height="30" width="0px"/>
  ${themeConfig.displayName} by Tinte
</h3>

<p align="center">
An opinionated multi-platform color theme generator 🎨 <br>
</p>

## Support me 🙌

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

  try {
    await execPromise("npx vsce package", { cwd: themePath });
    const vsixPath = path.join(
      themePath,
      `${packageJson.name}-${packageJson.version}.vsix`
    );
    const vsixBuffer = fs.readFileSync(vsixPath);

    fs.rmSync(themePath, { recursive: true, force: true });

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${packageJson.name}-${
        isDark ? "dark" : "light"
      }-${packageJson.version}.vsix"`
    );
    res.status(200).send(vsixBuffer);
  } catch (error: any) {
    // Cleanup in case of error
    fs.rmSync(themePath, { recursive: true, force: true });
    res.status(500).json({ error: error.message });
  }
}
