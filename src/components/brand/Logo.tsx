import { cn } from "@/lib/utils";

/** The Naka mark: a signpost "N" with the morning sun — when the naka fills up. */
export function LogoMark({ className, tone = "ink" }: { className?: string; tone?: "ink" | "marigold" }) {
  const bg = tone === "ink" ? "var(--color-ink)" : "var(--color-marigold)";
  const fg = tone === "ink" ? "var(--color-marigold)" : "var(--color-ink)";
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill={bg} />
      <circle cx="30" cy="10.5" r="4" fill={fg} />
      <path
        d="M11 31V12.5L27 31V19"
        fill="none"
        stroke={fg}
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        <span className="font-display text-[1.6rem] font-extrabold tracking-tight">naka</span>
        {sub ? <span className="mt-0.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-70">{sub}</span> : null}
      </span>
    </span>
  );
}
