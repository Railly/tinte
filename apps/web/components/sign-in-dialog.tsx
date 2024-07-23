import React, { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { dark, experimental__simple } from "@clerk/themes";
import { DialogContent } from "@radix-ui/react-dialog";

interface SignInDialogProps {
  label?: ReactNode;
  redirectUrl?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}
export const SignInDialog: React.FC<SignInDialogProps> = ({
  redirectUrl = "/generator",
  open,
  setOpen,
}) => {
  const { theme } = useTheme();
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <SignIn
            appearance={{
              baseTheme: theme === "dark" ? dark : experimental__simple,
            }}
            routing="hash"
            forceRedirectUrl={redirectUrl}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
