import { cn } from "@/lib/utils";

interface PresetSelectorProps {
  presets: Record<string, any>;
  currentTheme: "light" | "dark";
  selectedPreset: string;
  onPresetSelect: (presetName: string) => void;
}

export const PresetSelector = ({
  presets,
  currentTheme,
  selectedPreset,
  onPresetSelect,
}: PresetSelectorProps) => {
  return (
    <div className="flex flex-col gap-2 border p-2">
      <h2 className="text-sm font-mono font-bold">Presets</h2>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(presets).map((presetName) => (
          <button
            key={presetName}
            className={cn(
              "px-2 py-1 bg-background-2 text-xs font-mono rounded flex gap-2 border border-transparent hover:border-primary dark:hover:border-primary/70 transition-colors duration-200",
              {
                "border-primary dark:border-primary/70 bg-muted":
                  selectedPreset === presetName,
              }
            )}
            onClick={() => onPresetSelect(presetName)}
          >
            <span
              className="w-4 h-4 rounded-full flex"
              style={{
                backgroundImage:
                  currentTheme &&
                  `linear-gradient(140deg, ${presets[presetName]?.[currentTheme].primary}, ${presets[presetName]?.[currentTheme].accent})`,
              }}
            />
            <span>{presetName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
