import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatContentProps {
  loading: boolean;
}

export function ChatContent({ loading }: ChatContentProps) {
  return (
    <div className="flex flex-col h-[calc(100dvh-var(--header-height)_-_6rem)]">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                Share your ideas, ask questions, or explore themes together.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Generate a theme</div>
                  <div className="text-xs text-muted-foreground">Create custom colors</div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Convert themes</div>
                  <div className="text-xs text-muted-foreground">Between formats</div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Dark mode theme</div>
                  <div className="text-xs text-muted-foreground">Eye-friendly colors</div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Improve existing</div>
                  <div className="text-xs text-muted-foreground">Enhance your theme</div>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/70">
                <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                <span>Anonymous mode • No persistence</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 p-3 border-t border-border bg-background">
        <textarea
          placeholder="Type a message..."
          className="w-full min-h-[80px] max-h-[200px] resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={3}
        />
      </div>
    </div>
  );
}