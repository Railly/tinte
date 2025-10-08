"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

export function ClerkSync() {
  const { user, isLoaded } = useUser();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoaded) return;

    const clerkUser = user
      ? {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl,
        }
      : null;

    setUser(clerkUser, !!user);
  }, [user, isLoaded, setUser]);

  return null;
}
