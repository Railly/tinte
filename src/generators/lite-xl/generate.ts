import { mappedPalette } from "../../mapped-palette.js";
import { getThemeName, writeFile } from "../../utils/index.js";
import { ThemeType } from "../types.js";

export const generateLiteXLTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const theme = `
local style = require "core.style"
local common = require "core.common"

style.background = { common.color "${mappedPalette.bg[themeType]}" }
style.background2 = { common.color "${mappedPalette["bg-2"][themeType]}" }
style.background3 = { common.color "${mappedPalette["ui"][themeType]}" } 
style.text = { common.color "${mappedPalette.tx[themeType]}" }
style.caret = { common.color "${mappedPalette.tx[themeType]}" }
style.accent = { common.color "${mappedPalette["bl"][themeType]}" }
style.dim = { common.color "${mappedPalette.tx[themeType]}" }
style.divider = { common.color "${mappedPalette["ui-3"][themeType]}" }
style.selection = { common.color "${mappedPalette["ui-2"][themeType]}" }
style.line_number = { common.color "${mappedPalette["tx-2"][themeType]}" }
style.line_number2 = { common.color "${mappedPalette["bg"][themeType]}" }
style.line_highlight = { common.color "${mappedPalette["tx-3"][themeType]}" }
style.scrollbar = { common.color "${mappedPalette["tx"][themeType]}" } 
style.scrollbar2 = { common.color "${mappedPalette["tx-2"][themeType]}" }

style.syntax["normal"] = { common.color "${mappedPalette["ui"][themeType]}" }
style.syntax["symbol"] = { common.color "${mappedPalette["pu"][themeType]}" }
style.syntax["comment"] = { common.color "${mappedPalette["tx-2"][themeType]}" }
style.syntax["keyword"] = { common.color "${mappedPalette["re"][themeType]}" }
style.syntax["keyword2"] = { common.color "${mappedPalette["bl"][themeType]}" }
style.syntax["number"] = { common.color "${mappedPalette["gr"][themeType]}" }
style.syntax["literal"] = { common.color "${mappedPalette["ye"][themeType]}" }
style.syntax["string"] = { common.color "${mappedPalette["or"][themeType]}" }
style.syntax["operator"] = { common.color "${mappedPalette["gr"][themeType]}" }
style.syntax["function"] = { common.color "${mappedPalette["cy"][themeType]}" }
`;
  const filePath = `./_generated/${slugifiedName}/lite-xl/${themeName}.lua`;
  writeFile(filePath, theme);
};
