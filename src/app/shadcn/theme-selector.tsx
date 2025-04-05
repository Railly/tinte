"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { ShadcnThemeSelect, UserSelect } from "@/db/schema";
import { useShadcnSelectedTheme } from "@/hooks/use-shadcn-selected-theme";
import { getShadcnThemes, useShadcnThemes } from "@/hooks/use-shadcn-themes";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React from "react";

export function ThemeSelector() {
  const queryClient = useQueryClient();
  const { resolvedTheme  } = useTheme();

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const {
    selectedThemeId,
    setSelectedThemeId,
    data: selectedTheme,
  } = useShadcnSelectedTheme();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data: themes, isLoading } = useShadcnThemes({
    page: page ? Number(page) : 1,
    limit: 10,
    search: search || "",
  });

  React.useEffect(() => {
    if (themes) {
      if (themes.pagination.currentPage < themes.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ["shadcn-themes", page + 1, 10, search],
          queryFn: () => getShadcnThemes({ page: page + 1, limit: 10, search }),
        });
      }
      if (themes.pagination.currentPage > 1) {
        queryClient.prefetchQuery({
          queryKey: ["shadcn-themes", page - 1, 10, search],
          queryFn: () => getShadcnThemes({ page: page - 1, limit: 10, search }),
        });
      }
    }
  }, [themes, page, search, queryClient]);

  const currentTheme:
    | (ShadcnThemeSelect & {
        user?: UserSelect;
      })
    | undefined = React.useMemo(() => {
    if (selectedTheme) {
      return selectedTheme;
    }
    if (themes) {
      return themes.themes.find((theme) => theme.id === selectedThemeId);
    }
    return undefined;
  }, [themes, selectedTheme, selectedThemeId]);

  React.useEffect(() => {
    if (currentTheme) {
      let styleElement = document.getElementById(
        "shadcn-theme",
      ) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "shadcn-theme";
        document.head.appendChild(styleElement);
      }

      const styleSheet = styleElement.sheet;
      if (!styleSheet) return;

      // Clear existing rules
      while (styleSheet.cssRules.length > 0) {
        styleSheet.deleteRule(0);
      }

      // Add light theme rules
      const lightRule = styleSheet.insertRule(
        ":root {}",
        styleSheet.cssRules.length,
      );
      const lightStyle = (styleSheet.cssRules[lightRule] as CSSStyleRule).style;
      for (const [key, value] of Object.entries(
        currentTheme?.lightThemeColors ?? {},
      )) {
        lightStyle.setProperty(`--color-${key}`, value);
      }
      lightStyle.setProperty("--radius", currentTheme?.radius ?? "0.5rem");

      // Add dark theme rules
      const darkRule = styleSheet.insertRule(
        ".dark {}",
        styleSheet.cssRules.length,
      );
      const darkStyle = (styleSheet.cssRules[darkRule] as CSSStyleRule).style;
      for (const [key, value] of Object.entries(
        currentTheme?.darkThemeColors ?? {},
      )) {
        darkStyle.setProperty(`--color-${key}`, value);
      }
      darkStyle.setProperty("--radius", currentTheme?.radius ?? "0.5rem");
    }
  }, [currentTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-64 justify-between overflow-hidden"
        >
          <div className="flex items-center space-x-2">
            <span>{currentTheme?.name}</span>
            {currentTheme?.user && (
              <span className="text-muted-foreground text-xs">
                by {currentTheme.user.username}
              </span>
            )}
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
        <div className="p-2">
          <Input
            type="text"
            placeholder="Search themes..."
            value={search ?? undefined}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        {themes?.themes.map((theme) => {
          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border">
                  {selectedTheme?.id === theme.id && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </div>
                <span>{theme.name}</span>
                <div className="flex">
                  <span
                    className="size-4"
                    style={{
                      backgroundColor: resolvedTheme === "light" ? theme.lightThemeColors?.background : theme.darkThemeColors?.background,
                    }}
                  />
                  <span
                    className="size-4"
                    style={{
                      backgroundColor: resolvedTheme === "light" ? theme.lightThemeColors?.foreground : theme.darkThemeColors?.foreground,
                    }}
                  />
                  <span
                    className="size-4"
                    style={{ backgroundColor: resolvedTheme === "light" ? theme.lightThemeColors?.card : theme.darkThemeColors?.card }}
                  />
                  <span
                    className="size-4"
                    style={{
                      backgroundColor: resolvedTheme === "light" ? theme.lightThemeColors?.["card-foreground"] : theme.darkThemeColors?.["card-foreground"],
                    }}
                  />
                  <span
                    className="size-4"
                    style={{ backgroundColor: resolvedTheme === "light" ? theme.lightThemeColors?.primary : theme.darkThemeColors?.primary }}
                  />
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <div className="mt-2 flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((themes?.pagination.currentPage ?? 1) - 1)}
            disabled={isLoading || (themes?.pagination.currentPage ?? 1) === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {themes?.pagination.currentPage} of{" "}
            {themes?.pagination.totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((themes?.pagination.currentPage ?? 1) + 1)}
            disabled={
              isLoading ||
              (themes?.pagination.currentPage ?? 1) ===
                (themes?.pagination.totalPages ?? 1)
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
