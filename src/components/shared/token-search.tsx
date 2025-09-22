"use client";

import { Search, X } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TokenSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  value?: string;
}

export function TokenSearch({
  placeholder = "Search tokens...",
  onSearch,
  className,
  value: externalValue
}: TokenSearchProps) {
  const [query, setQuery] = React.useState(externalValue || "");

  React.useEffect(() => {
    if (externalValue !== undefined) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}