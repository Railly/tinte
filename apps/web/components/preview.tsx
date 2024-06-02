import { CODE_SAMPLES } from "@/lib/constants";
import { CodeEditor } from "./code-editor";
import { LanguageSwitcher } from "./language-switcher";
import { useState } from "react";

interface PreviewProps {
  theme: any;
  code?: string;
  updateCode: (value: string | undefined) => void;
}

export const Preview = ({ theme, updateCode, code }: PreviewProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    updateCode(CODE_SAMPLES[language]);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-sm font-mono uppercase font-bold">Preview</h1>
        <LanguageSwitcher
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      <CodeEditor
        theme={theme}
        code={code}
        onCodeChange={updateCode}
        language={selectedLanguage}
      />
    </div>
  );
};
