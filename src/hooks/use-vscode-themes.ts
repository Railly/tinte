import type { ShadcnThemeSelect } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export async function getVSCodeThemes({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const response = await fetch(
    `/api/vscode?page=${page}&limit=${limit}&search=${search}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch themes");
  }
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data as unknown as {
    themes: ShadcnThemeSelect[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export const useVSCodeThemes = ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["vscode-themes", page, limit, search],
    queryFn: () => getVSCodeThemes({ page, limit, search }),
  });
};
