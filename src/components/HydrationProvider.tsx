"use client";

import React, { useEffect, useState } from "react";

interface HydrationProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationProvider({
  children,
  fallback,
}: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 给 Zustand 足够的时间完成 hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // 显示加载状态
  if (!isHydrated) {
    return fallback || <div className="loading-container">正在加载...</div>;
  }

  return <>{children}</>;
}
