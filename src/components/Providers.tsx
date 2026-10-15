"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useStoreSync } from "@/lib/hooks";

export function Providers({ children }: { children: ReactNode }) {
  useStoreSync();
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
