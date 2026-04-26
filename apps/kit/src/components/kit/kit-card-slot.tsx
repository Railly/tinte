interface KitCardSlotProps {
  title: string;
  urls: string[];
  alt: string;
  step: string;
  active: boolean;
  count?: number;
}

export function KitCardSlot({
  title,
  urls,
  alt,
  step,
  active,
  count = 1,
}: KitCardSlotProps) {
  const slots = Array.from({ length: count }, (_, i) => urls[i] ?? null);

  return (
    <section
      className="overflow-hidden rounded-lg border"
      style={{
        borderColor: active ? "var(--color-tx-2)" : "var(--color-ui)",
        background: "var(--color-bg-2)",
      }}
    >
      <div
        className="flex items-baseline justify-between border-b px-4 py-2.5"
        style={{ borderColor: "var(--color-ui)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--color-tx)" }}
        >
          {title}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: active ? "var(--color-ac-2)" : "var(--color-tx-3)" }}
        >
          {urls.length === count ? "ready" : active ? step : "pending"}
        </span>
      </div>
      <div
        className={`grid gap-2 p-3 ${count > 1 ? "grid-cols-3" : "grid-cols-1"}`}
      >
        {slots.map((url, index) => (
          <div
            className="relative overflow-hidden rounded"
            key={url ?? `slot-${index}`}
            style={{
              aspectRatio: count > 1 ? "1 / 1" : "4 / 3",
              background: "var(--color-bg)",
              border: "1px solid var(--color-ui)",
            }}
          >
            {url ? (
              <img
                alt={count > 1 ? `${alt} ${index + 1}` : alt}
                className="h-full w-full animate-fade-in object-cover"
                src={url}
              />
            ) : (
              <div
                className={
                  active
                    ? "kit-shimmer h-full w-full"
                    : "h-full w-full opacity-40 bg-grid"
                }
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
