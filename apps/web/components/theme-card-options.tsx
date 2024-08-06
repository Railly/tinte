import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEye, IconTrash } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { ShareThemeDialog } from "./share-theme-dialog";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { isThemeOwner } from "@/app/utils";
import { DeleteThemeDialog } from "./delete-theme-dialog";
import { toast } from "sonner";

interface ThemeCardOptionsProps {
  themeConfig: ThemeConfig;
  updateThemeConfig?: (newConfig: Partial<ThemeConfig>) => void;
  themes: ThemeConfig[];
}

export const ThemeCardOptions: React.FC<ThemeCardOptionsProps> = ({
  themeConfig,
  updateThemeConfig,
  themes,
}) => {
  const router = useRouter();
  const user = useUser();
  const isOwner = isThemeOwner(user.user?.id, themeConfig);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handlePreview = () => {
    router.push(`/t/${themeConfig.id}`);
  };
  const updateThemeStatus = async (themeId: string, isPublic: boolean) => {
    try {
      toast.info(
        `Making ${themeConfig.displayName} ${isPublic ? "public" : "private"}`,
      );
      const response = await fetch(`/api/theme/${themeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic, userId: user.user?.id }),
      });

      toast.dismiss();
      if (!response.ok) {
        toast.error("Failed to update theme status");
        return;
      }
      toast.success(`Theme is now ${isPublic ? "public" : "private"}`);
      updateThemeConfig?.({ ...themeConfig, isPublic });
      router.refresh();
    } catch (error) {
      console.error("Error updating theme public status:", error);
      throw error;
    }
  };

  const handleDeleted = () => {
    const firstTheme = themes[0];
    if (!firstTheme) {
      return;
    }
    updateThemeConfig?.(firstTheme);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col gap-1">
          <DropdownMenuItem onClick={handlePreview} asChild>
            <Button className="w-full" variant="outline">
              <IconEye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ShareThemeDialog
              themeConfig={themeConfig}
              isOwner={isOwner}
              canNotEdit={!isOwner}
              updateThemeStatus={updateThemeStatus}
            />
          </DropdownMenuItem>
          {isThemeOwner(user.user?.id, themeConfig) && (
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              asChild
            >
              <Button
                className="w-full m-0 cursor-pointer"
                variant="destructive"
              >
                <IconTrash />
                Delete
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteThemeDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        themeConfig={themeConfig}
        onDeleted={handleDeleted}
      />
    </>
  );
};
