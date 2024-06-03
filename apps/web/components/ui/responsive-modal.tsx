"use client";
import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

type ResponsiveModalProps = React.ComponentProps<typeof Dialog> & {
  trigger: React.ReactNode;
};

const ResponsiveModal = ({
  children,
  trigger,
  ...props
}: ResponsiveModalProps) => {
  return (
    <>
      <Dialog {...props}>
        <DialogTrigger className="hidden md:flex">{trigger}</DialogTrigger>
        <DialogPortal>
          <DialogContent>{children}</DialogContent>
        </DialogPortal>
      </Dialog>
      <Drawer {...props}>
        <DrawerTrigger className="flex md:hidden">{trigger}</DrawerTrigger>
        <DrawerPortal>
          <DrawerContent>{children}</DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
};

const ResponsiveModalClose = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogClose>) => (
  <>
    <DialogClose
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hidden md:block",
        className
      )}
      {...props}
    >
      <Cross2Icon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DialogClose>
    <DrawerClose
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground block md:hidden",
        className
      )}
      {...props}
    >
      <Cross2Icon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DrawerClose>
  </>
);
ResponsiveModalClose.displayName = "ResponsiveModalClose";

const ResponsiveModalTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) => (
  <>
    <DialogTitle
      className={cn(
        "text-lg font-semibold leading-none tracking-tight hidden md:block",
        className
      )}
      {...props}
    />
    <DrawerTitle
      className={cn(
        "text-lg font-semibold leading-none tracking-tight block md:hidden pt-4",
        className
      )}
      {...props}
    />
  </>
);
ResponsiveModalTitle.displayName = "ResponsiveModalTitle";

const ResponsiveModalDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) => (
  <>
    <DialogDescription
      className={cn("text-sm text-muted-foreground hidden md:block", className)}
      {...props}
    />
    <DrawerDescription
      className={cn(
        "text-sm text-muted-foreground block md:hidden p-5",
        className
      )}
      {...props}
    />
  </>
);
ResponsiveModalDescription.displayName = "ResponsiveModalDescription";

const ResponsiveModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <>
    <div
      className={cn(
        "flex-col space-y-1.5 text-center sm:text-left hidden md:flex",
        className
      )}
      {...props}
    />
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left md:hidden",
        className
      )}
      {...props}
    />
  </>
);
ResponsiveModalHeader.displayName = "ResponsiveModalHeader";

const ResponsiveModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <>
    <div
      className={cn(
        "flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 hidden md:flex",
        className
      )}
      {...props}
    />
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:hidden",
        className
      )}
      {...props}
    />
  </>
);
ResponsiveModalFooter.displayName = "ResponsiveModalFooter";

export {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalFooter,
};
