"use client";

import Editor from "@monaco-editor/react";
import {
  FolderIcon,
  FolderOpenedIcon,
  GolangIcon,
  JavascriptIcon,
  JsonIcon,
  MarkdownIcon,
  PythonIcon,
  TypescriptIcon,
  VSCodeIcon,
} from "@/components/shared/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMonacoEditor } from "@/components/workbench/hooks/editor/use-monaco";
import {
  type CodeTemplate,
  codeTemplates,
  type VSCodeTheme,
} from "@/lib/providers/vscode";
import { useThemeContext } from "@/providers/theme";

interface MonacoLikeEditorProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: "light" | "dark";
  template: CodeTemplate;
  themeVersion: number;
  className?: string;
  selectedTemplate?: number;
  onTemplateChange?: (index: number) => void;
}

export function MonacoLikeEditor({
  themeSet,
  currentMode,
  template,
  themeVersion,
  className,
  selectedTemplate = 0,
  onTemplateChange = () => {},
}: MonacoLikeEditorProps) {
  const getFileExtension = (language: string): string => {
    const languageToExtension: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      go: "go",
      rust: "rs",
      java: "java",
      cpp: "cpp",
      c: "c",
    };
    return languageToExtension[language] || language;
  };

  const getLanguageIcon = (
    language: string,
    className: string,
    color: string,
  ) => {
    const iconStyle = { color };
    switch (language) {
      case "javascript":
        return <JavascriptIcon className={className} style={iconStyle} />;
      case "typescript":
        return <TypescriptIcon className={className} style={iconStyle} />;
      case "python":
        return <PythonIcon className={className} style={iconStyle} />;
      case "go":
        return <GolangIcon className={className} style={iconStyle} />;
      default:
        return (
          <svg
            className={className}
            style={iconStyle}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
          </svg>
        );
    }
  };

  const getFileIcon = (filename: string, className: string, color: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const iconStyle = { color };
    switch (extension) {
      case "js":
        return <JavascriptIcon className={className} style={iconStyle} />;
      case "ts":
      case "tsx":
        return <TypescriptIcon className={className} style={iconStyle} />;
      case "py":
        return <PythonIcon className={className} style={iconStyle} />;
      case "go":
        return <GolangIcon className={className} style={iconStyle} />;
      case "json":
        return <JsonIcon className={className} style={iconStyle} />;
      case "md":
        return <MarkdownIcon className={className} style={iconStyle} />;
      default:
        return (
          <svg
            className={className}
            style={iconStyle}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
          </svg>
        );
    }
  };

  const currentTheme = themeSet[currentMode];
  const colors = currentTheme.colors;
  const { currentTokens } = useThemeContext();

  const {
    isReady,
    isViewTransitioning,
    currentThemeName,
    handleEditorDidMount,
  } = useMonacoEditor({
    themeSet,
    currentMode,
    template,
    themeVersion,
  });

  const monoFont = currentTokens["font-mono"] || "monospace";

  if (!isReady) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-sm">Loading Monaco...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full overflow-hidden font-sans text-sm ${className || ""}`}
      style={{
        background: colors["editor.background"],
        color: colors["editor.foreground"],
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center px-2 py-1 text-sm relative"
        style={{
          background: colors["titleBar.activeBackground"] || "#3c3c3c",
          color: colors["titleBar.activeForeground"] || "#cccccc",
          borderBottom: `1px solid ${colors["titleBar.border"] || "rgba(0, 0, 0, 0)"}`,
        }}
      >
        {/* VS Code Logo */}
        <div className="w-4 h-4 mr-3 flex-shrink-0">
          <VSCodeIcon />
        </div>

        {/* Menu Bar */}
        <div className="flex items-center gap-4 mr-auto">
          {[
            "File",
            "Edit",
            "Selection",
            "View",
            "Go",
            "Run",
            "Terminal",
            "Help",
          ].map((item) => (
            <div
              key={item}
              className="px-2 py-1 text-sm hover:bg-white/10 rounded cursor-default"
              style={{
                color: colors["titleBar.activeForeground"] || "#cccccc",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Language Selector */}
        <div className="ml-auto">
          <Select
            value={selectedTemplate.toString()}
            onValueChange={(value) => onTemplateChange(parseInt(value))}
          >
            <SelectTrigger
              className="w-32 h-6 text-xs border-none px-2 flex items-center gap-1"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: colors["titleBar.activeForeground"] || "#cccccc",
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeTemplates.map((template, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    {getLanguageIcon(
                      template.language,
                      "w-4 h-4",
                      "currentColor",
                    )}
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Layout: Activity Bar + (Sidebar + Editor + Terminal) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar - Full Height */}
        <div
          className="w-12 flex flex-col justify-between py-2 border-r"
          style={{
            background: colors["activityBar.background"] || "#000815",
            color:
              colors["activityBar.foreground"] || "rgba(255, 255, 255, 0.4)",
            borderRightColor: colors["activityBar.border"] || "#6c6c6c",
          }}
        >
          {/* Top Icons */}
          <div className="flex flex-col">
            {/* Files Icon - Selected */}
            <div
              className="icon-wrap selected relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                borderLeft: `2px solid ${colors["activityBar.activeBorder"] || "#ffffff"}`,
                color: colors["activityBar.activeForeground"] || "#ffffff",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5zm0 2.12l2.38 2.38H17.5zm-3 20.38h-12v-15H7v9.07L8.5 18h6zm6-6h-12v-15H16V6h4.5z" />
              </svg>
            </div>

            {/* Search Icon */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1l8.05-9.12A8.251 8.251 0 1 0 15.25.01zm0 15a6.75 6.75 0 1 1 0-13.5a6.75 6.75 0 0 1 0 13.5" />
              </svg>
            </div>

            {/* Source Control Icon with Badge */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583a2.99 2.99 0 0 1-2.668 1.67h-2.99a4.46 4.46 0 0 0-2.989 1.165V7.4a3.737 3.737 0 1 0-1.494 0v9.117a3.776 3.776 0 1 0 1.816.099a2.99 2.99 0 0 1 2.668-1.667h2.99a4.48 4.48 0 0 0 4.223-3.039a3.736 3.736 0 0 0 3.25-3.687zM4.565 3.738a2.242 2.242 0 1 1 4.484 0a2.242 2.242 0 0 1-4.484 0m4.484 16.441a2.242 2.242 0 1 1-4.484 0a2.242 2.242 0 0 1 4.484 0m8.221-9.715a2.242 2.242 0 1 1 0-4.485a2.242 2.242 0 0 1 0 4.485" />
              </svg>
              {/* Badge */}
              <div
                className="badge absolute top-1 right-1 text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center"
                style={{
                  background:
                    colors["activityBarBadge.background"] || "#007acc",
                  color: colors["activityBarBadge.foreground"] || "#ffffff",
                  fontSize: "10px",
                }}
              >
                6
              </div>
            </div>

            {/* Debug Icon */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="m10.94 13.5l-1.32 1.32a3.73 3.73 0 0 0-7.24 0L1.06 13.5L0 14.56l1.72 1.72l-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94L1.06 24l1.65-1.65A4.3 4.3 0 0 0 6 24a4.31 4.31 0 0 0 3.29-1.65L10.94 24L12 22.94L10.09 21c.198-.464.336-.951.41-1.45v-.1H12V18h-1.5v-1.5l-.22-.22L12 14.56zM6 13.5a2.25 2.25 0 0 1 2.25 2.25h-4.5A2.25 2.25 0 0 1 6 13.5m3 6a3.33 3.33 0 0 1-3 3a3.33 3.33 0 0 1-3-3v-2.25h6zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v9.46a5 5 0 0 0-1.5-.72V.63L8.64 0z" />
              </svg>
            </div>

            {/* Extensions Icon */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M13.5 1.5L15 0h7.5L24 1.5V9l-1.5 1.5H15L13.5 9zm1.5 0V9h7.5V1.5zM0 15V6l1.5-1.5H9L10.5 6v7.5H18l1.5 1.5v7.5L18 24H1.5L0 22.5zm9-1.5V6H1.5v7.5zM9 15H1.5v7.5H9zm1.5 7.5H18V15h-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Icons */}
          <div className="flex flex-col">
            {/* Account Icon with Badge */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 7.992C16 3.58 12.416 0 8 0S0 3.58 0 7.992c0 2.43 1.104 4.62 2.832 6.09c.016.016.032.016.032.032c.144.112.288.224.448.336c.08.048.144.111.224.175A8 8 0 0 0 8.016 16a8 8 0 0 0 4.48-1.375c.08-.048.144-.111.224-.16c.144-.111.304-.223.448-.335c.016-.016.032-.016.032-.032c1.696-1.487 2.8-3.676 2.8-6.106m-8 7.001c-1.504 0-2.88-.48-4.016-1.279c.016-.128.048-.255.08-.383a4.2 4.2 0 0 1 .416-.991c.176-.304.384-.576.64-.816c.24-.24.528-.463.816-.639c.304-.176.624-.304.976-.4A4.2 4.2 0 0 1 8 10.342a4.18 4.18 0 0 1 2.928 1.166q.552.552.864 1.295q.168.432.24.911A7.03 7.03 0 0 1 8 14.993m-2.448-7.4a2.5 2.5 0 0 1-.208-1.024c0-.351.064-.703.208-1.023s.336-.607.576-.847s.528-.431.848-.575s.672-.208 1.024-.208c.368 0 .704.064 1.024.208s.608.336.848.575c.24.24.432.528.576.847c.144.32.208.672.208 1.023c0 .368-.064.704-.208 1.023a2.8 2.8 0 0 1-.576.848a2.8 2.8 0 0 1-.848.575a2.72 2.72 0 0 1-2.064 0a2.8 2.8 0 0 1-.848-.575a2.5 2.5 0 0 1-.56-.848zm7.424 5.306c0-.032-.016-.048-.016-.080a5.2 5.2 0 0 0-.688-1.406a4.9 4.9 0 0 0-1.088-1.135a5.2 5.2 0 0 0-1.04-.608a3 3 0 0 0 .464-.383a4.2 4.2 0 0 0 .624-.784a3.6 3.6 0 0 0 .528-1.934a3.7 3.7 0 0 0-.288-1.47a3.8 3.8 0 0 0-.816-1.199a3.9 3.9 0 0 0-1.2-.8a3.7 3.7 0 0 0-1.472-.287a3.7 3.7 0 0 0-1.472.288a3.6 3.6 0 0 0-1.2.815a3.8 3.8 0 0 0-.8 1.199a3.7 3.7 0 0 0-.288 1.47q0 .528.144 1.007c.096.336.224.64.4.927c.16.288.384.544.624.784q.216.216.48.383a5 5 0 0 0-1.04.624c-.416.32-.784.703-1.088 1.119a5 5 0 0 0-.688 1.406c-.016.032-.016.064-.016.08C1.776 11.636.992 9.91.992 7.992C.992 4.14 4.144.991 8 .991s7.008 3.149 7.008 7.001a6.96 6.96 0 0 1-2.032 4.907" />
              </svg>
              {/* Badge */}
              <div
                className="badge absolute top-1 right-1 text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center"
                style={{
                  background:
                    colors["activityBarBadge.background"] || "#007acc",
                  color: colors["activityBarBadge.foreground"] || "#ffffff",
                  fontSize: "10px",
                }}
              >
                2
              </div>
            </div>

            {/* Settings Icon */}
            <div
              className="icon-wrap relative w-12 h-12 flex items-center justify-center cursor-pointer group"
              style={{
                color:
                  colors["activityBar.inactiveForeground"] ||
                  "rgba(255, 255, 255, 0.4)",
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="m19.85 8.75l4.15.83v4.84l-4.15.83l2.35 3.52l-3.43 3.43l-3.52-2.35l-.83 4.15H9.58l-.83-4.15l-3.52 2.35l-3.43-3.43l2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23L5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15l3.52-2.35l3.43 3.43zm-1.57 5.07l4-.81v-2l-4-.81l-.54-1.3l2.29-3.43l-1.43-1.43l-3.43 2.29l-1.3-.54l-.81-4h-2l-.81 4l-1.3.54l-3.43-2.29l-1.43 1.43L6.38 8.9l-.54 1.3l-4 .81v2l4 .81l.54 1.3l-2.29 3.43l1.43 1.43l3.43-2.29l1.3.54l.81 4h2l.81-4l1.3-.54l3.43 2.29l1.43-1.43l-2.29-3.43zm-8.186-4.672A3.43 3.43 0 0 1 12 8.57A3.44 3.44 0 0 1 15.43 12a3.43 3.43 0 1 1-5.336-2.852m.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0 0 13.71 12a1.71 1.71 0 1 0-2.66 1.422"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <style jsx>{`
            .icon-wrap:hover .codicon {
              color: #ffffff;
            }
            .icon-wrap.selected {
              border-left: 2px solid #ffffff;
              color: #ffffff;
              background: default;
            }
          `}</style>
        </div>

        {/* Right Side Content (Sidebar + Editor + Terminal) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Section (Sidebar + Editor) */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div
              className="w-64 flex flex-col border-r"
              style={{
                background: colors["sideBar.background"] || "#252526",
                color: colors["sideBar.foreground"] || "#cccccc",
                borderRightColor: colors["sideBar.border"] || "#6c6c6c",
              }}
            >
              {/* Section Header */}
              <div
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b"
                style={{
                  background:
                    colors["sideBarSectionHeader.background"] || "#252526",
                  color:
                    colors["sideBarSectionHeader.foreground"] ||
                    colors["sideBarTitle.foreground"] ||
                    "#cccccc",
                  borderBottomColor:
                    colors["sideBarSectionHeader.border"] || "#6c6c6c",
                }}
              >
                Explorer
              </div>

              <div className="flex-1 px-2 py-2">
                {/* Root folder */}
                <div
                  className="py-1 text-sm flex items-center gap-2 rounded cursor-pointer transition-colors"
                  style={{
                    color: colors["list.foreground"] || "#cccccc",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["list.hoverBackground"] ||
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color =
                      colors["list.hoverForeground"] ||
                      colors["list.foreground"] ||
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color =
                      colors["list.foreground"] || "#cccccc";
                  }}
                >
                  <FolderOpenedIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>{template.name.toLowerCase()}-project</span>
                </div>

                {/* src folder */}
                <div
                  className="pl-6 py-1 text-sm flex items-center gap-2 rounded cursor-pointer transition-colors"
                  style={{
                    color: colors["list.foreground"] || "#cccccc",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["list.hoverBackground"] ||
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color =
                      colors["list.hoverForeground"] ||
                      colors["list.foreground"] ||
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color =
                      colors["list.foreground"] || "#cccccc";
                  }}
                >
                  <FolderIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>src</span>
                </div>

                {/* Active file - uses activeSelection colors */}
                <div
                  className="pl-10 py-1 text-sm rounded flex items-center gap-2 mx-1"
                  style={{
                    background:
                      colors["list.activeSelectionBackground"] || "#094771",
                    color:
                      colors["list.activeSelectionForeground"] || "#ffffff",
                    outline: `1px solid ${colors["list.focusOutline"] || "transparent"}`,
                  }}
                >
                  {getFileIcon(
                    template.filename,
                    "w-4 h-4",
                    colors["list.activeSelectionForeground"] || "#ffffff",
                  )}
                  <span>{template.filename}</span>
                </div>

                {/* Other files */}
                <div
                  className="pl-6 py-1 text-sm flex items-center gap-2 rounded cursor-pointer transition-colors"
                  style={{
                    color: colors["list.foreground"] || "#cccccc",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["list.hoverBackground"] ||
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color =
                      colors["list.hoverForeground"] ||
                      colors["list.foreground"] ||
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color =
                      colors["list.foreground"] || "#cccccc";
                  }}
                >
                  <FolderIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>public</span>
                </div>

                <div
                  className="pl-4 py-1 text-sm flex items-center gap-2 rounded cursor-pointer transition-colors"
                  style={{
                    color: colors["list.foreground"] || "#cccccc",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["list.hoverBackground"] ||
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color =
                      colors["list.hoverForeground"] ||
                      colors["list.foreground"] ||
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color =
                      colors["list.foreground"] || "#cccccc";
                  }}
                >
                  <JsonIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>package.json</span>
                </div>

                {/* Inactive selection demonstration */}
                <div
                  className="pl-4 py-1 text-sm flex items-center gap-2 rounded cursor-pointer"
                  style={{
                    background:
                      colors["list.inactiveSelectionBackground"] ||
                      "rgba(255, 255, 255, 0.05)",
                    color:
                      colors["list.inactiveSelectionForeground"] ||
                      colors["list.foreground"] ||
                      "#cccccc",
                  }}
                >
                  <MarkdownIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>README.md</span>
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab Bar */}
              <div
                className="flex border-b"
                style={{
                  background:
                    colors["editorGroupHeader.tabsBackground"] || "#2d2d30",
                  borderBottomColor: colors["editorGroup.border"] || "#6c6c6c",
                }}
              >
                {/* Active Tab */}
                <div
                  className="px-4 py-2 text-sm border-r flex items-center gap-2 relative"
                  style={{
                    background: colors["tab.activeBackground"] || "#1e1e1e",
                    color: colors["tab.activeForeground"] || "#ffffff",
                    borderRightColor: colors["tab.border"] || "#6c6c6c",
                  }}
                >
                  {getFileIcon(
                    template.filename,
                    "w-4 h-4",
                    colors["list.activeSelectionForeground"] || "#ffffff",
                  )}
                  <span>{template.filename}</span>
                  <div
                    className="w-2 h-2 rounded-full ml-1"
                    style={{
                      background:
                        colors["tab.activeModifiedBorder"] || "#ff8c00",
                    }}
                  />
                  <button className="ml-2 w-4 h-4 text-white/60 hover:text-white/80 hover:bg-white/10 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646Z" />
                    </svg>
                  </button>
                </div>

                {/* Inactive Tab with Hover State */}
                <div
                  className="px-4 py-2 text-sm border-r flex items-center gap-2 cursor-pointer transition-colors"
                  style={{
                    background:
                      colors["tab.inactiveBackground"] || "transparent",
                    color: colors["tab.inactiveForeground"] || "#969696",
                    borderRightColor: colors["tab.border"] || "#6c6c6c",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["tab.hoverBackground"] ||
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color =
                      colors["tab.hoverForeground"] ||
                      colors["tab.activeForeground"] ||
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      colors["tab.inactiveBackground"] || "transparent";
                    e.currentTarget.style.color =
                      colors["tab.inactiveForeground"] || "#969696";
                  }}
                >
                  {getFileIcon(
                    `utils.${getFileExtension(template.language)}`,
                    "w-4 h-4",
                    colors["tab.inactiveForeground"] || "#969696",
                  )}
                  <span>utils.{getFileExtension(template.language)}</span>
                </div>

                {/* Unfocused Tab with Hover State */}
                <div
                  className="px-4 py-2 text-sm border-r flex items-center gap-2 cursor-pointer transition-colors"
                  style={{
                    background:
                      colors["tab.unfocusedInactiveBackground"] ||
                      "transparent",
                    color:
                      colors["tab.unfocusedInactiveForeground"] ||
                      "rgba(150, 150, 150, 0.7)",
                    borderRightColor: colors["tab.border"] || "#6c6c6c",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      colors["tab.unfocusedHoverBackground"] ||
                      "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color =
                      colors["tab.unfocusedHoverForeground"] ||
                      colors["tab.inactiveForeground"] ||
                      "#969696";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      colors["tab.unfocusedInactiveBackground"] ||
                      "transparent";
                    e.currentTarget.style.color =
                      colors["tab.unfocusedInactiveForeground"] ||
                      "rgba(150, 150, 150, 0.7)";
                  }}
                >
                  <JsonIcon
                    className="w-4 h-4"
                    style={{ color: colors["list.foreground"] || "#cccccc" }}
                  />
                  <span>config.json</span>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div
                className="px-4 py-1 text-xs border-b flex items-center gap-1 opacity-80"
                style={{
                  background:
                    colors["breadcrumb.background"] ||
                    colors["editor.background"] ||
                    "#1e1e1e",
                  color:
                    colors["breadcrumb.foreground"] ||
                    colors["editor.foreground"] ||
                    "#cccccc",
                  borderBottomColor: colors["editorGroup.border"] || "#6c6c6c",
                }}
              >
                <span className="cursor-pointer hover:underline">src</span>
                <span>›</span>
                <span className="cursor-pointer hover:underline">
                  {template.filename}
                </span>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden relative">
                {isViewTransitioning && (
                  <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-[1px] transition-opacity duration-100" />
                )}
                <Editor
                  height="100%"
                  width="100%"
                  className="!font-mono"
                  language={template.language}
                  value={template.code}
                  onMount={handleEditorDidMount}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: "on",
                    lineHeight: 1.5,
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 20,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    automaticLayout: false,
                    wordWrap: "on",
                    wordWrapColumn: 50,
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    fontFamily: monoFont,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "hidden",
                      useShadows: false,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                    },
                  }}
                  theme={currentThemeName}
                />
              </div>
            </div>
          </div>

          {/* Panel (Terminal/Output) */}
          <div
            className="border-t"
            style={{
              background: colors["panel.background"] || "#1e1e1e",
              borderTopColor: colors["panel.border"] || "#6c6c6c",
              height: "160px",
            }}
          >
            {/* Panel Header */}
            <div
              className="flex items-center px-4 py-1 text-sm"
              style={{
                background: colors["panelTitle.inactiveForeground"]
                  ? "transparent"
                  : colors["panel.background"] || "#1e1e1e",
                borderBottomColor: colors["panel.border"] || "#6c6c6c",
              }}
            >
              <div
                className="px-3 py-1 border-b-2 cursor-pointer"
                style={{
                  color: colors["panelTitle.activeForeground"] || "#ffffff",
                  borderBottomColor:
                    colors["panelTitle.activeBorder"] || "#007acc",
                }}
              >
                TERMINAL
              </div>
              <div
                className="px-3 py-1 cursor-pointer hover:opacity-80"
                style={{
                  color: colors["panelTitle.inactiveForeground"] || "#969696",
                }}
              >
                OUTPUT
              </div>
              <div
                className="px-3 py-1 cursor-pointer hover:opacity-80"
                style={{
                  color: colors["panelTitle.inactiveForeground"] || "#969696",
                }}
              >
                DEBUG CONSOLE
              </div>
            </div>

            {/* Terminal Content */}
            <div
              className="flex-1 p-2 text-sm font-mono overflow-auto"
              style={{
                background:
                  colors["terminal.background"] ||
                  colors["panel.background"] ||
                  "#1e1e1e",
                color: colors["terminal.foreground"] || "#cccccc",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{ color: colors["terminal.ansiGreen"] || "#16c60c" }}
                >
                  ➜
                </span>
                <span
                  style={{ color: colors["terminal.ansiCyan"] || "#3a96dd" }}
                >
                  ~
                </span>
                <span className="ml-1">npm run dev</span>
              </div>
              <div
                className="mb-1"
                style={{ color: colors["terminal.ansiYellow"] || "#d7ba7d" }}
              >
                Starting development server...
              </div>
              <div
                className="mb-1"
                style={{ color: colors["terminal.ansiGreen"] || "#16c60c" }}
              >
                ✓ Ready on http://localhost:3000
              </div>
              <div className="flex items-center gap-2">
                <span
                  style={{ color: colors["terminal.ansiGreen"] || "#16c60c" }}
                >
                  ➜
                </span>
                <span
                  style={{ color: colors["terminal.ansiCyan"] || "#3a96dd" }}
                >
                  ~
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        className="flex items-center border-t justify-between px-0 py-1 text-xs relative"
        style={{
          background: colors["statusBar.background"] || "#a179fb",
          color: `${colors["statusBar.foreground"] || "#ffffff"} !important`,
        }}
      >
        {/* Remote Item */}
        <div
          className="px-2 py-1 flex items-center cursor-pointer"
          style={{
            background: colors["statusBarItem.remoteBackground"] || "#000308",
            color: colors["statusBarItem.remoteForeground"] || "#ffffff",
          }}
        >
          {/* Codicon Remote */}
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm5.78-.25a.75.75 0 0 0-1.06 1.06L6.44 10.5H3.75a.75.75 0 0 0 0 1.5h2.69l-1.72 1.69a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3Z" />
          </svg>
        </div>

        {/* Left Items */}
        <div className="flex items-center">
          {/* Remote Icon */}
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12] flex items-center">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm5.78-.25a.75.75 0 0 0-1.06 1.06L6.44 10.5H3.75a.75.75 0 0 0 0 1.5h2.69l-1.72 1.69a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3Z" />
            </svg>
          </div>

          {/* Source Control */}
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12] flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6.5a.75.75 0 0 1-.75.75h-2.5a.25.25 0 0 0-.25.25v3.25a.75.75 0 0 1-1.5 0V7.5A1.75 1.75 0 0 1 9.25 5.75h2.5V4.872a2.25 2.25 0 1 1 0-4.494V2.25Z" />
            </svg>
            <span>master*</span>
          </div>

          {/* Error Indicator */}
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12] flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L9.06 8l-3.03-3.03Z" />
            </svg>
            <span>0</span>
          </div>

          {/* Warning Indicator */}
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12] flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047ZM8 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
            <span>1</span>
          </div>
        </div>

        {/* Right Items */}
        <div className="flex items-center">
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            Ln 9, Col 21
          </div>
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            Spaces: 4
          </div>
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            UTF-8
          </div>
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            LF
          </div>
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            {template.name}
          </div>

          {/* Smiley Icon */}
          <div className="px-2 py-1 cursor-pointer hover:bg-white/[0.12]">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM7 6.5C7 7.328 6.552 8 6 8S5 7.328 5 6.5 5.448 5 6 5s1 .672 1 1.5ZM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5c1.295 0 2.426-.703 3.032-1.75a.5.5 0 0 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683ZM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8Z" />
            </svg>
          </div>
        </div>

        <style jsx>{`
          .hover\\:bg-white\\/\\[0\\.12\\]:hover {
            background: rgba(255, 255, 255, 0.12);
          }
        `}</style>
      </div>
    </div>
  );
}
