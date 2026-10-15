"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Screens slide in from the side like a native Android app. */
export default function WorkerTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
