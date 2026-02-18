import { formatHex, interpolate, oklch, rgb } from "culori";
import type { TinteBlock } from "@tinte/core";
import type { ZedTheme, ZedThemeFamily, ZedThemeStyle } from "@tinte/core";

// Helper functions for color manipulation
function ensureAlpha(color: string, alpha: number = 1): string {
  // Zed only accepts 6-digit hex colors (#RRGGBB), no alpha channel
  // If alpha < 1, we blend with white/black to simulate transparency
  const parsed = rgb(color);
  if (!parsed) return color;

  let r = parsed.r * 255;
  let g = parsed.g * 255;
  let b = parsed.b * 255;

  // If alpha < 1, blend with white (for light backgrounds) or black (for dark)
  // This is a simplification since we can't use true alpha in Zed
  if (alpha < 1) {
    const blend = 255; // Blend with white for now
    r = r * alpha + blend * (1 - alpha);
    g = g * alpha + blend * (1 - alpha);
    b = b * alpha + blend * (1 - alpha);
  }

  const rHex = Math.round(r).toString(16).padStart(2, "0");
  const gHex = Math.round(g).toString(16).padStart(2, "0");
  const bHex = Math.round(b).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

function adjustLuminance(color: string, amount: number): string {
  const parsed = oklch(color);
  if (!parsed) return color;

  const newL = Math.max(0, Math.min(1, parsed.l + amount));
  return formatHex({ ...parsed, l: newL }) || color;
}

function mixColors(
  color1: string,
  color2: string,
  ratio: number = 0.5,
): string {
  const interpolator = interpolate([color1, color2], "oklch");
  return formatHex(interpolator(ratio)) || color1;
}

export function tinteToZed(
  light: TinteBlock,
  dark: TinteBlock,
  themeName: string = "Custom Theme",
  author: string = "Tinte",
): ZedThemeFamily {
  return {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: themeName,
    author,
    themes: [
      createZedTheme(light, "light", `${themeName} Light`),
      createZedTheme(dark, "dark", `${themeName} Dark`),
    ],
  };
}

function createZedTheme(
  theme: TinteBlock,
  appearance: "light" | "dark",
  name: string,
): ZedTheme {
  const isDark = appearance === "dark";

  // Extract base colors from TinteBlock
  const bg = theme.bg;
  const bg2 = theme.bg_2;
  const fg = theme.tx;
  const primary = theme.pr;
  const secondary = theme.sc;
  const accent1 = theme.ac_1;
  const accent2 = theme.ac_2;
  const accent3 = theme.ac_3;

  // Create accent colors array
  const accents = [
    accent1,
    primary,
    secondary,
    accent2,
    accent3,
    primary,
    secondary,
  ].map((c) => ensureAlpha(c));

  const style: ZedThemeStyle = {
    // Borders
    border: theme.ui,
    "border.variant": theme.ui_2,
    "border.focused": ensureAlpha(mixColors(primary, bg, 0.3)),
    "border.selected": ensureAlpha(mixColors(primary, bg, 0.3)),
    "border.transparent": "#00000000",
    "border.disabled": theme.ui,

    // Surfaces
    "elevated_surface.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "surface.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    background: bg,

    // Elements
    "element.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "element.hover": theme.ui_2,
    "element.active": theme.ui_3,
    "element.selected": theme.ui_3,
    "element.disabled": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "drop_target.background": ensureAlpha(mixColors(primary, bg, 0.2), 0.5),

    // Ghost elements
    "ghost_element.background": "#00000000",
    "ghost_element.hover": theme.ui_2,
    "ghost_element.active": theme.ui_3,
    "ghost_element.selected": theme.ui_3,
    "ghost_element.disabled": adjustLuminance(bg, isDark ? 0.05 : -0.03),

    // Text
    text: fg,
    "text.muted": theme.tx_2,
    "text.placeholder": theme.tx_3,
    "text.disabled": theme.tx_3,
    "text.accent": primary,

    // Icons
    icon: fg,
    "icon.muted": theme.tx_2,
    "icon.disabled": theme.tx_3,
    "icon.placeholder": theme.tx_2,
    "icon.accent": primary,

    // Chrome
    "status_bar.background": bg,
    "title_bar.background": bg,
    "title_bar.inactive_background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "toolbar.background": bg2,
    "tab_bar.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "tab.inactive_background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "tab.active_background": bg2,
    "search.match_background": ensureAlpha(primary, 0.4),

    // Panels
    "panel.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "panel.focused_border": primary,
    "pane.focused_border": null,

    // Scrollbar
    "scrollbar.thumb.background": ensureAlpha(fg, 0.3),
    "scrollbar.thumb.hover_background": theme.ui_2,
    "scrollbar.thumb.border": theme.ui_2,
    "scrollbar.track.background": "#00000000",
    "scrollbar.track.border": adjustLuminance(bg, isDark ? 0.03 : -0.02),

    // Editor
    "editor.foreground": fg,
    "editor.background": bg2,
    "editor.gutter.background": bg2,
    "editor.subheader.background": adjustLuminance(bg, isDark ? 0.05 : -0.03),
    "editor.active_line.background": ensureAlpha(
      adjustLuminance(bg, isDark ? 0.05 : -0.03),
      0.75,
    ),
    "editor.highlighted_line.background": adjustLuminance(
      bg,
      isDark ? 0.05 : -0.03,
    ),
    "editor.line_number": theme.tx_3,
    "editor.active_line_number": theme.tx_2,
    "editor.hover_line_number": theme.tx_2,
    "editor.invisible": theme.tx_3,
    "editor.wrap_guide": ensureAlpha(fg, 0.05),
    "editor.active_wrap_guide": ensureAlpha(fg, 0.1),
    "editor.document_highlight.read_background": ensureAlpha(primary, 0.1),
    "editor.document_highlight.write_background": ensureAlpha(fg, 0.4),

    // Terminal ANSI colors
    "terminal.background": bg2,
    "terminal.foreground": fg,
    "terminal.bright_foreground": fg,
    "terminal.dim_foreground": bg2,
    "terminal.ansi.black": bg2,
    "terminal.ansi.bright_black": theme.tx_3,
    "terminal.ansi.dim_black": fg,
    "terminal.ansi.red": accent1,
    "terminal.ansi.bright_red": adjustLuminance(accent1, isDark ? 0.3 : -0.3),
    "terminal.ansi.dim_red": adjustLuminance(accent1, isDark ? -0.3 : 0.3),
    "terminal.ansi.green": secondary,
    "terminal.ansi.bright_green": adjustLuminance(
      secondary,
      isDark ? 0.3 : -0.3,
    ),
    "terminal.ansi.dim_green": adjustLuminance(secondary, isDark ? -0.3 : 0.3),
    "terminal.ansi.yellow": accent2,
    "terminal.ansi.bright_yellow": adjustLuminance(
      accent2,
      isDark ? 0.3 : -0.3,
    ),
    "terminal.ansi.dim_yellow": adjustLuminance(accent2, isDark ? -0.3 : 0.3),
    "terminal.ansi.blue": primary,
    "terminal.ansi.bright_blue": adjustLuminance(primary, isDark ? 0.3 : -0.3),
    "terminal.ansi.dim_blue": adjustLuminance(primary, isDark ? -0.3 : 0.3),
    "terminal.ansi.magenta": accent3,
    "terminal.ansi.bright_magenta": adjustLuminance(
      accent3,
      isDark ? 0.3 : -0.3,
    ),
    "terminal.ansi.dim_magenta": adjustLuminance(accent3, isDark ? -0.3 : 0.3),
    "terminal.ansi.cyan": secondary,
    "terminal.ansi.bright_cyan": adjustLuminance(
      secondary,
      isDark ? 0.3 : -0.3,
    ),
    "terminal.ansi.dim_cyan": adjustLuminance(secondary, isDark ? -0.3 : 0.3),
    "terminal.ansi.white": fg,
    "terminal.ansi.bright_white": "#ffffff",
    "terminal.ansi.dim_white": theme.tx_2,

    // Links
    "link_text.hover": primary,

    // Version control
    "version_control.added": secondary,
    "version_control.modified": accent2,
    "version_control.deleted": accent1,

    // Status colors
    conflict: accent2,
    "conflict.background": ensureAlpha(mixColors(accent2, bg, 0.1)),
    "conflict.border": ensureAlpha(mixColors(accent2, bg, 0.3)),

    created: secondary,
    "created.background": ensureAlpha(mixColors(secondary, bg, 0.1)),
    "created.border": ensureAlpha(mixColors(secondary, bg, 0.3)),

    deleted: accent1,
    "deleted.background": ensureAlpha(mixColors(accent1, bg, 0.1)),
    "deleted.border": ensureAlpha(mixColors(accent1, bg, 0.3)),

    error: accent1,
    "error.background": ensureAlpha(mixColors(accent1, bg, 0.1)),
    "error.border": ensureAlpha(mixColors(accent1, bg, 0.3)),

    hidden: theme.tx_3,
    "hidden.background": bg,
    "hidden.border": theme.ui,

    hint: theme.tx_2,
    "hint.background": ensureAlpha(mixColors(primary, bg, 0.1)),
    "hint.border": ensureAlpha(mixColors(primary, bg, 0.3)),

    ignored: theme.tx_3,
    "ignored.background": bg,
    "ignored.border": theme.ui,

    info: primary,
    "info.background": ensureAlpha(mixColors(primary, bg, 0.1)),
    "info.border": ensureAlpha(mixColors(primary, bg, 0.3)),

    modified: accent2,
    "modified.background": ensureAlpha(mixColors(accent2, bg, 0.1)),
    "modified.border": ensureAlpha(mixColors(accent2, bg, 0.3)),

    predictive: theme.tx_2,
    "predictive.background": ensureAlpha(mixColors(secondary, bg, 0.1)),
    "predictive.border": ensureAlpha(mixColors(secondary, bg, 0.3)),

    renamed: primary,
    "renamed.background": ensureAlpha(mixColors(primary, bg, 0.1)),
    "renamed.border": ensureAlpha(mixColors(primary, bg, 0.3)),

    success: secondary,
    "success.background": ensureAlpha(mixColors(secondary, bg, 0.1)),
    "success.border": ensureAlpha(mixColors(secondary, bg, 0.3)),

    unreachable: theme.tx_2,
    "unreachable.background": bg,
    "unreachable.border": theme.ui,

    warning: accent2,
    "warning.background": ensureAlpha(mixColors(accent2, bg, 0.1)),
    "warning.border": ensureAlpha(mixColors(accent2, bg, 0.3)),

    // Player colors (for collaboration)
    players: accents.slice(0, 8).map((color) => ({
      cursor: color,
      background: color,
      selection: ensureAlpha(color, 0.24),
    })),

    // Syntax highlighting
    syntax: {
      attribute: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      boolean: {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      comment: {
        color: theme.tx_3,
        font_style: null,
        font_weight: null,
      },
      "comment.doc": {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      constant: {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      constructor: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      embedded: {
        color: secondary,
        font_style: null,
        font_weight: null,
      },
      emphasis: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      "emphasis.strong": {
        color: primary,
        font_style: null,
        font_weight: 700,
      },
      enum: {
        color: accent2,
        font_style: null,
        font_weight: null,
      },
      function: {
        color: secondary,
        font_style: null,
        font_weight: null,
      },
      "function.builtin": {
        color: accent1,
        font_style: null,
        font_weight: null,
      },
      hint: {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      keyword: {
        color: accent1,
        font_style: null,
        font_weight: null,
      },
      label: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      link_text: {
        color: secondary,
        font_style: "italic",
        font_weight: null,
      },
      link_uri: {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      namespace: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      number: {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      operator: {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      predictive: {
        color: theme.tx_2,
        font_style: "italic",
        font_weight: null,
      },
      preproc: {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      primary: {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      property: {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      punctuation: {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      "punctuation.bracket": {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      "punctuation.delimiter": {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      "punctuation.list_marker": {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      "punctuation.markup": {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      "punctuation.special": {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      selector: {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      "selector.pseudo": {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      string: {
        color: secondary,
        font_style: null,
        font_weight: null,
      },
      "string.escape": {
        color: theme.tx_2,
        font_style: null,
        font_weight: null,
      },
      "string.regex": {
        color: accent2,
        font_style: null,
        font_weight: null,
      },
      "string.special": {
        color: accent3,
        font_style: null,
        font_weight: null,
      },
      "string.special.symbol": {
        color: secondary,
        font_style: null,
        font_weight: null,
      },
      tag: {
        color: accent2,
        font_style: null,
        font_weight: null,
      },
      "text.literal": {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      title: {
        color: secondary,
        font_style: null,
        font_weight: 700,
      },
      type: {
        color: accent2,
        font_style: null,
        font_weight: null,
      },
      variable: {
        color: fg,
        font_style: null,
        font_weight: null,
      },
      "variable.special": {
        color: primary,
        font_style: null,
        font_weight: null,
      },
      variant: {
        color: primary,
        font_style: null,
        font_weight: null,
      },
    },
  };

  return {
    name,
    appearance,
    accents,
    style,
  };
}
