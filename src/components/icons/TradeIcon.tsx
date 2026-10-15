import type { TradeId } from "@/lib/types";
import { cn } from "@/lib/utils";

const INK = "var(--color-ink)";

/**
 * Hand-drawn two-tone pictograms for each trade. Recognisable without
 * reading — the tool, not the word, says what the work is.
 */
export function TradeIcon({
  trade,
  className,
  accent = "var(--color-marigold)",
  title,
}: {
  trade: TradeId;
  className?: string;
  accent?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-10 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {GLYPHS[trade](accent)}
    </svg>
  );
}

const GLYPHS: Record<TradeId, (accent: string) => React.ReactNode> = {
  painter: (a) => (
    <>
      <rect x="7" y="7" width="40" height="17" rx="5.5" fill={a} stroke={INK} strokeWidth="3.5" />
      <path d="M13 12.5h14" stroke="#fff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M47 15.5h5a3 3 0 0 1 3 3V27a3 3 0 0 1-3 3H33a3 3 0 0 0-3 3v4"
        fill="none"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="25" y="37" width="10" height="21" rx="4" fill={INK} />
    </>
  ),
  plumber: (a) => (
    <>
      <rect x="4" y="16" width="8" height="17" rx="2" fill={INK} />
      <path d="M12 24.5h21a10 10 0 0 1 10 10V39" fill="none" stroke={INK} strokeWidth="8.5" strokeLinecap="round" />
      <rect x="18" y="7" width="18" height="6" rx="3" fill={a} stroke={INK} strokeWidth="3" />
      <path d="M27 13v7" stroke={INK} strokeWidth="4" />
      <path
        d="M43 46c0 0-6.5 7.2-6.5 11.2a6.5 6.5 0 0 0 13 0C49.5 53.2 43 46 43 46z"
        fill={a}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </>
  ),
  electrician: (a) => (
    <>
      <path
        d="M32 5a18.5 18.5 0 0 0-10.5 33.7V44h21v-5.3A18.5 18.5 0 0 0 32 5z"
        fill={a}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M34.5 12.5 25.5 26h7.5l-3 11 10-14.5h-7.5z" fill={INK} />
      <rect x="21.5" y="47" width="21" height="5" rx="2.5" fill={INK} />
      <rect x="25" y="54.5" width="14" height="5" rx="2.5" fill={INK} />
    </>
  ),
  carpenter: (a) => (
    <g transform="rotate(-38 32 32)">
      <rect x="28" y="22" width="9" height="39" rx="3.5" fill={a} stroke={INK} strokeWidth="3" />
      <path d="M12 9h26c5 0 10 3 12 8l1 4H22l-6-3.5H12z" fill={INK} />
      <rect x="10" y="7" width="7" height="13" rx="2" fill={INK} />
    </g>
  ),
  mason: (a) => (
    <>
      <g fill={a} stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <rect x="5" y="38" width="25" height="10" rx="1.5" />
        <rect x="34" y="38" width="25" height="10" rx="1.5" />
        <rect x="5" y="51" width="11" height="9" rx="1.5" />
        <rect x="20" y="51" width="25" height="9" rx="1.5" />
        <rect x="49" y="51" width="10" height="9" rx="1.5" />
      </g>
      <path d="M12 30 34 13l7 13z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 19.5 47 8" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="44" y="2" width="8" height="12" rx="3" fill={INK} transform="rotate(38 48 8)" />
    </>
  ),
  labourer: (a) => (
    <>
      <path d="M9 43a23 23 0 0 1 46 0z" fill={a} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M27.5 21v22M36.5 21v22" stroke={INK} strokeWidth="3" />
      <path d="M22 29a14 14 0 0 1 4-6" stroke="#fff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="4" y="43" width="56" height="9" rx="4.5" fill={INK} />
    </>
  ),
  cleaner: (a) => (
    <>
      <path d="M47 5 33.5 31" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M21 34h24l7 24H14z" fill={a} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M23 42l-3.5 14M31 42v14M39 42l3.5 14" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="20" y="30" width="26" height="6.5" rx="2.5" fill={INK} />
    </>
  ),
  tiler: (a) => (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <rect x="6" y="6" width="23" height="23" rx="2.5" fill={a} />
      <rect x="33" y="6" width="23" height="23" rx="2.5" fill="#fff" />
      <rect x="6" y="33" width="23" height="23" rx="2.5" fill="#fff" />
      <rect x="36" y="36" width="23" height="23" rx="2.5" fill={a} transform="rotate(9 47.5 47.5)" />
    </g>
  ),
};
