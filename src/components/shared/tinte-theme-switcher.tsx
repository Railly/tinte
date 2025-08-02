'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeData } from '@/lib/theme-tokens';
import { ThemeColorPreview } from '@/components/shared/theme-color-preview';

export function TinteThemeSwitcher({
  themes,
  activeId,
  onSelect,
  triggerClassName,
  label = 'Themes',
}: {
  themes: ThemeData[];
  activeId?: string | null;
  onSelect: (t: ThemeData) => void;
  triggerClassName?: string;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const active = themes.find(t => t.id === activeId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={cn('justify-between gap-2', triggerClassName)}
          title={label}
        >
          <div className="flex items-center gap-2 min-w-0">
            {active && <ThemeColorPreview colors={active.colors} maxColors={3} />}
            <span className="truncate">
              {active ? active.name : label}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search themes..." className="h-9" />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {themes.map((theme) => (
                <CommandItem
                  key={theme.id}
                  value={`${theme.name} ${theme.author || ''} ${(theme.tags || []).join(' ')}`}
                  onSelect={() => {
                    onSelect(theme);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <ThemeColorPreview colors={theme.colors} maxColors={3} />
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-xs font-medium truncate">{theme.name}</span>
                    {theme.author && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {theme.author}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}