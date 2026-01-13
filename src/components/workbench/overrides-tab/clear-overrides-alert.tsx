"use client";

import { Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ClearOverridesAlertProps {
  providerDisplayName: string;
  isClearing: boolean;
  onClear: () => Promise<void>;
}

export function ClearOverridesAlert({
  providerDisplayName,
  isClearing,
  onClear,
}: ClearOverridesAlertProps) {
  return (
    <Alert className="border-destructive/50 bg-destructive/5">
      <Trash2 className="h-4 w-4 text-destructive" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">
          Clear {providerDisplayName} overrides from this theme permanently.
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClear}
          disabled={isClearing}
          className="ml-3 h-8 px-3"
        >
          {isClearing ? "Clearing..." : "Clear All"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
