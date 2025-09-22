import type { KittyTheme } from "@/lib/providers/kitty";
import { useThemeContext } from "@/providers/theme";

interface KittyPreviewProps {
  theme: { light: KittyTheme; dark: KittyTheme };
  className?: string;
}

export function KittyPreview({ theme, className }: KittyPreviewProps) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === "dark" ? theme.dark : theme.light;

  const terminalContent = `$ kitty --version
kitty 0.30.1 created by Kovid Goyal
$ ps aux | grep kitty
user     12345  0.1  0.5  123456  12345 pts/0    S+   12:00   0:01 kitty
$ cat ~/.config/kitty/kitty.conf
# Kitty Configuration
font_family      Fira Code Retina
font_size        14.0
window_padding_width 8

# Tab bar
tab_bar_edge bottom
tab_bar_style powerline

# Theme colors
foreground               ${currentTheme.foreground}
background               ${currentTheme.background}
cursor                   ${currentTheme.cursor}
$ echo "Hello from Kitty!"
Hello from Kitty!
$ █`;

  return (
    <div
      className={`rounded-lg border overflow-hidden font-mono text-sm ${className || ""}`}
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.foreground,
      }}
    >
      {/* Tab bar */}
      <div className="flex">
        <div
          className="px-4 py-2 text-xs flex-1 border-r"
          style={{
            backgroundColor: currentTheme.active_tab_background,
            color: currentTheme.active_tab_foreground,
            borderColor: currentTheme.inactive_border_color,
          }}
        >
          Terminal
        </div>
        <div
          className="px-4 py-2 text-xs flex-1"
          style={{
            backgroundColor: currentTheme.inactive_tab_background,
            color: currentTheme.inactive_tab_foreground,
          }}
        >
          + New Tab
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 h-96 overflow-hidden">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {terminalContent.split("\n").map((line, index) => {
            if (line.startsWith("$ ")) {
              // Command prompt
              return (
                <div key={index} className="flex">
                  <span style={{ color: currentTheme.color2 }}>$ </span>
                  <span style={{ color: currentTheme.foreground }}>
                    {line.slice(2)}
                  </span>
                </div>
              );
            } else if (line.includes("kitty") && line.includes("version")) {
              // Version info
              return (
                <div key={index}>
                  {line.split(/(kitty|0\.30\.1|Kovid Goyal)/).map((part, i) => {
                    if (part === "kitty") {
                      return (
                        <span key={i} style={{ color: currentTheme.color5 }}>
                          {part}
                        </span>
                      );
                    } else if (part === "0.30.1" || part === "Kovid Goyal") {
                      return (
                        <span key={i} style={{ color: currentTheme.color3 }}>
                          {part}
                        </span>
                      );
                    }
                    return (
                      <span key={i} style={{ color: currentTheme.foreground }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            } else if (line.includes("user") && line.includes("pts")) {
              // Process listing
              return (
                <div key={index}>
                  {line.split(/(\d+)|(user)|(pts\/\d+)/).map((part, i) => {
                    if (part && /^\d+$/.test(part)) {
                      return (
                        <span key={i} style={{ color: currentTheme.color6 }}>
                          {part}
                        </span>
                      );
                    } else if (part === "user") {
                      return (
                        <span key={i} style={{ color: currentTheme.color4 }}>
                          {part}
                        </span>
                      );
                    } else if (part?.startsWith("pts/")) {
                      return (
                        <span key={i} style={{ color: currentTheme.color1 }}>
                          {part}
                        </span>
                      );
                    }
                    return (
                      <span key={i} style={{ color: currentTheme.foreground }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            } else if (line.startsWith("#")) {
              // Comments
              return (
                <div key={index} style={{ color: currentTheme.color8 }}>
                  {line}
                </div>
              );
            } else if (
              line.includes("font_family") ||
              line.includes("font_size") ||
              line.includes("window_padding")
            ) {
              // Config keys
              return (
                <div key={index}>
                  {line.split(/(\w+_?\w*)\s+/).map((part, i) => {
                    if (
                      part &&
                      /^\w+_?\w*$/.test(part) &&
                      part !== "Code" &&
                      part !== "Retina"
                    ) {
                      return (
                        <span key={i} style={{ color: currentTheme.color4 }}>
                          {part}
                        </span>
                      );
                    }
                    return (
                      <span key={i} style={{ color: currentTheme.foreground }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            } else if (
              line.includes("foreground") ||
              line.includes("background") ||
              line.includes("cursor")
            ) {
              // Color settings
              return (
                <div key={index}>
                  {line.split(/(\w+)\s+(#[a-fA-F0-9]{6})/).map((part, i) => {
                    if (part && /^\w+$/.test(part)) {
                      return (
                        <span key={i} style={{ color: currentTheme.color5 }}>
                          {part}
                        </span>
                      );
                    } else if (part?.startsWith("#")) {
                      return (
                        <span key={i} style={{ color: currentTheme.color3 }}>
                          {part}
                        </span>
                      );
                    }
                    return (
                      <span key={i} style={{ color: currentTheme.foreground }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            } else if (line.includes("Hello from Kitty!")) {
              // Output
              return (
                <div key={index} style={{ color: currentTheme.color2 }}>
                  {line}
                </div>
              );
            } else if (line === "$ █") {
              // Cursor
              return (
                <div key={index} className="flex items-center">
                  <span style={{ color: currentTheme.color2 }}>$ </span>
                  <span
                    className="animate-pulse inline-block w-2 h-4 ml-1"
                    style={{ backgroundColor: currentTheme.cursor }}
                  />
                </div>
              );
            }
            return (
              <div key={index} style={{ color: currentTheme.foreground }}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1 text-xs border-t flex justify-between"
        style={{
          borderColor: currentTheme.inactive_border_color,
          backgroundColor: currentTheme.inactive_tab_background,
          color: currentTheme.inactive_tab_foreground,
        }}
      >
        <span>Kitty Terminal • {currentMode} mode</span>
        <span>⌘T New Tab • ⌘W Close</span>
      </div>
    </div>
  );
}
