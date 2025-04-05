import type { UserSelect, VSCodeThemeSelect } from "@/db/schema";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useVSCodeTheme = (
  id: string,
  options?: Omit<UseQueryOptions<VSCodeThemeSelect>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["vscode-theme", id],
    queryFn: () =>
      fetch(`/api/vscode/${id}`).then(
        (res) =>
          res.json() as unknown as VSCodeThemeSelect & {
            creator: UserSelect;
          },
      ),
    ...options,
  });
};
