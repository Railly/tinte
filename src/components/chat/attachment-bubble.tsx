import type { Attachment } from '@/utils/seed-mapper';

interface AttachmentBubbleProps {
  att: Attachment;
}

export function AttachmentBubble({ att }: AttachmentBubbleProps) {
  switch (att.kind) {
    case 'image':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-2 mr-auto border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {att.imageData ? (
            <img src={att.imageData} alt="" className="rounded-md max-h-64 w-full object-cover" />
          ) : (
            <div className="text-xs text-muted-foreground p-4 text-center">[image omitted]</div>
          )}
        </div>
      );
    case 'palette':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-2">Color Palette</div>
          <div className="grid grid-cols-10 gap-1">
            {(att.colors ?? []).slice(0, 10).map((c, i) => (
              <div
                key={i}
                className="h-4 w-full rounded-sm border border-border/20 shadow-sm"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono truncate">
            {(att.colors ?? []).join(' ')}
          </div>
        </div>
      );
    case 'url':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-1">URL</div>
          <div className="text-sm break-all">{att.content}</div>
        </div>
      );
    case 'tailwind':
    case 'cssvars':
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {att.kind === 'tailwind' ? 'Tailwind Config' : 'CSS Variables'}
          </div>
          <pre className="text-[10px] whitespace-pre-wrap text-muted-foreground bg-background/50 p-2 rounded border">
            {att.content}
          </pre>
        </div>
      );
    default:
      return (
        <div className="max-w-[80%] rounded-lg bg-muted/50 p-3 mr-auto border border-border/50">
          <pre className="text-[11px] whitespace-pre-wrap text-muted-foreground">{att.content}</pre>
        </div>
      );
  }
}