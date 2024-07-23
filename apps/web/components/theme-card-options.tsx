import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEye } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { ShareThemeDialog } from "./share-theme-dialog";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { isThemeOwner } from "@/app/utils";

interface ThemeCardOptionsProps {
  themeConfig: ThemeConfig;
}

export const ThemeCardOptions: React.FC<ThemeCardOptionsProps> = ({
  themeConfig,
}) => {
  const router = useRouter();
  const user = useUser();
  const isOwner = isThemeOwner(user.user?.id, themeConfig);

  const handlePreview = () => {
    router.push(`/t/${themeConfig.id}`);
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
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
