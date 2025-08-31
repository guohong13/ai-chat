"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import HydrationProvider from "@/components/HydrationProvider";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/chat");
    } else if (!isAuthenticated && !user) {
      router.push("/auth");
    }
  }, [isAuthenticated, user, router]);

  return (
    <HydrationProvider>
      <div className="loading-container">正在加载...</div>
    </HydrationProvider>
  );
}
