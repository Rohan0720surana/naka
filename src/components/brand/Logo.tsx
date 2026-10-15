import { cn } from "@/lib/utils";

/**
 * The RozGhar mark: the day's sun ("roz") rising over a home ("ghar") —
 * a day's work that keeps a household going.
 */
export function LogoMark({ className, tone = "ink" }: { className?: string; tone?: "ink" | "marigold" }) {
  const bg = tone === "ink" ? "var(--color-ink)" : "var(--color-marigold)";
  const fg = tone === "ink" ? "var(--color-marigold)" : "var(--color-ink)";
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill={bg} />
      <circle cx="20" cy="10.2" r="4" fill={fg} />
      <path d="M7.6 23.6 20 13.4l12.4 10.2" fill="none" stroke={fg} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.8 21.6v9.6h16.4v-9.6" fill="none" stroke={fg} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 31.2v-5.4" stroke={fg} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "ink",
  sub,
}: {
  className?: string;
  tone?: "ink" | "marigold";
  sub?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.65rem] font-bold tracking-tight">
          <span className={tone === "marigold" ? "text-paper" : "text-ink"}>Roz</span>
          <span className={tone === "marigold" ? "text-marigold" : "text-marigold-deep"}>Ghar</span>
        </span>
        {sub ? <span className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] opacity-70">{sub}</span> : null}
      </span>
    </span>
  );
}
