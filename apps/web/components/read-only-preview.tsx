import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { Button } from "./ui/button";
import { IconBrush, IconEdit } from "./ui/icons";

interface ReadOnlyPreviewProps {
  theme: GeneratedVSCodeTheme;
  code?: string;
  language: string;
  setLanguage: (language: string) => void;
  width?: string;
  height?: string;
  withEditButton?: boolean;
}

const ReadOnlyPreview = ({
  theme,
  code,
  language,
  setLanguage,
  width = "100%",
  height = "h-[10.5rem]",
  withEditButton = false,
}: ReadOnlyPreviewProps) => {
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
    language,
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Preview</h2>
        <div className="flex gap-4">
          <LanguageSwitcher
            selectedLanguage={language}
            onLanguageChange={setLanguage}
            noLabel
          />
          {withEditButton && (
            <Button size="sm">
              <IconBrush className="mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
      <div
        className={cn("flex-grow overflow-hidden", height)}
        style={{
          width,
        }}
      >
        <div className="h-full overflow-auto">
          <pre
            className={cn(
              "w-full min-h-full [&>pre]:p-4 [&>pre]:h-full text-sm !text-[13px]",
              !highlightedText && "bg-muted animate-pulse",
            )}
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyPreview;
