'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { useQueryState } from 'nuqs';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { ALL_PROVIDERS } from '@/config/providers';

interface ProviderSwitcherProps {
  className?: string;
}

export function ProviderSwitcher({ className }: ProviderSwitcherProps) {
  const [provider, setProvider] = useQueryState('provider', {
    defaultValue: 'shadcn',
    shallow: false,
  });
  const [open, setOpen] = React.useState(false);

  const activeProvider = ALL_PROVIDERS.find(p => p.id === provider) || ALL_PROVIDERS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={`justify-between ${className}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <activeProvider.icon className="h-4 w-4 shrink-0" />
            <span className="font-medium max-w-[8ch] md:max-w-none truncate">{activeProvider.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className="w-[230px] p-0">
        <Command>
          <CommandInput placeholder="Search providers..." className="h-9" />
          <CommandList>
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              {ALL_PROVIDERS.map((prov, index) => (
                <CommandItem
                  key={prov.id}
                  value={prov.id}
                  onSelect={() => {
                    setProvider(prov.id);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <prov.icon className="h-4 w-4" />
                  <span>{prov.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    ⌘{index + 1}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}