import { ScrollArea } from "@/components/ui/scroll-area";
import type { PastedItem } from "@/lib/input-detection";
import { useWorkbenchStore } from "@/stores/workbench-store";
import { AttachmentBubble } from "./attachment-bubble";
import { ChatInput } from "./chat-input";

interface ChatContentProps {
  loading: boolean;
}

export function ChatContent({ loading }: ChatContentProps) {
  const seed = useWorkbenchStore((state) => state.seed);

  const handleChatSubmit = (content: string, attachments: PastedItem[]) => {
    // TODO: Implement actual chat functionality
    console.log("Sending chat message:", {
      content,
      attachments: attachments.length,
      attachmentTypes: attachments.map((a) => a.kind),
    });
  };

  return (
    <div className="flex flex-col h-[50vh]">
      <ScrollArea className="flex-1 min-h-0" showScrollIndicators={true}>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : seed ? (
            <div className="space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] bg-primary text-primary-foreground rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                  {/* User's text content */}
                  {seed.content && (
                    <div className="text-sm whitespace-pre-wrap mb-3 last:mb-0">
                      {seed.content}
                    </div>
                  )}

                  {/* Attachments */}
                  {seed.attachments.length > 0 && (
                    <div className="space-y-2 mt-3 first:mt-0">
                      {seed.attachments.map((attachment) => (
                        <AttachmentBubble
                          key={attachment.id}
                          att={attachment}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI response placeholder */}
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] bg-muted rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                  <div className="text-sm text-muted-foreground">
                    AI response would appear here...
                  </div>
                </div>
              </div>
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
                  <div className="text-xs text-muted-foreground">
                    Create custom colors
                  </div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Convert themes</div>
                  <div className="text-xs text-muted-foreground">
                    Between formats
                  </div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Dark mode theme</div>
                  <div className="text-xs text-muted-foreground">
                    Eye-friendly colors
                  </div>
                </button>

                <button className="p-3 text-left rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium">Improve existing</div>
                  <div className="text-xs text-muted-foreground">
                    Enhance your theme
                  </div>
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

      <ChatInput
        onSubmit={handleChatSubmit}
        placeholder="Type a message..."
        disabled={loading}
      />
    </div>
  );
}
