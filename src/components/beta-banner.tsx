"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BETA_BANNER_KEY = "tinte-beta-banner-dismissed";

export function BetaBanner() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(BETA_BANNER_KEY);
    if (!isDismissed) {
      setShouldShow(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const dismissBanner = () => {
      localStorage.setItem(BETA_BANNER_KEY, "true");
      setShouldShow(false);
    };

    const toastId = toast(
      <div className="flex items-start gap-3 w-full">
        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="font-medium text-foreground">
            Tinte is currently in beta
          </div>
          <div className="text-sm text-muted-foreground">
            The product might be buggy, especially VS Code export which is still in progress.
            We appreciate your patience as we improve the experience.
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={dismissBanner}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>,
      {
        duration: Infinity,
        dismissible: false,
      }
    );

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [shouldShow]);

  return null;
}