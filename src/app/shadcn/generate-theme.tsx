"use client";
import { Loader2Icon, SparklesIcon, WandSparklesIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateShadcnTheme } from "@/hooks/use-shadcn-generate-theme";
import { useCompletion } from "@ai-sdk/react";
import { useQueryState } from "nuqs";

export const GenerateTheme = () => {
  const [prompt, setPrompt] = React.useState("");

  const {
    mutate: generateTheme,
    data: generateThemeData,
    isPending: isGenerating,
    isSuccess: isGenerateSuccess,
  } = useGenerateShadcnTheme();

  const {
    completion,
    complete,
    isLoading: isEnhancing,
  } = useCompletion({
    api: "/api/shadcn/enhance",
  });

  React.useEffect(() => {
    if (!isEnhancing) {
      if (completion) {
        setPrompt(completion);
      }
    }
  }, [completion, isEnhancing]);

  const [selectedThemeId, setSelectedThemeId] = useQueryState("id");

  React.useEffect(() => {
    if (isGenerateSuccess) {
      if (selectedThemeId !== generateThemeData.id) {
        setSelectedThemeId(generateThemeData.id);
      }
    }
  }, [
    generateThemeData,
    isGenerateSuccess,
    selectedThemeId,
    setSelectedThemeId,
  ]);

  return (
    <div>
      <div className="text-center text-muted-foreground text-sm">
        Create your own theme with AI
      </div>
      <div className="relative w-full">
        <Textarea
          placeholder="What are you building today?"
          value={isEnhancing ? completion : prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="!h-32 !pb-10 w-full resize-none placeholder:text-muted-foreground/70"
          minLength={3}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 left-4 text-muted-foreground hover:text-foreground"
          onClick={() => complete(prompt)}
          type="button"
        >
          {isEnhancing ? (
            <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <SparklesIcon className="mr-1 h-4 w-4" />
          )}
          {isEnhancing ? "Enhancing..." : "Enhance"}
        </Button>
        <ShineButton
          variant="outline"
          size="sm"
          disabled={prompt.trim().length < 3 || isGenerating}
          className="absolute right-4 bottom-4"
          onClick={() => generateTheme(prompt)}
          type="button"
        >
          {isGenerating ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WandSparklesIcon className="mr-2 h-4 w-4" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate"}</span>
        </ShineButton>
      </div>
    </div>
  );
};
