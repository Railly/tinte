import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  theme: any;
  code?: string;
  language: string;
  setLanguage: (language: string) => void;
  width?: string;
}

const ReadOnlyPreview = ({
  theme,
  code,
  language,
  setLanguage,
  width = "100%",
}: CodeEditorProps) => {
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
    language,
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Preview</h2>
        <LanguageSwitcher
          selectedLanguage={language}
          onLanguageChange={setLanguage}
          noLabel
        />
      </div>
      <div className="w-full flex-grow overflow-hidden">
        <pre
          className={cn(
            "w-full h-[10.5rem] overflow-auto [&>pre]:flex [&>pre]:flex-shrink [&>pre]:rounded-b-md [&>pre]:h-full [&>pre]:p-4 text-sm !text-[13px]",
            !highlightedText && "bg-muted animate-pulse"
          )}
          style={{ width }}
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>
    </div>
  );
};

export default ReadOnlyPreview;
