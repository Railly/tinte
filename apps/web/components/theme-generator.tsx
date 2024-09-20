import React from "react";
import { useThemeGenerator } from "@/lib/hooks/use-theme-generator";
import { Button } from "./ui/button";
import { IconGenerate, IconLoading, IconSparkles } from "./ui/icons";
import { Textarea } from "./ui/textarea";
import { useDescriptionEnhancer } from "@/lib/hooks/use-theme-enhancer";
import { ThemeConfig } from "@/lib/core/types";
import { Dispatch, SetStateAction } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInDialog } from "./sign-in-dialog";

interface ThemeGeneratorProps {
  themeDescription: string;
  setThemeDescription: (description: string) => void;
  setThemeConfig: Dispatch<SetStateAction<ThemeConfig>>;
  setIsColorModified: (isModified: boolean) => void;
}

const MAX_CHARS = 200;

export const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({
  themeDescription,
  setThemeDescription,
  setThemeConfig,
  setIsColorModified,
}) => {
  const user = useUser();
  const { isGenerating, generateTheme } = useThemeGenerator(setThemeConfig);
  const { isEnhancing, enhanceDescription } = useDescriptionEnhancer();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = React.useState(false);
  const [signInAction, setSignInAction] = React.useState<
    "generate" | "enhance"
  >("generate");

  const handleGenerateTheme = async () => {
    await generateTheme(themeDescription, "shallow");
    setIsColorModified(true);
  };

  const handleEnhanceDescription = async () => {
    const enhancedDescription = await enhanceDescription(
      themeDescription,
      "vscode",
    );
    if (enhancedDescription) {
      setThemeDescription(enhancedDescription);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSignInOrAction("generate");
    }
  };

  const handleSignInOrAction = (action: "generate" | "enhance") => {
    if (user.isSignedIn) {
      if (action === "generate") {
        handleGenerateTheme();
      } else {
        handleEnhanceDescription();
      }
    } else {
      setSignInAction(action);
      setIsSignInDialogOpen(true);
    }
  };

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center p-2 bg-card border-b">
        <h2 className="text-sm font-bold">Theme Generator</h2>
        <Button
          variant="outline"
          onClick={() => handleSignInOrAction("generate")}
          disabled={isGenerating || themeDescription.trim().length < 3}
        >
          {isGenerating ? (
            <IconLoading className="w-4 h-4 mr-2" />
          ) : (
            <IconGenerate className="w-4 h-4 mr-2" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate"}</span>
        </Button>
      </div>

      <div className="p-2 relative">
        <Textarea
          placeholder="Describe your theme here..."
          value={themeDescription}
          onChange={(e) => setThemeDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-none w-full !h-32 !pb-10"
          minLength={3}
          maxLength={MAX_CHARS}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSignInOrAction("enhance")}
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
          {themeDescription.length}/{MAX_CHARS}
        </span>
      </div>
      <SignInDialog
        open={isSignInDialogOpen}
        setOpen={setIsSignInDialogOpen}
        redirectUrl={`/?description=${themeDescription}&action=${signInAction}`}
      />
    </div>
  );
};
