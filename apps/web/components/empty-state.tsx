/* eslint-disable @next/next/no-img-element */
import { IconTinte, IconUser, IconGrid, IconZap } from "@/components/ui/icons";
import IconRaycast from "@/public/logos/raycast.svg";
import { ShineButton } from "./ui/shine-button";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

interface EmptyStateProps {
  type: "community" | "user" | "all" | "featured" | "rayso";
}

export function EmptyState({ type }: EmptyStateProps) {
  const user = useUser();
  const content = {
    all: {
      icon: <IconGrid className="w-12 h-12 mb-4 text-muted-foreground" />,
      title: "No Themes Available",
      message: "There are currently no themes available in any category.",
    },
    featured: {
      icon: <IconZap className="w-12 h-12 mb-4 text-muted-foreground" />,
      title: "No Featured Themes",
      message: "There are no featured themes at the moment. Check back later!",
    },
    rayso: {
      icon: <IconRaycast className="w-12 h-12 mb-4 text-muted-foreground" />,
      title: "No Ray.so Themes",
      message: "There are currently no Ray.so themes available.",
    },
    community: {
      icon: <IconTinte className="w-12 h-12 mb-4 text-muted-foreground" />,
      title: "No Community Themes Yet",
      message: "Be the first to contribute a theme to the community!",
    },
    user: {
      icon: (
        <>
          <SignedIn>
            <img
              src={user.user?.imageUrl}
              className="w-12 h-12 mb-4 rounded-full"
            />
          </SignedIn>
          <SignedOut>
            <IconUser className="w-12 h-12 mb-4 text-muted-foreground" />
          </SignedOut>
        </>
      ),
      title: "No Custom Themes Yet",
      message: "Start creating your own custom themes to see them here.",
    },
  };

  const { icon, title, message } = content[type];
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full h-64 text-center">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      <ShineButton className="mt-4" onClick={() => router.push("/generator")}>
        Create a Theme
      </ShineButton>
    </div>
  );
}
