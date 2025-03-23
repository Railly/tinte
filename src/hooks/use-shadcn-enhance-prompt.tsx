import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useShadcnEnhancePrompt = (
  options?: Omit<
    UseMutationOptions<{ enhancedPrompt: string }, Error, string>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch(`/api/enhance/shadcn`, {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to enhance prompt");
      }

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }

      return {
        enhancedPrompt: json.enhancedPrompt as string,
      };
    },
    ...options,
  });
};
