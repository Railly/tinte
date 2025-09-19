"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  themeName?: string;
  isLoading?: boolean;
}

export function DeleteThemeDialog({
  isOpen,
  onOpenChange,
  onDelete,
  themeName = "this theme",
  isLoading = false,
}: DeleteThemeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log("🚀 Delete dialog: Starting delete for theme:", themeName);
    setIsDeleting(true);
    try {
      console.log("🔄 Delete dialog: Calling onDelete function");
      await onDelete();
      console.log("✅ Delete dialog: onDelete completed successfully");
      toast.success(`Theme "${themeName}" deleted successfully!`);
      // Close dialog after a short delay to show the success state
      setTimeout(() => {
        console.log("🔄 Delete dialog: Closing dialog");
        onOpenChange(false);
        setIsDeleting(false);
      }, 500);
    } catch (error) {
      console.error("❌ Delete dialog: Error deleting theme:", error);
      toast.error("Failed to delete theme");
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isDeleting || isLoading) return;
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Theme
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "<strong>{themeName}</strong>"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="min-w-[100px]"
          >
            {isDeleting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}