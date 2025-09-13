import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteBlock } from "./tinte";

export interface DbTheme {
  id: string;
  name: string;
  user_id: string | null;
  created_at: Date | null;
  light_bg: string;
  light_bg_2: string;
  light_ui: string;
  light_ui_2: string;
  light_ui_3: string;
  light_tx: string;
  light_tx_2: string;
  light_tx_3: string;
  light_pr: string;
  light_sc: string;
  light_ac_1: string;
  light_ac_2: string;
  light_ac_3: string;
  dark_bg: string;
  dark_bg_2: string;
  dark_ui: string;
  dark_ui_2: string;
  dark_ui_3: string;
  dark_tx: string;
  dark_tx_2: string;
  dark_tx_3: string;
  dark_pr: string;
  dark_sc: string;
  dark_ac_1: string;
  dark_ac_2: string;
  dark_ac_3: string;
}

export interface UserThemeData extends ThemeData {
  provider: "tinte";
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export interface ThemeTransformOptions {
  author?: string;
  description?: string;
  tags?: string[];
}