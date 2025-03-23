import { ShadcnThemeSelect } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export async function getShadcnThemes({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const response = await fetch(
    `/api/shadcn?page=${page}&limit=${limit}&search=${search}`
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

export const useShadcnThemes = ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["shadcn-themes", page, limit, search],
    queryFn: () => getShadcnThemes({ page, limit, search }),
  });
};
