import type { AlacrittyTheme } from "@/lib/providers/alacritty";
import { useThemeContext } from "@/providers/theme";

interface AlacrittyPreviewProps {
  theme: { light: AlacrittyTheme; dark: AlacrittyTheme };
  className?: string;
}

export function AlacrittyPreview({ theme, className }: AlacrittyPreviewProps) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === "dark" ? theme.dark : theme.light;

  const terminalContent = `$ alacritty --version
alacritty 0.13.2
$ ls -la
total 48
drwxr-xr-x  8 user  staff   256 Jan  1 12:00 .
drwxr-xr-x  5 user  staff   160 Jan  1 11:00 ..
-rw-r--r--  1 user  staff  1024 Jan  1 12:00 .alacritty.yml
-rw-r--r--  1 user  staff   512 Jan  1 11:30 README.md
drwxr-xr-x  3 user  staff    96 Jan  1 11:45 src/
$ cat hello.py
#!/usr/bin/env python3

def greet(name):
    """Greet someone with a friendly message."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
    print("Welcome to Alacritty!")
$ python hello.py
Hello, World!
Welcome to Alacritty!
$ █`;

  return (
    <div
      className={`rounded-lg border overflow-hidden font-mono text-sm ${className || ""}`}
      style={{
        backgroundColor: currentTheme.colors.primary.background,
        color: currentTheme.colors.primary.foreground,
      }}
    >
      {/* Terminal header */}
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{ borderColor: `${currentTheme.colors.normal.white}20` }}
      >
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs ml-2">Alacritty Terminal</div>
      </div>

      {/* Terminal content */}
      <div className="p-4 h-96 overflow-hidden">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {terminalContent.split("\n").map((line, index) => {
            if (line.startsWith("$ ")) {
              // Command prompt
              return (
                <div key={index} className="flex">
                  <span style={{ color: currentTheme.colors.bright.green }}>
                    ${" "}
                  </span>
                  <span
                    style={{ color: currentTheme.colors.primary.foreground }}
                  >
                    {line.slice(2)}
                  </span>
                </div>
              );
            } else if (line.startsWith("#!/usr/bin/env python3")) {
              // Shebang
              return (
                <div
                  key={index}
                  style={{
                    color:
                      currentTheme.colors.dim?.blue ||
                      currentTheme.colors.bright.blue,
                  }}
                >
                  {line}
                </div>
              );
            } else if (
              line.includes("def ") ||
              line.includes("if ") ||
              line.includes("return ") ||
              line.includes("print(")
            ) {
              // Python keywords
              return (
                <div key={index}>
                  {line
                    .split(
                      /(\bdef\b|\bif\b|\breturn\b|\bprint\b|__name__|__main__)/,
                    )
                    .map((part, i) => {
                      if (["def", "if", "return", "print"].includes(part)) {
                        return (
                          <span
                            key={i}
                            style={{
                              color: currentTheme.colors.bright.magenta,
                            }}
                          >
                            {part}
                          </span>
                        );
                      } else if (part === "__name__" || part === "__main__") {
                        return (
                          <span
                            key={i}
                            style={{ color: currentTheme.colors.bright.yellow }}
                          >
                            {part}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={i}
                          style={{
                            color: currentTheme.colors.primary.foreground,
                          }}
                        >
                          {part}
                        </span>
                      );
                    })}
                </div>
              );
            } else if (line.includes('"') && line.includes("Hello")) {
              // Strings
              return (
                <div key={index}>
                  {line.split(/("[^"]*")/).map((part, i) =>
                    part.startsWith('"') ? (
                      <span
                        key={i}
                        style={{ color: currentTheme.colors.bright.green }}
                      >
                        {part}
                      </span>
                    ) : (
                      <span
                        key={i}
                        style={{
                          color: currentTheme.colors.primary.foreground,
                        }}
                      >
                        {part}
                      </span>
                    ),
                  )}
                </div>
              );
            } else if (
              line.includes("total") ||
              line.includes("drwx") ||
              line.includes("-rw-")
            ) {
              // File listing
              return (
                <div key={index}>
                  {line
                    .split(/(\d+)|(drwx[\w-]+)|(-rw-[\w-]+)|(\.[\w.]+)/)
                    .map((part, i) => {
                      if (part && /^\d+$/.test(part)) {
                        return (
                          <span
                            key={i}
                            style={{ color: currentTheme.colors.bright.cyan }}
                          >
                            {part}
                          </span>
                        );
                      } else if (part?.startsWith("drwx")) {
                        return (
                          <span
                            key={i}
                            style={{ color: currentTheme.colors.bright.blue }}
                          >
                            {part}
                          </span>
                        );
                      } else if (part?.startsWith("-rw-")) {
                        return (
                          <span
                            key={i}
                            style={{ color: currentTheme.colors.normal.white }}
                          >
                            {part}
                          </span>
                        );
                      } else if (part?.startsWith(".")) {
                        return (
                          <span
                            key={i}
                            style={{ color: currentTheme.colors.bright.yellow }}
                          >
                            {part}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={i}
                          style={{
                            color: currentTheme.colors.primary.foreground,
                          }}
                        >
                          {part}
                        </span>
                      );
                    })}
                </div>
              );
            } else if (line === "$ █") {
              // Cursor
              return (
                <div key={index} className="flex items-center">
                  <span style={{ color: currentTheme.colors.bright.green }}>
                    ${" "}
                  </span>
                  <span
                    className="animate-pulse inline-block w-2 h-4 ml-1"
                    style={{
                      backgroundColor: currentTheme.colors.cursor.cursor,
                    }}
                  />
                </div>
              );
            }
            return (
              <div
                key={index}
                style={{ color: currentTheme.colors.primary.foreground }}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1 text-xs border-t"
        style={{
          borderColor: `${currentTheme.colors.normal.white}20`,
          backgroundColor: currentTheme.colors.primary.background,
          color:
            currentTheme.colors.dim?.white ||
            currentTheme.colors.primary.dim_foreground,
        }}
      >
        Alacritty Terminal • {currentMode} mode
      </div>
    </div>
  );
}
