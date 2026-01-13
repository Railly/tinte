"use client";

import {
  Check,
  Copy,
  Download,
  Edit3,
  FileText,
  Settings,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { CSSIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib";

interface ToolbarDropdownMenuProps {
  currentProviderId: string;
  isOwnTheme: boolean;
  isAuthenticated: boolean;
  onExport: () => Promise<void>;
  onCopyTheme: () => Promise<void>;
  onImportClick: () => void;
  onShareClick: () => void;
  onRenameClick: () => void;
  onDuplicateClick: () => void;
  onDeleteClick: () => void;
  onSignInClick: () => void;
}

export function ToolbarDropdownMenu({
  currentProviderId,
  isOwnTheme,
  isAuthenticated,
  onExport,
  onCopyTheme,
  onImportClick,
  onShareClick,
  onRenameClick,
  onDuplicateClick,
  onDeleteClick,
  onSignInClick,
}: ToolbarDropdownMenuProps) {
  const [copiedAction, setCopiedAction] = useState<
    "file" | "theme" | "command" | null
  >(null);

  const handleExportClick = async () => {
    await onExport();
    setCopiedAction("file");
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleCopyThemeClick = async () => {
    await onCopyTheme();
    setCopiedAction("theme");
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleDuplicateClick = () => {
    if (!isAuthenticated) {
      onSignInClick();
      return;
    }
    onDuplicateClick();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {currentProviderId === "vscode" && (
          <DropdownMenuItem
            onClick={handleExportClick}
            className="relative overflow-hidden"
          >
            <div
              className={cn(
                "flex items-center gap-2 w-full transition-all duration-300",
                copiedAction === "file"
                  ? "opacity-0 scale-75 blur-sm"
                  : "opacity-100 scale-100 blur-0",
              )}
            >
              <Download className="h-4 w-4" />
              Download VSIX
            </div>
            <div
              className={cn(
                "absolute inset-0 flex items-center gap-2 px-2 transition-all duration-300",
                copiedAction === "file"
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-75 blur-sm pointer-events-none",
              )}
            >
              <Check className="h-4 w-4" />
              Downloaded!
            </div>
          </DropdownMenuItem>
        )}
        {(currentProviderId === "shadcn" || currentProviderId === "shiki") && (
          <>
            <DropdownMenuItem
              onClick={handleExportClick}
              className="relative overflow-hidden"
            >
              <div
                className={cn(
                  "flex items-center gap-2 w-full transition-all duration-300",
                  copiedAction === "file"
                    ? "opacity-0 scale-75 blur-sm"
                    : "opacity-100 scale-100 blur-0",
                )}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSS
              </div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center gap-2 px-2 transition-all duration-300",
                  copiedAction === "file"
                    ? "opacity-100 scale-100 blur-0"
                    : "opacity-0 scale-75 blur-sm pointer-events-none",
                )}
              >
                <Check className="h-4 w-4" />
                Downloaded!
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCopyThemeClick}
              className="relative overflow-hidden"
            >
              <div
                className={cn(
                  "flex items-center gap-2 w-full transition-all duration-300",
                  copiedAction === "theme"
                    ? "opacity-0 scale-75 blur-sm"
                    : "opacity-100 scale-100 blur-0",
                )}
              >
                <CSSIcon className="h-4 w-4 mr-2" />
                Copy CSS
              </div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center gap-2 px-2 transition-all duration-300",
                  copiedAction === "theme"
                    ? "opacity-100 scale-100 blur-0"
                    : "opacity-0 scale-75 blur-sm pointer-events-none",
                )}
              >
                <Check className="h-4 w-4" />
                Copied!
              </div>
            </DropdownMenuItem>
          </>
        )}
        {currentProviderId !== "vscode" &&
          currentProviderId !== "shadcn" &&
          currentProviderId !== "shiki" && (
            <>
              <DropdownMenuItem
                onClick={handleExportClick}
                className="relative overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 w-full transition-all duration-300",
                    copiedAction === "file"
                      ? "opacity-0 scale-75 blur-sm"
                      : "opacity-100 scale-100 blur-0",
                  )}
                >
                  <Download className="h-4 w-4" />
                  Download File
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center gap-2 px-2 transition-all duration-300",
                    copiedAction === "file"
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-75 blur-sm pointer-events-none",
                  )}
                >
                  <Check className="h-4 w-4" />
                  Downloaded!
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCopyThemeClick}
                className="relative overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 w-full transition-all duration-300",
                    copiedAction === "theme"
                      ? "opacity-0 scale-75 blur-sm"
                      : "opacity-100 scale-100 blur-0",
                  )}
                >
                  <Copy className="h-4 w-4" />
                  Copy JSON
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center gap-2 px-2 transition-all duration-300",
                    copiedAction === "theme"
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-75 blur-sm pointer-events-none",
                  )}
                >
                  <Check className="h-4 w-4" />
                  Copied!
                </div>
              </DropdownMenuItem>
            </>
          )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onImportClick}>
          <FileText className="h-4 w-4 mr-2" />
          Import CSS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShareClick}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRenameClick} disabled={!isOwnTheme}>
          <Edit3 className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        {isOwnTheme && (
          <DropdownMenuItem onClick={handleDuplicateClick}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDeleteClick} disabled={!isOwnTheme}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
