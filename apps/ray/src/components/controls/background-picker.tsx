import { GRADIENTS, type GradientId } from "@/lib/gradients";
import { cn } from "@/lib/utils";

interface BackgroundPickerProps {
  value: GradientId;
  onChange: (id: GradientId) => void;
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-[var(--muted-foreground)] mr-1">BG</span>
      {GRADIENTS.map((gradient) => (
        <button
          type="button"
          key={gradient.id}
          title={gradient.name}
          onClick={() => onChange(gradient.id as GradientId)}
          className={cn(
            "w-7 h-7 rounded transition-all",
            value === gradient.id
              ? "ring-2 ring-[var(--foreground)] ring-offset-1 ring-offset-[var(--background)] scale-110"
              : "hover:scale-105 opacity-80 hover:opacity-100",
          )}
          style={{
            background:
              gradient.css === "transparent"
                ? "repeating-conic-gradient(#666 0% 25%, #333 0% 50%) 0 0 / 8px 8px"
                : gradient.css,
            border:
              gradient.css === "transparent"
                ? "1px solid var(--border)"
                : "none",
          }}
        />
      ))}
    </div>
  );
}
