import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Terminal,
  Copy,
  MoreHorizontal,
  ExternalLink,
  Code,
  Folder,
  Palette,
  Download,
} from "lucide-react";
import { ThemeCodePreview } from "./theme-code-preview";

interface RegistryModalProps {
  providerId: string;
  isMobile: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => void;
  onCopyCommand: (command: string) => void;
  exportedTheme?: {
    filename: string;
    content: string;
  };
}

export function RegistryModal({
  providerId,
  isMobile,
  isOpen,
  onOpenChange,
  onExport,
  onCopyCommand,
  exportedTheme,
}: RegistryModalProps) {
  const ModalComponent = isMobile ? Drawer : Dialog;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;

  const getRegistryContent = () => {
    if (providerId === 'shadcn') {
      const primaryCommand = "npx shadcn@latest add theme";
      return {
        title: "Add Theme to Your Project",
        description: "Install this theme using the shadcn CLI",
        content: (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center mb-3">
                  <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">Run this command in your project:</p>
                <div className="bg-background/80 rounded-md p-3 border">
                  <code className="text-sm font-mono text-foreground select-all">{primaryCommand}</code>
                </div>
                <Button
                  onClick={() => onCopyCommand(primaryCommand)}
                  className="mt-3 w-full"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Command
                </Button>
              </div>
            </div>

            {exportedTheme && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Theme Configuration Preview</h4>
                <ThemeCodePreview
                  code={exportedTheme.content}
                  language="json"
                  filename={exportedTheme.filename}
                  onCopy={() => navigator.clipboard.writeText(exportedTheme.content)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Need alternative installation methods?</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Manual Installation</h4>
                      <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
                        <li>Download the theme configuration</li>
                        <li>Add CSS variables to globals.css</li>
                        <li>Update tailwind.config.js</li>
                        <li>Import in your app</li>
                      </ol>
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open("https://ui.shadcn.com/themes", "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )
      };
    }

    if (providerId === 'vscode') {
      const vsixFilename = exportedTheme?.filename.replace('.json', '.vsix') || 'theme.vsix';
      const primaryCommand = `code --install-extension /path/to/${vsixFilename}`;
      return {
        title: "Install in VS Code",
        description: "Download the theme file and install via command line",
        content: (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-center mb-3">
                  <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  1. Download the theme file, then run:
                </p>
                <div className="bg-background/80 rounded-md p-3 border">
                  <code className="text-sm font-mono text-foreground select-all">{primaryCommand}</code>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={onExport}
                    className="flex-1"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Theme
                  </Button>
                  <Button
                    onClick={() => onCopyCommand(primaryCommand)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {exportedTheme && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">VS Code Theme Preview</h4>
                <ThemeCodePreview
                  code={exportedTheme.content}
                  language="json"
                  filename={exportedTheme.filename}
                  onCopy={() => navigator.clipboard.writeText(exportedTheme.content)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Other installation options?</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Code className="w-3 h-3" />
                          Cursor
                        </h4>
                        <code className="text-xs font-mono bg-muted p-1 rounded block mt-1">
                          cursor --install-extension /path/to/{vsixFilename}
                        </code>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Folder className="w-3 h-3" />
                          Local Project
                        </h4>
                        <code className="text-xs font-mono bg-muted p-1 rounded block mt-1">
                          npx registry install-theme --local .vscode/
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">
                          Experimental: Install locally in project
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                      <strong>Note:</strong> UI import may not work in Cursor. Use CLI for best results.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )
      };
    }

    return { title: "", description: "", content: null };
  };

  const registryContent = getRegistryContent();

  return (
    <ModalComponent open={isOpen} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
        >
          {providerId === 'shadcn' ? (
            <>
              <Palette className="w-4 h-4" />
              <span>Install Guide</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4" />
              <span>Install Guide</span>
            </>
          )}
        </Button>
      </ModalTrigger>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>{registryContent.title}</ModalTitle>
          <ModalDescription>
            {registryContent.description}
          </ModalDescription>
        </ModalHeader>
        <div className="p-4">
          {registryContent.content}
        </div>
      </ModalContent>
    </ModalComponent>
  );
}