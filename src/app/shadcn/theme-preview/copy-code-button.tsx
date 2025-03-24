"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface CopyCodeButtonProps {
  code: string;
}

export const CopyCodeButton = ({ code }: CopyCodeButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast.success("Block copied to clipboard.");
          }}
          size="sm"
        >
          <CopyIcon className="h-4 w-4" />
          <span className="sr-only">Copy Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy Theme</p>
      </TooltipContent>
    </Tooltip>
  );
};
