import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme, ColorScheme } from "@/lib/atoms";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ShadcnThemes } from "@prisma/client";
import { RefreshCw } from "lucide-react";
import { getThemes } from "@/lib/actions/shadcn-theme-actions";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface ThemePresetSelectorProps {
  onSelectPreset: (preset: Theme) => void;
  currentTheme: Theme;
  allThemes: ShadcnThemes[];
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export function ThemePresetSelector({
  onSelectPreset,
  currentTheme,
  allThemes,
  initialPagination,
}: ThemePresetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<Theme>();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(initialPagination.currentPage);
  const { resolvedTheme } = useTheme();
  const [themes, setThemes] = useState<ShadcnThemes[]>(allThemes);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasMoreThemes, setHasMoreThemes] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);

  const fetchThemes = useCallback(async (search: string, pageNum: number) => {
    setIsLoading(true);
    try {
      const { themes: newThemes, pagination } = await getThemes(
        pageNum,
        5,
        search,
      );
      if (pageNum === 1) {
        setThemes(newThemes);
      } else {
        setThemes((prevThemes) => [...prevThemes, ...newThemes]);
      }
      setThemes(newThemes);
      setPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to fetch themes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchThemes = useDebounce(
    (search: string) => fetchThemes(search, 1),
    400,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchThemes(newSearchTerm);
  };

  useEffect(() => {
    setThemes(allThemes);
    setPage(initialPagination.currentPage);
    setTotalPages(initialPagination.totalPages);
  }, [allThemes, initialPagination]);

  const convertShadcnThemeToTheme = (shadcnTheme: ShadcnThemes): Theme => {
    const parseIfString = (value: any) =>
      typeof value === "string" ? JSON.parse(value) : value;

    return {
      id: shadcnTheme.xata_id,
      name: shadcnTheme.name,
      displayName: shadcnTheme.display_name as string,
      light: parseIfString(shadcnTheme.light_scheme),
      dark: parseIfString(shadcnTheme.dark_scheme),
      //fonts: parseIfString(shadcnTheme.fonts),
      radius: shadcnTheme.radius as string,
      //space: shadcnTheme.space as string,
      //shadow: shadcnTheme.shadow as string,
      charts: parseIfString(shadcnTheme.charts),
      user: shadcnTheme.User,
      //icons: shadcnTheme.icons as string,
    };
  };

  const handleSelectTheme = async (shadcnTheme: ShadcnThemes) => {
    try {
      const theme = convertShadcnThemeToTheme(shadcnTheme);
      onSelectPreset(theme);
      setSelectedPreset(theme);
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
    }
  };

  const renderColorSwatches = (colors: ColorScheme) => (
    <div className="flex">
      {["background", "foreground", "primary", "secondary", "accent"].map(
        (key) => (
          <div
            key={key}
            className="w-4 h-4 border-t border-b border-r first:border-l first:rounded-l-sm last:rounded-r-sm"
            style={{
              backgroundColor: `hsl(${colors[key as keyof ColorScheme].h}deg ${colors[key as keyof ColorScheme].s}% ${colors[key as keyof ColorScheme].l}%)`,
            }}
          />
        ),
      )}
    </div>
  );

  const handlePrevPage = () => {
    if (page > 1) {
      fetchThemes(searchTerm, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchThemes(searchTerm, page + 1);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center space-x-2">
            {renderColorSwatches(
              resolvedTheme === "dark" ? currentTheme.dark : currentTheme.light,
            )}
            <span>{currentTheme?.displayName}</span>
          </div>
          <span className="sr-only">Toggle theme preset menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
          <Input
            type="text"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-2"
          />
        </div>
        {themes.map((theme) => {
          const colorScheme =
            resolvedTheme === "dark" ? theme.dark_scheme : theme.light_scheme;
          return (
            <DropdownMenuItem
              key={theme.xata_id}
              onClick={() => handleSelectTheme(theme)}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center border">
                  {selectedPreset?.id === theme.xata_id && (
                    <Check className="w-3 h-3 text-primary" />
                  )}
                </div>
                <span>{theme.display_name}</span>
              </div>
              {renderColorSwatches(colorScheme as ColorScheme)}
            </DropdownMenuItem>
          );
        })}
        <div className="flex items-center justify-between mt-2 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
