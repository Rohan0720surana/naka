"use client";

import { motion } from "framer-motion";
import {
  Check,
  CircleCheck,
  CircleX,
  Coffee,
  Hammer,
  Moon,
  Package,
  Sun,
  TrainFront,
  Utensils,
  X,
} from "lucide-react";
import { TRADES } from "@/lib/data/trades";
import { hourLabel, hoursRange, money, PROVIDED_KEY, PROVIDED_ORDER } from "@/lib/format";
import { useT } from "@/lib/hooks";
import type { Assessment } from "@/lib/risk";
import type { Job, Provided } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ShieldBadge } from "@/components/ui/primitives";
import { SHIELD_KEY } from "@/lib/jobText";

const DAY_START = 6;
const DAY_END = 22;

/** The working day drawn from sunrise to night, so hours read without numbers. */
export function HoursBar({ start, end, className }: { start: number; end: number; className?: string }) {
  const { lang } = useT();
  const span = DAY_END - DAY_START;
  const left = ((start - DAY_START) / span) * 100;
  const width = ((end - start) / span) * 100;
  return (
    <div className={cn("w-full", className)} role="img" aria-label={hoursRange(start, end, lang)}>
      <div className="flex items-center gap-2">
        <Sun className="size-5 shrink-0 text-marigold-deep" aria-hidden="true" />
        <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-marigold-soft via-sand to-ink-soft">
          <motion.div
            className="absolute inset-y-0 rounded-full border-2 border-ink bg-marigold"
            style={{ left: `${left}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <Moon className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
      </div>
      <div className="relative mt-1 h-5 text-[0.78rem] font-bold text-muted">
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: `calc(1.75rem + (100% - 3.5rem) * ${left / 100})` }}
        >
          {hourLabel(start, lang)}
        </span>
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: `calc(1.75rem + (100% - 3.5rem) * ${(left + width) / 100})` }}
        >
          {hourLabel(end, lang)}
        </span>
      </div>
    </div>
  );
}

const PROVIDED_ICON: Record<Provided, typeof Hammer> = {
  tools: Hammer,
  materials: Package,
  lunch: Utensils,
  tea: Coffee,
  travel: TrainFront,
};

/** What is given at the site, every item shown — given ones ticked, others crossed. */
export function ProvidedGrid({ provided }: { provided: Provided[] }) {
  const { t } = useT();
  return (
    <ul className="grid grid-cols-3 gap-2">
      {PROVIDED_ORDER.map((p) => {
        const Icon = PROVIDED_ICON[p];
        const on = provided.includes(p);
        return (
          <li
            key={p}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2.5 text-center text-[0.85rem] font-bold",
              on ? "border-leaf/40 bg-leaf-soft text-ink" : "border-dashed border-line bg-white text-muted",
            )}
          >
            <Icon className={cn("size-6", on ? "text-leaf" : "text-muted/60")} aria-hidden="true" />
            <span>{t(PROVIDED_KEY[p])}</span>
            <span className="sr-only">{on ? "✓" : "✗"}</span>
            <span
              className={cn(
                "absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full",
                on ? "bg-leaf text-white" : "bg-line text-muted",
              )}
              aria-hidden="true"
            >
              {on ? <Check className="size-3" strokeWidth={3.5} /> : <X className="size-3" strokeWidth={3.5} />}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Shows where this job's pay sits against the usual range for the trade. */
export function FairMeter({ job, fair }: { job: Job; fair: Assessment["fair"] }) {
  const { t, p } = useT();
  const [min, max] = fair.range;
  const lo = min * 0.5;
  const hi = max * 2;
  const pos = (v: number) => Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
  const zones = [
    { from: 0, to: pos(min * 0.85), cls: "bg-alert-soft" },
    { from: pos(min * 0.85), to: pos(max), cls: "bg-leaf/25" },
    { from: pos(max), to: pos(max * 1.6), cls: "bg-marigold-soft" },
    { from: pos(max * 1.6), to: 100, cls: "bg-danger-soft" },
  ];
  const status = {
    low: { key: "fairLow" as const, cls: "text-alert" },
    ok: { key: "fairOk" as const, cls: "text-leaf" },
    above: { key: "fairAbove" as const, cls: "text-ink" },
    suspicious: { key: "fairSuspicious" as const, cls: "text-danger" },
  }[fair.status];
  const per = job.unit === "day" ? t("perDay") : job.unit === "month" ? t("perMonth") : t("perJob");

  return (
    <div>
      <p className="text-[0.95rem] leading-snug text-muted">
        {t("fairRange", {
          trade: p(TRADES[job.trade].label),
          min: min.toLocaleString("en-IN"),
          max: max.toLocaleString("en-IN"),
          per,
        })}
      </p>
      <div className="relative mt-9 mb-2">
        <div className="relative flex h-4 overflow-hidden rounded-full border-2 border-ink/15">
          {zones.map((z, i) => (
            <span key={i} className={cn("absolute inset-y-0", z.cls)} style={{ left: `${z.from}%`, width: `${z.to - z.from}%` }} />
          ))}
        </div>
        <motion.div
          className="absolute -top-8 flex -translate-x-1/2 flex-col items-center"
          initial={{ left: "0%" }}
          animate={{ left: `${fair.position * 100}%` }}
          transition={{ type: "spring", damping: 18, stiffness: 120, delay: 0.15 }}
        >
          <span className="rounded-lg bg-ink px-2 py-1 text-[0.78rem] font-extrabold whitespace-nowrap text-paper tabular">
            {money(job.pay)}
          </span>
          <span className="h-5 w-1 rounded-full bg-ink" />
        </motion.div>
      </div>
      <p className={cn("mt-2 flex items-center gap-1.5 font-extrabold", status.cls)}>
        {fair.status === "ok" ? (
          <CircleCheck className="size-5" aria-hidden="true" />
        ) : (
          <CircleX className="size-5" aria-hidden="true" />
        )}
        {t("thisJob")}: {t(status.key)}
      </p>
    </div>
  );
}

/** The safety check: six plain checks, then any warnings in words. */
export function SafetyChecks({ a }: { a: Assessment }) {
  const { t } = useT();
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <ShieldBadge level={a.level} label={t(SHIELD_KEY[a.level])} className="px-3 py-1.5 text-[0.9rem]" />
      </div>
      {a.flags.length ? (
        <ul className="mt-3 space-y-2">
          {a.flags.map((f) => (
            <li
              key={f.key}
              className={cn(
                "rounded-2xl border-2 p-3 text-[0.95rem] leading-snug font-bold",
                f.severity === "high" ? "border-danger/40 bg-danger-soft text-danger" : "border-alert/30 bg-alert-soft text-alert",
              )}
            >
              {t(f.key, f.vars)}
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="mt-3 grid gap-1.5">
        {a.checks.map((c) => (
          <li key={c.key} className="flex items-center gap-2.5 text-[0.95rem]">
            {c.ok ? (
              <CircleCheck className="size-5 shrink-0 text-leaf" aria-hidden="true" />
            ) : (
              <CircleX className="size-5 shrink-0 text-danger" aria-hidden="true" />
            )}
            <span className={c.ok ? "text-ink" : "font-bold text-danger"}>{t(c.key)}</span>
            <span className="sr-only">{c.ok ? "✓" : "✗"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
