import type { ShadcnThemeSelect, UserSelect } from "@/db/schema";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useShadcnTheme = (
  id: string,
  options?: Omit<UseQueryOptions<ShadcnThemeSelect>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["shadcn-theme", id],
    queryFn: () =>
      fetch(`/api/shadcn/${id}`).then(
        (res) =>
          res.json() as unknown as ShadcnThemeSelect & {
            creator: UserSelect;
          },
      ),
    ...options,
  });
};
