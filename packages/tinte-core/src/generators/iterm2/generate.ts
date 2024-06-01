import { mappedPalette } from "../../mapped-palette.ts";
import { Color } from "../../utils/color.ts";
import { entries, getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";
import { mapITerm2Color } from "./mappers.ts";

export const generateITerm2Theme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const theme = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${entries(mapITerm2Color)
  .map(([key, color]) => {
    const rgbaColor = Color.fromHex(mappedPalette[color][themeType]);
    return `    <key>${key}</key>
    <dict>
        <key>Color Space</key>
        <string>sRGB</string>
        <key>Red Component</key>
        <real>${rgbaColor.asFloat.red}</real>
        <key>Green Component</key>
        <real>${rgbaColor.asFloat.green}</real>
        <key>Blue Component</key>
        <real>${rgbaColor.asFloat.blue}</real>
        <key>Alpha Component</key>
        <real>${rgbaColor.asFloat.alpha}</real>
    </dict>`;
  })
  .join("\n")}
</dict>
</plist>`;

  const filePath = `./_generated/${slugifiedName}/iterm2/${themeName}-iterm2.xml`;
  writeFile(filePath, theme);
};
