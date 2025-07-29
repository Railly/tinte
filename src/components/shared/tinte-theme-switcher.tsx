'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ThemeData } from '@/lib/theme-applier';

function ColorDots({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-0.5">
      {colors.slice(0, 5).map((c, i) => (
        <div
          key={i}
          className="h-3 w-3 rounded-sm border border-border/30"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

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
  const [q, setQ] = React.useState('');
  const list = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return themes;
    return themes.filter(t =>
      t.name.toLowerCase().includes(s) ||
      (t.author ?? '').toLowerCase().includes(s) ||
      (t.tags ?? []).some(tag => tag.toLowerCase().includes(s))
    );
  }, [themes, q]);

  const active = themes.find(t => t.id === activeId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('justify-start gap-2', triggerClassName)}
          title={label}
        >
          <Search className="size-4" />
          <span className="truncate">
            {active ? active.name : label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="p-2 border-b">
          <Input
            placeholder="Search themes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-8 text-xs"
            autoFocus
          />
        </div>
        <ScrollArea className="h-80 overflow-hidden">
          <div className="p-1">
            {list.length === 0 && (
              <div className="p-3 text-xs text-muted-foreground text-center">
                No themes found
              </div>
            )}
            {list.map(t => {
              const dotColors = Object.values(t.colors);
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => { onSelect(t); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-muted'
                  )}
                >
                  <ColorDots colors={dotColors} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {t.author ?? 'unknown'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}