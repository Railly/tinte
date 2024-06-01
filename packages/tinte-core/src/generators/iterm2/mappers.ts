import { AllColorAbbreviations, AllToneAbbreviations } from "../../types";
import { ITerm2Key } from "../types";

export const mapITerm2Color: Record<
  ITerm2Key,
  AllColorAbbreviations | AllToneAbbreviations
> = {
  "Ansi 0 Color": "bg-2",
  "Ansi 1 Color": "re-2",
  "Ansi 2 Color": "gr-2",
  "Ansi 3 Color": "ye-2",
  "Ansi 4 Color": "bl-2",
  "Ansi 5 Color": "ma-2",
  "Ansi 6 Color": "cy-2",
  "Ansi 7 Color": "tx-3",
  "Ansi 8 Color": "ui",
  "Ansi 9 Color": "re",
  "Ansi 10 Color": "gr",
  "Ansi 11 Color": "ye",
  "Ansi 12 Color": "bl",
  "Ansi 13 Color": "ma",
  "Ansi 14 Color": "cy",
  "Ansi 15 Color": "tx",
  "Background Color": "bg",
  "Bold Color": "tx",
  "Cursor Color": "tx",
  "Cursor Text Color": "bg",
  "Foreground Color": "tx",
  "Link Color": "bl",
  "Selected Text Color": "tx",
  "Selection Color": "bg",
};
