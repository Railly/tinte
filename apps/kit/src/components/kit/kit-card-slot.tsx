interface KitCardSlotProps {
  title: string;
  urls: string[];
  alt: string;
}

export function KitCardSlot({ title, urls, alt }: KitCardSlotProps) {
  return (
    <section className="min-h-[360px] rounded-lg border border-[#2b2925] bg-[#171613] p-4">
      <h2 className="mb-4 font-medium">{title}</h2>
      {urls.length > 0 ? (
        <div className="grid gap-3">
          {urls.map((url, index) => (
            <img
              alt={urls.length > 1 ? `${alt} ${index + 1}` : alt}
              className="aspect-[4/3] w-full animate-[fade-in_300ms_ease-out] rounded-md border border-[#2b2925] object-cover"
              key={url}
              src={url}
            />
          ))}
        </div>
      ) : (
        <div className="kit-shimmer aspect-[4/3] rounded-md border border-[#2b2925] bg-[#0c0c0b]" />
      )}
    </section>
  );
}
