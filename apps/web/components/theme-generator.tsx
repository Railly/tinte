import { Button } from "./ui/button";
import { IconGenerate, IconLoading, IconSparkles } from "./ui/icons";
import { Textarea } from "./ui/textarea";

interface ThemeGeneratorProps {
  onGenerateTheme: (description: string) => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  themeDescription: string;
  setThemeDescription: (description: string) => void;
  onEnhanceDescription: () => void;
}

export const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({
  onGenerateTheme,
  isGenerating,
  isEnhancing,
  themeDescription,
  setThemeDescription,
  onEnhanceDescription,
}) => {
  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Theme Generator</h2>
        <Button
          variant="outline"
          onClick={() => onGenerateTheme(themeDescription)}
          disabled={isGenerating || themeDescription.trim().length < 3}
        >
          {isGenerating ? (
            <IconLoading className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconGenerate className="w-4 h-4 mr-2" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate Theme"}</span>
        </Button>
      </div>

      <div className="p-2 relative">
        <Textarea
          placeholder="Describe your theme here..."
          value={themeDescription}
          onChange={(e) => setThemeDescription(e.target.value)}
          className="resize-none w-full !h-32 !pb-10"
          minLength={3}
          maxLength={150}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onEnhanceDescription}
          className="absolute bottom-4 left-4 text-muted-foreground hover:text-foreground"
          disabled={isEnhancing || themeDescription.trim().length < 3}
        >
          {isEnhancing ? (
            <>
              <IconLoading className="w-4 h-4 mr-1 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <IconSparkles className="w-4 h-4 mr-1" />
              Enhance
            </>
          )}
        </Button>
        <span className="absolute bottom-4 right-4 text-muted-foreground text-sm">
          {themeDescription.length}/150
        </span>
      </div>
    </div>
  );
};
