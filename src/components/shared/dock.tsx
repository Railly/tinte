import { TinteTheme } from "@/types/tinte";
import { exportTheme } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Share, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface DockProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
}

export function Dock({ theme, providerId, providerName }: DockProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const output = exportTheme(providerId, theme);
      if (!output) {
        throw new Error(`Failed to export theme for ${providerName}`);
      }

      const blob = new Blob([output.content], { type: output.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = output.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTheme = async () => {
    try {
      const output = exportTheme(providerId, theme);
      if (output) {
        await navigator.clipboard.writeText(output.content);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        const output = exportTheme(providerId, theme);
        if (output) {
          await navigator.share({
            title: `${providerName} Theme`,
            text: `Check out this ${providerName} theme I created with Tinte`,
            files: [new File([output.content], output.filename, { type: output.mimeType })]
          });
        }
      } else {
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        className="fixed bottom-6 left-1/2 z-50"
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="bg-primary/50 text-primary-foreground backdrop-blur-sm rounded-full border border-border shadow-lg p-2 flex gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-muted"
                  onClick={handleCopyTheme}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy theme</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-muted"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share theme</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-muted"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download {providerName} theme</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}