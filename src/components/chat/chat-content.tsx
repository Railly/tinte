import { ScrollArea } from '@/components/ui/scroll-area';
import { AttachmentBubble } from './attachment-bubble';
import type { SeedPayload } from '@/utils/seed-mapper';

interface ChatContentProps {
  loading: boolean;
  seed: SeedPayload | null;
}

export function ChatContent({ loading, seed }: ChatContentProps) {
  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading chat...</div>
          </div>
        ) : (
          <>
            {seed?.content && (
              <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground p-3 ml-auto">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{seed.content}</p>
              </div>
            )}
            {seed?.attachments?.length ? (
              <div className="space-y-3">
                {seed.attachments.map((att) => <AttachmentBubble key={att.id} att={att} />)}
              </div>
            ) : null}
            {!seed && (
              <div className="text-xs text-muted-foreground text-center py-8">
                No draft found. (Anon mode, no persistence yet.)
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground">Reply box TODO…</div>
      </div>
    </ScrollArea>
  );
}