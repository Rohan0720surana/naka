"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Rubber stamp that thumps onto an agreement once both sides say yes.
 * The ink is slightly uneven, like a real stamp pad.
 */
export function PakkaStamp({
  code,
  className,
  tone = "blue",
  animate = true,
}: {
  code?: string;
  className?: string;
  tone?: "blue" | "green";
  animate?: boolean;
}) {
  const ink = tone === "blue" ? "#27318f" : "#0f6b32";
  return (
    <motion.div
      className={cn("pointer-events-none select-none", className)}
      initial={animate ? { scale: 2.4, rotate: -4, opacity: 0 } : false}
      animate={{ scale: 1, rotate: -12, opacity: 0.95 }}
      transition={{ type: "spring", stiffness: 520, damping: 18, mass: 0.9 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 120" className="w-full">
        <defs>
          <filter id="stamp-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.3" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>
        <g filter="url(#stamp-rough)" fill="none" stroke={ink}>
          <rect x="6" y="6" width="208" height="108" rx="16" strokeWidth="6" />
          <rect x="16" y="16" width="188" height="88" rx="10" strokeWidth="2.5" />
          <text x="110" y="64" textAnchor="middle" fill={ink} stroke="none" fontFamily="var(--font-khand)" fontWeight="700" fontSize="46" letterSpacing="4">
            PAKKA
          </text>
          <text x="110" y="92" textAnchor="middle" fill={ink} stroke="none" fontFamily="var(--font-courier)" fontWeight="700" fontSize="15">
            {`पक्का · ${code ?? "AGREED"}`}
          </text>
        </g>
      </svg>
    </motion.div>
  );
}

/** Hazard tape slapped across a listing that looks like a scam. */
export function ScamTape({ className, label = "SCAM · धोखा · फसवणूक" }: { className?: string; label?: string }) {
  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-x-[-12%] z-20 flex origin-left items-center", className)}
      initial={{ scaleX: 0, rotate: -7 }}
      animate={{ scaleX: 1, rotate: -7 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.25 }}
      aria-hidden="true"
    >
      <div className="flex h-9 w-full items-center overflow-hidden border-y-2 border-ink shadow-[0_6px_14px_-6px_rgba(22,26,61,0.6)]">
        <span className="h-full w-16 shrink-0 tape-hazard" />
        <span className="flex h-full flex-1 items-center justify-center gap-4 bg-bus font-display text-lg font-bold tracking-[0.18em] whitespace-nowrap text-white">
          {label} · {label}
        </span>
        <span className="h-full w-16 shrink-0 tape-hazard" />
      </div>
    </motion.div>
  );
}

/** A small rupee coin. */
export function Coin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#f5b014" stroke="#161a3d" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="12.5" fill="none" stroke="#c98200" strokeWidth="2" />
      <text x="20" y="26.5" textAnchor="middle" fontSize="17" fontWeight="700" fill="#161a3d" fontFamily="var(--font-atkinson)">
        ₹
      </text>
    </svg>
  );
}

/** Coins that drop and settle — used when money lands in the Khata. */
export function CoinDrop({ count = 5, className, replayKey }: { count?: number; className?: string; replayKey?: string | number }) {
  return (
    <div className={cn("pointer-events-none flex items-end gap-0.5", className)} aria-hidden="true" key={replayKey}>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          initial={{ y: -70, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.15 + i * 0.09 }}
          style={{ marginBottom: (i % 2) * 6 }}
        >
          <Coin className="size-7" />
        </motion.span>
      ))}
    </div>
  );
}
