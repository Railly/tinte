import { palette } from "../../palette.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateLiteXLTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = `
local style = require "core.style"
local common = require "core.common"

style.background = { common.color "${palette.bg[themeType]}" }
style.background2 = { common.color "${palette["bg-2"][themeType]}" }
style.background3 = { common.color "${palette["ui"][themeType]}" } 
style.text = { common.color "${palette.tx[themeType]}" }
style.caret = { common.color "${palette.tx[themeType]}" }
style.accent = { common.color "${palette["bl"][themeType]}" }
style.dim = { common.color "${palette.tx[themeType]}" }
style.divider = { common.color "${palette["ui-3"][themeType]}" }
style.selection = { common.color "${palette["ui-2"][themeType]}" }
style.line_number = { common.color "${palette["tx-2"][themeType]}" }
style.line_number2 = { common.color "${palette["bg"][themeType]}" }
style.line_highlight = { common.color "${palette["tx-3"][themeType]}" }
style.scrollbar = { common.color "${palette["tx"][themeType]}" } 
style.scrollbar2 = { common.color "${palette["tx-2"][themeType]}" }

style.syntax["normal"] = { common.color "${palette["ui"][themeType]}" }
style.syntax["symbol"] = { common.color "${palette["pu"][themeType]}" }
style.syntax["comment"] = { common.color "${palette["tx-2"][themeType]}" }
style.syntax["keyword"] = { common.color "${palette["re"][themeType]}" }
style.syntax["keyword2"] = { common.color "${palette["bl"][themeType]}" }
style.syntax["number"] = { common.color "${palette["gr"][themeType]}" }
style.syntax["literal"] = { common.color "${palette["ye"][themeType]}" }
style.syntax["string"] = { common.color "${palette["or"][themeType]}" }
style.syntax["operator"] = { common.color "${palette["gr"][themeType]}" }
style.syntax["function"] = { common.color "${palette["cy"][themeType]}" }
`;
  const filePath = `./_generated/lite-xl/${themeName}.lua`;
  writeFile(filePath, theme);
};
