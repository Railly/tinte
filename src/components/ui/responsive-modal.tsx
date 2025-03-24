"use client";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import type * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
        "absolute top-4 right-4 hidden rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:block",
        className,
      )}
      {...props}
    >
      <Cross2Icon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DialogClose>
    <DrawerClose
      className={cn(
        "absolute top-4 right-4 block rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:hidden",
        className,
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
        "hidden font-semibold text-lg leading-none tracking-tight md:block",
        className,
      )}
      {...props}
    />
    <DrawerTitle
      className={cn(
        "block pt-4 font-semibold text-lg leading-none tracking-tight md:hidden",
        className,
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
      className={cn("hidden text-muted-foreground text-sm md:block", className)}
      {...props}
    />
    <DrawerDescription
      className={cn(
        "block p-5 text-muted-foreground text-sm md:hidden",
        className,
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
        "hidden flex-col space-y-1.5 text-center sm:text-left md:flex",
        className,
      )}
      {...props}
    />
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left md:hidden",
        className,
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
        "hidden flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:flex",
        className,
      )}
      {...props}
    />
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:hidden",
        className,
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
