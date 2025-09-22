"use client";

import { ChevronsUpDown, Clock } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_FORMATTED_PROVIDERS } from "@/config/providers";
import { getAvailableProviders } from "@/lib/providers";

interface ProviderSwitcherProps {
  className?: string;
}

export function ProviderSwitcher({ className }: ProviderSwitcherProps) {
  const [provider, setProvider] = useQueryState("provider", {
    defaultValue: "shadcn",
  });
  const [open, setOpen] = React.useState(false);

  const availableProviders = React.useMemo(() => {
    return getAvailableProviders().map((p) => ({
      id: p.metadata.id,
      name: p.metadata.name,
      icon: p.metadata.icon,
      category: p.metadata.category,
      available: true,
    }));
  }, []);

  const plannedProviders = React.useMemo(() => {
    const availableIds = new Set(availableProviders.map((p) => p.id));
    return ALL_FORMATTED_PROVIDERS.filter((p) => !availableIds.has(p.id)).map(
      (p) => ({
        ...p,
        available: false,
      }),
    );
  }, [availableProviders]);

  const allProviders = React.useMemo(
    () => [...availableProviders, ...plannedProviders],
    [availableProviders, plannedProviders],
  );

  const activeProvider = React.useMemo(() => {
    return allProviders.find((p) => p.id === provider) || availableProviders[0];
  }, [allProviders, provider, availableProviders]);

  const handleProviderSelect = React.useCallback(
    (providerId: string) => {
      if (provider !== providerId) {
        setProvider(providerId);
      }
      setOpen(false);
    },
    [provider, setProvider],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={`justify-between ${className} hover:text-muted-foreground w-[22ch] transition-all duration-150`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {activeProvider.icon && (
              <activeProvider.icon
                key={activeProvider.id}
                className="h-4 w-4 shrink-0 transition-all duration-150"
              />
            )}
            <span
              key={`${activeProvider.id}-name`}
              className="font-medium max-w-[8ch] md:max-w-none truncate transition-all duration-150"
            >
              {activeProvider.name}
            </span>
            {!activeProvider.available && (
              <Clock className="h-3 w-3 text-amber-500 shrink-0 transition-all duration-150" />
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[calc(var(--radix-popover-trigger-width)+2rem)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search providers..." className="h-9" />
          <CommandList className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-border">
            <CommandEmpty>No provider found.</CommandEmpty>

            {availableProviders.length > 0 && (
              <CommandGroup heading="Available">
                {availableProviders.map((prov) => (
                  <CommandItem
                    key={prov.id}
                    value={prov.id}
                    onSelect={() => handleProviderSelect(prov.id)}
                    className="gap-2"
                  >
                    {prov.icon && <prov.icon className="h-4 w-4" />}
                    <span className="flex-1">{prov.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {plannedProviders.length > 0 && (
              <CommandGroup heading="Coming Soon">
                {plannedProviders.map((prov) => (
                  <CommandItem
                    key={prov.id}
                    value={prov.id}
                    onSelect={() => {
                      setOpen(false);
                    }}
                    className="gap-2 opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <prov.icon className="h-4 w-4" />
                    <span className="flex-1">{prov.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
