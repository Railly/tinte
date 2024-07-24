import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconTrash, IconLoading } from "@/components/ui/icons";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteThemeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  themeConfig: ThemeConfig;
  onDeleted: () => void;
}

export const DeleteThemeDialog: React.FC<DeleteThemeDialogProps> = ({
  isOpen,
  setIsOpen,
  themeConfig,
  onDeleted,
}) => {
  const user = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/theme/${themeConfig.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete theme");
      }
      router.refresh();
      toast.success("Theme deleted successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this theme?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            theme.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleDelete();
              onDeleted();
            }}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <IconLoading className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
