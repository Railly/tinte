import { WindowsTerminalTheme } from '@/lib/providers/windows-terminal';

interface WindowsTerminalPreviewProps {
  theme: { light: WindowsTerminalTheme; dark: WindowsTerminalTheme };
  className?: string;
}

export function WindowsTerminalPreview({ theme, className }: WindowsTerminalPreviewProps) {
  const currentTheme = theme.dark;

  const terminalContent = `PS C:\\Users\\user> wt.exe --version
Windows Terminal 1.18.3181.0
PS C:\\Users\\user> Get-ChildItem

    Directory: C:\\Users\\user

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-r---        1/1/2024   12:00 PM                Desktop
d-r---        1/1/2024   11:30 AM                Documents
d-r---        1/1/2024   10:00 AM                Downloads
-a----        1/1/2024    2:30 PM           1024 settings.json

PS C:\\Users\\user> code --version
1.84.2
91d4b5b71f1d8e0e97c4d258b9ba0b7d3b6e1c5b
x64
PS C:\\Users\\user> Write-Host "Hello from Windows Terminal!" -ForegroundColor Green
Hello from Windows Terminal!
PS C:\\Users\\user> █`;

  // Use actual Windows Terminal theme colors
  const colors = {
    background: currentTheme.background,
    foreground: currentTheme.foreground,
    prompt: currentTheme.blue,
    success: currentTheme.green,
    warning: currentTheme.yellow,
    error: currentTheme.red,
    comment: currentTheme.green,
    accent: currentTheme.purple,
    cyan: currentTheme.cyan,
    blue: currentTheme.blue,
  };

  return (
    <div 
      className={`rounded-lg border overflow-hidden font-mono text-sm ${className || ''}`}
      style={{ 
        backgroundColor: colors.background,
        color: colors.foreground 
      }}
    >
      {/* Windows Terminal header */}
      <div 
        className="px-4 py-2 border-b flex items-center justify-between"
        style={{ borderColor: '#333333' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <div className="w-3 h-3 rounded-sm bg-yellow-500" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
          </div>
          <div className="text-sm">Windows Terminal</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div style={{ color: colors.comment }}>PowerShell 7.4.0</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#333333' }}>
        <div 
          className="px-4 py-1 text-xs border-r"
          style={{ 
            backgroundColor: '#1e1e1e',
            color: colors.foreground,
            borderColor: '#333333'
          }}
        >
          PowerShell
        </div>
        <div 
          className="px-4 py-1 text-xs"
          style={{ 
            backgroundColor: colors.background,
            color: colors.comment 
          }}
        >
          + New Tab
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 h-96 overflow-hidden">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {terminalContent.split('\n').map((line, index) => {
            if (line.startsWith('PS C:\\')) {
              // PowerShell prompt
              return (
                <div key={index} className="flex">
                  <span style={{ color: colors.prompt }}>PS C:\Users\user&gt; </span>
                  <span style={{ color: colors.foreground }}>{line.slice(line.indexOf('>') + 2)}</span>
                </div>
              );
            } else if (line.includes('Windows Terminal') && line.includes('1.18')) {
              // Version info
              return (
                <div key={index}>
                  {line.split(/(Windows Terminal|1\.18\.3181\.0)/).map((part, i) => {
                    if (part === 'Windows Terminal') {
                      return <span key={i} style={{ color: colors.accent }}>{part}</span>;
                    } else if (part.includes('1.18')) {
                      return <span key={i} style={{ color: colors.cyan }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('Directory:')) {
              // Directory header
              return <div key={index} style={{ color: colors.comment }}>{line}</div>;
            } else if (line.includes('Mode') && line.includes('LastWriteTime')) {
              // Table header
              return <div key={index} style={{ color: colors.prompt }}>{line}</div>;
            } else if (line.includes('----')) {
              // Table separator
              return <div key={index} style={{ color: colors.comment }}>{line}</div>;
            } else if (line.includes('d-r---') || line.includes('-a----')) {
              // File listing
              return (
                <div key={index}>
                  {line.split(/(d-r---|a----|\d+\/\d+\/\d+|\d+:\d+\s+[AP]M|\d+|Desktop|Documents|Downloads|settings\.json)/).map((part, i) => {
                    if (part === 'd-r---') {
                      return <span key={i} style={{ color: colors.blue }}>{part}</span>;
                    } else if (part === '-a----') {
                      return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                    } else if (part && /\d+\/\d+\/\d+/.test(part)) {
                      return <span key={i} style={{ color: colors.warning }}>{part}</span>;
                    } else if (part && /\d+:\d+\s+[AP]M/.test(part)) {
                      return <span key={i} style={{ color: colors.warning }}>{part}</span>;
                    } else if (part && /^\d+$/.test(part)) {
                      return <span key={i} style={{ color: colors.cyan }}>{part}</span>;
                    } else if (part === 'Desktop' || part === 'Documents' || part === 'Downloads') {
                      return <span key={i} style={{ color: colors.blue }}>{part}</span>;
                    } else if (part === 'settings.json') {
                      return <span key={i} style={{ color: colors.accent }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('code --version')) {
              // VS Code version info
              return (
                <div key={index}>
                  <span style={{ color: colors.cyan }}>1.84.2</span>
                </div>
              );
            } else if (line.includes('91d4b5b71f1d8e0e97c4d258b9ba0b7d3b6e1c5b')) {
              // Commit hash
              return <div key={index} style={{ color: colors.comment }}>{line}</div>;
            } else if (line === 'x64') {
              // Architecture
              return <div key={index} style={{ color: colors.foreground }}>{line}</div>;
            } else if (line.includes('Write-Host')) {
              // PowerShell command with highlighting
              return (
                <div key={index}>
                  {line.split(/(Write-Host|"[^"]*"|-ForegroundColor|Green)/).map((part, i) => {
                    if (part === 'Write-Host') {
                      return <span key={i} style={{ color: colors.prompt }}>{part}</span>;
                    } else if (part.startsWith('"') && part.endsWith('"')) {
                      return <span key={i} style={{ color: colors.warning }}>{part}</span>;
                    } else if (part === '-ForegroundColor' || part === 'Green') {
                      return <span key={i} style={{ color: colors.accent }}>{part}</span>;
                    }
                    return <span key={i} style={{ color: colors.foreground }}>{part}</span>;
                  })}
                </div>
              );
            } else if (line.includes('Hello from Windows Terminal!')) {
              // Output in green
              return <div key={index} style={{ color: colors.success }}>{line}</div>;
            } else if (line === 'PS C:\\Users\\user> █') {
              // Cursor
              return (
                <div key={index} className="flex items-center">
                  <span style={{ color: colors.prompt }}>PS C:\Users\user&gt; </span>
                  <span 
                    className="animate-pulse inline-block w-2 h-4 ml-1"
                    style={{ backgroundColor: colors.foreground }}
                  />
                </div>
              );
            }
            return <div key={index} style={{ color: colors.foreground }}>{line}</div>;
          })}
        </pre>
      </div>

      {/* Status bar */}
      <div 
        className="px-4 py-1 text-xs border-t flex justify-between"
        style={{ 
          borderColor: '#333333',
          backgroundColor: '#1e1e1e',
          color: colors.comment
        }}
      >
        <span>Windows Terminal • PowerShell 7.4.0</span>
        <span>Ctrl+Shift+T New Tab • Ctrl+Shift+D Split Pane</span>
      </div>
    </div>
  );
}