import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  IconShare,
  IconLock,
  IconGlobe,
  IconInfo,
  IconCopy,
  IconTwitter,
  IconWhatsApp,
} from "./ui/icons";
import { toast } from "sonner";
import { ThemeConfig } from "@/lib/core/types";

interface ShareThemeDialogProps {
  themeConfig: ThemeConfig;
  isOwner: boolean;
  canNotEdit: boolean;
  updateThemeStatus?: (themeId: string, isPublic: boolean) => Promise<void>;
}

export const ShareThemeDialog: React.FC<ShareThemeDialogProps> = ({
  themeConfig,
  isOwner,
  canNotEdit,
  updateThemeStatus,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMakingPublic, setIsMakingPublic] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(`${window.location.origin}/t/${themeConfig.id}`);
  }, [themeConfig.id]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Share link copied to clipboard");
  };

  const handleUpdateThemeStatus = async (checked: boolean) => {
    setIsMakingPublic(true);
    try {
      await updateThemeStatus?.(themeConfig.id, checked);
    } finally {
      setIsMakingPublic(false);
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this theme: ${themeConfig.displayName}`,
          text: `I've created a custom theme for VS Code. Take a look!`,
          url: link,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("Web Share API is not supported in your browser");
    }
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Check out this VS Code theme I created: ${themeConfig.displayName}`
    );
    const url = encodeURIComponent(link);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this VS Code theme I created: ${themeConfig.displayName} ${link}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 w-full" variant="outline">
          <IconShare />
          <span className="ml-2">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Theme</DialogTitle>
          <DialogDescription>
            {!themeConfig.isPublic && isOwner && (
              <p className="flex flex-col gap-1 text-xs text-muted-foreground mt-2 p-2 rounded-md border border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/10">
                <span className="font-bold inline-flex items-center gap-1">
                  <IconLock className="w-4 h-4" />
                  Your theme is private.
                </span>
                <span>Only you can view and edit this theme.</span>
              </p>
            )}
            {themeConfig.isPublic && isOwner && (
              <p className="flex flex-col gap-1 text-xs text-muted-foreground mt-2 p-2 rounded-md border border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10">
                <span className="font-bold inline-flex items-center gap-1">
                  <IconGlobe className="w-4 h-4" />
                  Your theme is public.
                </span>
                <span>Anyone with the link can view and make a copy.</span>
              </p>
            )}
            {!isOwner && (
              <div className="flex items-center space-x-2 mt-2">
                <IconInfo className="w-4 h-4" />
                <span>Anyone with the link can view and make a copy</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={link} readOnly />
          </div>
          <Button size="sm" className="px-3" onClick={copyShareLink}>
            <span className="sr-only">Copy</span>
            <IconCopy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <Label>Share via</Label>
          <div className="flex space-x-2">
            <Button onClick={shareViaWebShare} variant="outline">
              <IconShare className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={shareViaTwitter} variant="outline">
              <IconTwitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button onClick={shareViaWhatsApp} variant="outline">
              <IconWhatsApp className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
        {isOwner && updateThemeStatus && (
          <div className="flex items-center space-x-2 mt-4">
            <Label htmlFor="public-switch" className="flex items-center">
              Make theme public
            </Label>
            <Switch
              id="public-switch"
              checked={themeConfig.isPublic}
              onCheckedChange={handleUpdateThemeStatus}
              disabled={canNotEdit || isMakingPublic}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
