"use client";

import {
  Grid3X3,
  Heart,
  List,
  Loader2,
  Search,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { RaycastIcon, TweakCNIcon } from "@/components/shared/icons";
import { Logo } from "@/components/shared/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface CompactFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSearching?: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  session?: any;
  disabled?: boolean;
}

const CATEGORY_OPTIONS = [
  {
    value: "community",
    label: "Community",
    icon: Users,
    description: "Public themes from all users",
  },
  {
    value: "tweakcn",
    label: "TweakCN",
    icon: TweakCNIcon,
    description: "Curated themes from TweakCN",
  },
  {
    value: "rayso",
    label: "Ray.so",
    icon: RaycastIcon,
    description: "Themes from Ray.so collection",
  },
  {
    value: "tinte",
    label: "Tinte",
    icon: Logo,
    description: "Official Tinte themes",
  },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name" },
  { value: "downloads", label: "Downloads" },
  { value: "likes", label: "Likes" },
];

export function CompactFilterBar({
  searchTerm,
  onSearchChange,
  isSearching = false,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  session,
  disabled = false,
}: CompactFilterBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  // Get current category info
  const currentCategory = CATEGORY_OPTIONS.find(
    (cat) => cat.value === activeCategory,
  );

  // Add user-specific categories if session exists
  const allCategories = [
    ...CATEGORY_OPTIONS,
    ...(session
      ? [
          {
            value: "user",
            label: "My Themes",
            icon: User,
            description: "Your personal themes",
          },
          {
            value: "favorites",
            label: "Favorites",
            icon: Heart,
            description: "Your liked themes",
          },
        ]
      : []),
  ];

  const activeFiltersCount = [
    activeCategory !== "community" ? 1 : 0,
    sortBy !== "relevance" ? 1 : 0,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-card/50 border rounded-xl backdrop-blur-sm max-w-4xl mx-auto">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        {isSearching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          placeholder={isSearching ? "Searching..." : "Search themes..."}
          className="pl-10 h-9 border-border/50 focus:border-primary/50"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Category Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 min-w-0"
            disabled={disabled || !!searchTerm.trim()}
          >
            {currentCategory?.icon && (
              <currentCategory.icon className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="hidden sm:inline truncate">
              {currentCategory?.label || "Category"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Browse by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <DropdownMenuItem
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className="gap-3 p-3"
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{category.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {category.description}
                  </div>
                </div>
                {activeCategory === category.value && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Popover */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            disabled={disabled}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-3">Sort Options</h4>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Filters</span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    onCategoryChange("community");
                    onSortChange("relevance");
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {activeFiltersCount === 0 ? (
              <p className="text-xs text-muted-foreground">No active filters</p>
            ) : (
              <div className="space-y-2">
                {activeCategory !== "community" && (
                  <div className="flex items-center justify-between text-xs">
                    <span>Category: {currentCategory?.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => onCategoryChange("community")}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                {sortBy !== "relevance" && (
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      Sort:{" "}
                      {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => onSortChange("relevance")}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* View Mode Toggle */}
      <div className="flex border rounded-lg p-0.5 bg-muted/30">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          className="h-8 px-2.5 text-xs"
          onClick={() => onViewModeChange("grid")}
          disabled={disabled}
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Grid</span>
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          className="h-8 px-2.5 text-xs"
          onClick={() => onViewModeChange("list")}
          disabled={disabled}
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">List</span>
        </Button>
      </div>
    </div>
  );
}
