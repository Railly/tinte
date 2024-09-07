import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { Button } from "./ui/button";
import { IconBrush } from "./ui/icons";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInDialog } from "./sign-in-dialog";

interface ReadOnlyPreviewProps {
  theme: GeneratedVSCodeTheme;
  themeConfig?: ThemeConfig;
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
  themeConfig,
}: ReadOnlyPreviewProps) => {
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
    language,
  });

  const router = useRouter();
  const user = useUser();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const handleSignInOrEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isSignedIn) {
      router.push(`/generator?theme=${themeConfig?.name}`);
    } else {
      setIsSignInDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Preview</h2>
        <div className="flex items-center gap-2">
          <LanguageSwitcher
            selectedLanguage={language}
            onLanguageChange={setLanguage}
            noLabel
          />
          {withEditButton && (
            <Button size="sm" onClick={handleSignInOrEdit}>
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
      <SignInDialog
        open={isSignInDialogOpen}
        setOpen={setIsSignInDialogOpen}
        redirectUrl={`/generator?theme=${themeConfig?.name}`}
      />
    </div>
  );
};

export default ReadOnlyPreview;
