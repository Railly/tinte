"use client";

import { ChevronsUpDown, Clock, FlaskConical } from "lucide-react";
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
import { getAvailableProviders } from "@tinte/providers";

interface ProviderSwitcherProps {
  className?: string;
}

export function ProviderSwitcher({ className }: ProviderSwitcherProps) {
  const [provider, setProvider] = useQueryState("provider", {
    defaultValue: "shadcn",
  });
  const listboxId = React.useId();
  const [open, setOpen] = React.useState(false);

  const availableProviders = React.useMemo(() => {
    return getAvailableProviders().map((p) => ({
      id: p.metadata.id,
      name: p.metadata.name,
      icon: p.metadata.icon,
      category: p.metadata.category,
      available: true,
      experimental: p.metadata.experimental,
    }));
  }, []);

  const plannedProviders = React.useMemo(() => {
    const availableIds = new Set(availableProviders.map((p) => p.id));
    return ALL_FORMATTED_PROVIDERS.filter((p) => !availableIds.has(p.id)).map(
      (p) => ({
        ...p,
        available: false,
        experimental: false,
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
          aria-controls={listboxId}
          size="sm"
          className={`justify-between ${className} hover:text-muted-foreground w-fit transition-all duration-150`}
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
            {activeProvider.available && activeProvider.experimental && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded shrink-0">
                <FlaskConical className="h-3 w-3" />
                EXPERIMENTAL
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search providers..." className="h-9" />
          <CommandList id={listboxId} className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-border">
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
                    {prov.experimental && (
                      <FlaskConical className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
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
