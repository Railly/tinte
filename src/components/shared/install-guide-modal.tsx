import { CheckCircle, Copy, Terminal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InstallGuideModalProps {
  show: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  onCopyCommand: () => void;
}

export function InstallGuideModal({
  show,
  onClose,
  providerId,
  providerName,
  onCopyCommand,
}: InstallGuideModalProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const getInstallSteps = () => {
    switch (providerId) {
      case "shadcn":
        return [
          {
            title: "Install shadcn/ui theme",
            command: "npx shadcn@latest add theme",
            description:
              "This will add the theme configuration to your project",
          },
          {
            title: "Update your CSS",
            command: "// Add the theme variables to your globals.css",
            description: "Copy the exported CSS variables to your project",
          },
        ];
      case "vscode":
        return [
          {
            title: "Download theme file",
            command: "// Theme will be downloaded as .vsix",
            description: "Save the theme file to your computer",
          },
          {
            title: "Install in VS Code",
            command: "code --install-extension /path/to/theme.vsix",
            description: "Install the extension in VS Code or Cursor",
          },
        ];
      default:
        return [
          {
            title: "Download theme",
            command: `# Download ${providerName} theme`,
            description: "Export the theme file for your editor",
          },
          {
            title: "Install theme",
            command: "# Follow provider-specific instructions",
            description: "Refer to your editor's documentation",
          },
        ];
    }
  };

  const steps = getInstallSteps();

  const handleCopyStep = async (stepIndex: number, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedStep(stepIndex);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Install {providerName} Theme
                </h3>
                <p className="text-white/60 text-sm">
                  Follow these steps to use your theme
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="border border-white/10 rounded-xl p-4 bg-white/5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-white/10 text-white border-white/20"
                    >
                      Step {index + 1}
                    </Badge>
                    <span className="text-white font-medium text-sm">
                      {step.title}
                    </span>
                  </div>

                  <p className="text-white/70 text-xs mb-3">
                    {step.description}
                  </p>

                  <div className="relative">
                    <code className="block bg-black/40 text-green-400 text-xs p-3 rounded-lg font-mono border border-white/10 pr-12">
                      {step.command}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyStep(index, step.command)}
                      className="absolute right-2 top-2 w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      {copiedStep === index ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyCommand}
                className="flex-1 text-white/80 hover:text-white hover:bg-white/10"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Quick Install
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex-1 bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
