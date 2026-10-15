"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const INK = "#161a3d";

/** One standing figure with a tool, used across naka scenes. */
export function Figure({
  x,
  color,
  tool,
  highlight,
  dim,
  dark,
}: {
  x: number;
  color: string;
  tool?: "roller" | "spade" | "phone" | "bag";
  highlight?: boolean;
  dim?: boolean;
  /** Drawn on a dark background: lighter outline so legs and tools stay visible. */
  dark?: boolean;
}) {
  const line = dark ? "#e9e1cf" : INK;
  return (
    <g transform={`translate(${x} 0)`} opacity={dim ? 0.35 : 1}>
      {highlight ? <ellipse cx="0" cy="120" rx="18" ry="4" fill="#f5b014" opacity=".7" /> : null}
      <circle cx="0" cy="68" r="9" fill="#a8714f" stroke={line} strokeWidth="2.5" />
      <path d="M-9 64a9 9 0 0 1 18 0z" fill="#1d1a1a" />
      <path d="M-11 114V88a11 11 0 0 1 22 0v26z" fill={color} stroke={line} strokeWidth="3" />
      <path d="M-6 114v7M6 114v7" stroke={line} strokeWidth="5" strokeLinecap="round" />
      {tool === "roller" ? <path d="M12 84l10-15h11" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round" /> : null}
      {tool === "spade" ? <path d="M14 72v42M9 114h10" stroke={line} strokeWidth="3" strokeLinecap="round" /> : null}
      {tool === "bag" ? <rect x="-20" y="92" width="10" height="13" rx="2" fill="#c98200" stroke={INK} strokeWidth="2" /> : null}
      {tool === "phone" ? (
        <g>
          <rect x="9" y="76" width="8" height="13" rx="2" fill={INK} />
          <rect x="10.5" y="78" width="5" height="8" rx="1" fill={highlight ? "#f5b014" : "#4a5190"} />
        </g>
      ) : null}
    </g>
  );
}

/**
 * The naka signpost. The board grows with its label, and the lettering is
 * fitted to the board so Devanagari never spills over the edge.
 */
export function NakaSign({ x = 40, label = "नाका", width }: { x?: number; label?: string; width?: number }) {
  const w = width ?? Math.max(70, label.length * 9 + 26);
  const textW = w - 18;
  const long = label.length > 6;
  return (
    <g transform={`translate(${x} 64)`}>
      <path d={`M${w / 2} 32v54`} stroke={INK} strokeWidth="4" />
      <rect x="0" y="0" width={w} height="32" rx="5" fill="#f5b014" stroke={INK} strokeWidth="3" />
      <rect x="4" y="4" width={w - 8} height="24" rx="3" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 2" />
      <text
        x={w / 2}
        y="22"
        textAnchor="middle"
        fontFamily="var(--font-khand), var(--font-hind), sans-serif"
        fontWeight="700"
        fontSize="16"
        fill={INK}
        textLength={long ? textW : undefined}
        lengthAdjust={long ? "spacingAndGlyphs" : undefined}
      >
        {label}
      </text>
    </g>
  );
}

export const SKYLINE_PATH =
  "M0 90V52h18V30h14v22h10V18h22v34h8V40h16v-8h12v20h14V24h8v-8h6v8h8v28h12V36h20v16h10V12h18v40h8V44h14v-6h10v14h16V28h24v24h10V34h12v18h18V20h16v32h14V40h20v12h22V30h18v60z";

/** Mumbai skyline silhouette for the bottom of story scenes. */
export function Skyline({ className, fill = "#2b3166", opacity = 0.3 }: { className?: string; fill?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d={SKYLINE_PATH}
        fill={fill}
        opacity={opacity}
      />
    </svg>
  );
}

/**
 * Small naka strip inside the availability card. When the worker turns
 * "free today" on, the sun comes up and the naka fills with people.
 */
export function NakaStrip({ on, className }: { on: boolean; className?: string }) {
  return (
    <svg viewBox="0 44 320 82" className={cn("w-full", className)} aria-hidden="true">
      <motion.circle
        cx="280"
        r="18"
        fill="#f5b014"
        initial={false}
        animate={{ cy: on ? 66 : 130, opacity: on ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
      />
      <path d="M0 122h320" stroke="#f5b014" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 5" />
      <NakaSign x={14} />
      {[
        { x: 132, color: "#c98200", tool: "roller" as const, me: true },
        { x: 168, color: "#137a3a", tool: "bag" as const },
        { x: 204, color: "#c8202f", tool: "spade" as const },
        { x: 238, color: "#2456c9" },
      ].map((f, i) => (
        <motion.g
          key={f.x}
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: on ? 0.12 + i * 0.08 : 0 }}
        >
          <Figure x={f.x} color={f.color} tool={f.tool} highlight={f.me} dark />
        </motion.g>
      ))}
    </svg>
  );
}

/** Empty naka bench: nobody hiring here right now. */
export function EmptyNaka({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 120" className={cn("w-full", className)} aria-hidden="true">
      <path d="M0 104h240" stroke={INK} strokeOpacity=".2" strokeWidth="3" strokeDasharray="6 6" />
      <g transform="translate(20 8)">
        <NakaSign x={0} />
      </g>
      <rect x="118" y="80" width="80" height="8" rx="3" fill="#c98200" stroke={INK} strokeWidth="2.5" />
      <path d="M126 88v16M190 88v16" stroke={INK} strokeWidth="3" />
      <circle cx="200" cy="34" r="18" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M200 34V24M200 34l7 5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A jagged torn-paper edge for poster blocks. */
export function TornEdge({ className, fill = "currentColor", flip }: { className?: string; fill?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
      className={cn("block h-4 w-full", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <path
        d="M0 16V6l14 5 11-7 16 6 12-8 15 9 10-6 18 5 9-7 17 8 12-6 14 7 11-9 19 8 10-5 16 6 13-8 12 7 17-6 9 5 15-7 13 8 11-6 18 7 10-8 14 6 12-5 16 7 10-4v11z"
        fill={fill}
      />
    </svg>
  );
}

/** A red BEST bus, Mumbai's moving signboard. */
export function BestBus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 64" className={className} aria-hidden="true">
      <rect x="3" y="6" width="142" height="44" rx="9" fill="#c8202f" stroke={INK} strokeWidth="3" />
      <rect x="3" y="34" width="142" height="5" fill="#f4efe6" />
      {[14, 38, 62, 86, 110].map((x) => (
        <rect key={x} x={x} y="13" width="18" height="15" rx="3" fill="#9fc4e4" stroke={INK} strokeWidth="2" />
      ))}
      <rect x="132" y="13" width="9" height="20" rx="2" fill="#9fc4e4" stroke={INK} strokeWidth="2" />
      <text x="70" y="47" textAnchor="middle" fontFamily="var(--font-khand)" fontWeight="700" fontSize="8" fill="#fff">
        BEST · 340 GHATKOPAR
      </text>
      <circle cx="30" cy="52" r="9" fill={INK} />
      <circle cx="30" cy="52" r="3.5" fill="#c7c9d6" />
      <circle cx="116" cy="52" r="9" fill={INK} />
      <circle cx="116" cy="52" r="3.5" fill="#c7c9d6" />
    </svg>
  );
}

/** A black-and-yellow auto-rickshaw. */
export function Rickshaw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <path d="M8 40V22C8 12 18 6 30 6h18c8 0 12 4 14 10l8 18v6z" fill="#f5b014" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 22h30V6c-12 0-22 4-22 12z" fill={INK} />
      <path d="M44 12h8l8 16H44z" fill="#9fc4e4" stroke={INK} strokeWidth="2" />
      <rect x="4" y="38" width="70" height="6" rx="3" fill={INK} />
      <circle cx="18" cy="46" r="7" fill={INK} />
      <circle cx="18" cy="46" r="2.5" fill="#c7c9d6" />
      <circle cx="64" cy="46" r="7" fill={INK} />
      <circle cx="64" cy="46" r="2.5" fill="#c7c9d6" />
    </svg>
  );
}
