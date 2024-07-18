import { CodeEditor } from "./code-editor";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";

interface PreviewProps {
  theme: any;
  code?: string;
  updateCode: (value: string | undefined) => void;
  setColorPickerShouldBeHighlighted: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: boolean;
    }>
  >;
  selectedLanguage: string;
  themeConfig: ThemeConfig | DarkLightPalette;
  userId?: string;
  onThemeSaved?: () => void;
  isLocalTheme?: boolean;
}

export const Preview = ({
  theme,
  updateCode,
  code,
  setColorPickerShouldBeHighlighted,
  selectedLanguage,
  themeConfig,
  userId,
  onThemeSaved,
}: PreviewProps) => {
  return (
    <div className="flex gap-4 w-full h-full">
      <CodeEditor
        theme={theme}
        code={code}
        onCodeChange={updateCode}
        language={selectedLanguage}
        setColorPickerShouldBeHighlighted={setColorPickerShouldBeHighlighted}
        themeConfig={themeConfig as ThemeConfig}
        userId={userId}
        onThemeSaved={onThemeSaved}
      />
    </div>
  );
};
