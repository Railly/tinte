import { useState } from "react";
import { toast } from "sonner";

type EnhancementType = "shadcn" | "vscode";

export const useDescriptionEnhancer = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceDescription = async (
    themeDescription: string,
    type: EnhancementType,
  ) => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch(`/api/enhance/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: themeDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance description");
      }

      const { enhancedPrompt } = await response.json();
      toast.success("Description enhanced successfully");
      return enhancedPrompt;
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  return { isEnhancing, enhanceDescription };
};
