import { WarpTheme } from '@/lib/providers/warp';
import { useThemeContext } from '@/providers/theme';

interface WarpPreviewProps {
  theme: { light: WarpTheme; dark: WarpTheme };
  className?: string;
}

export function WarpPreview({ theme, className }: WarpPreviewProps) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === 'dark' ? theme.dark : theme.light;
  const terminalContent = `$ warp --version
warp 0.2023.11.21.08.02.stable_02
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/components/preview/warp/warp-preview.tsx

no changes added to commit (use "git add" or "git commit -a")
$ npm run dev
> dev
> next dev

   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.1s
$ █`;

  // Use actual Warp theme colors
  const colors = {
    background: currentTheme.background,
    foreground: currentTheme.foreground,
    prompt: currentTheme.terminal_colors.bright.blue,
    success: currentTheme.terminal_colors.bright.green,
    warning: currentTheme.terminal_colors.bright.yellow,
    error: currentTheme.terminal_colors.bright.red,
    comment: currentTheme.terminal_colors.bright.black,
    accent: currentTheme.accent,
    cyan: currentTheme.terminal_colors.bright.cyan,
    blue: currentTheme.terminal_colors.normal.blue,
  };

  return (
    <div 
      className={`rounded-xl border overflow-hidden font-mono text-sm ${className || ''}`}
      style={{ 
        backgroundColor: colors.background,
        color: colors.foreground 
      }}
    >
      {/* Warp header with AI suggestions bar */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: colors.comment + '40' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-sm font-medium">Warp Terminal</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div 
            className="px-2 py-1 rounded"
            style={{ backgroundColor: colors.accent + '20', color: colors.accent }}
          >
            AI ✨
          </div>
          <div style={{ color: colors.comment }}>⌘K for commands</div>
        </div>
      </div>

      {/* Terminal content with modern styling */}
      <div className="p-4 h-96 overflow-hidden">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {terminalContent.split('\n').map((line, index) => {
            if (line.startsWith('$ ')) {
              // Command prompt with modern styling
              return (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <span style={{ color: colors.prompt }}>❯</span>
                  <span style={{ color: colors.foreground }}>{line.slice(2)}</span>
                </div>
              );
            } else if (line.includes('warp') && line.includes('version')) {
              // Version info
              return (
                <div key={index} className="mb-2">
                  {line.split(/(warp|0\.2023\.\d+\.\d+\.\d+\.stable_\d+)/).map((part, i) => {
                    if (part === 'warp') {
                      return <span key={i} style={{ color: colors.accent }}>{part}</span>;
                    } else if (part.includes('2023')) {
                      return <span key={i} style={{ color: colors.cyan }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('On branch') || line.includes('Your branch')) {
              // Git status info
              return (
                <div key={index}>
                  {line.split(/(main|origin\/main)/).map((part, i) => {
                    if (part === 'main' || part === 'origin/main') {
                      return <span key={i} style={{ color: colors.success }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('Changes not staged') || line.includes('modified:')) {
              // Git changes
              return (
                <div key={index}>
                  {line.split(/(modified:|Changes not staged|git add|git restore)/).map((part, i) => {
                    if (part === 'modified:') {
                      return <span key={i} style={{ color: colors.warning }}>{part}</span>;
                    } else if (part.includes('Changes') || part.includes('git ')) {
                      return <span key={i} style={{ color: colors.comment }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('Next.js') || line.includes('Local:') || line.includes('Ready')) {
              // Next.js output
              return (
                <div key={index}>
                  {line.split(/(▲|Next\.js|14\.0\.0|localhost:3000|✓|Ready)/).map((part, i) => {
                    if (part === '▲' || part === 'Next.js') {
                      return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                    } else if (part === '14.0.0' || part === 'localhost:3000') {
                      return <span key={i} style={{ color: colors.blue }}>{part}</span>;
                    } else if (part === '✓' || part === 'Ready') {
                      return <span key={i} style={{ color: colors.success }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.startsWith('  ') && line.includes('use ')) {
              // Git help text
              return <div key={index} style={{ color: colors.comment }}>{line}</div>;
            } else if (line === '$ █') {
              // Cursor with modern prompt
              return (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <span style={{ color: colors.prompt }}>❯</span>
                  <span 
                    className="animate-pulse inline-block w-2 h-4"
                    style={{ backgroundColor: colors.accent }}
                  />
                </div>
              );
            }
            return <div key={index} style={{ color: colors.foreground }}>{line}</div>;
          })}
        </pre>
      </div>

      {/* Modern status bar with AI features */}
      <div 
        className="px-4 py-2 text-xs border-t flex justify-between items-center"
        style={{ 
          borderColor: colors.comment + '40',
          backgroundColor: colors.background,
          color: colors.comment
        }}
      >
        <div className="flex items-center gap-4">
          <span>Warp Terminal • Modern AI-powered terminal</span>
          <span style={{ color: colors.success }}>● Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⌘D Split • ⌘T New Tab • ⌘K AI Command</span>
        </div>
      </div>
    </div>
  );
}