import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useGenerateShadcnTheme = (
  options?: Omit<
    UseMutationOptions<{ id: string }, Error, string>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch("/api/shadcn/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to create theme");
      }

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return {
        id: json.id,
      };
    },
    ...options,
  });
};
