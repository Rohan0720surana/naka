"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, List, Map as MapIcon, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { AreaMap } from "@/components/AreaMap";
import { Avatar } from "@/components/Avatar";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { JobCard } from "@/components/worker/JobCard";
import { Chip, SectionTitle, Tag } from "@/components/ui/primitives";
import { EMPLOYERS } from "@/lib/data/jobs";
import { AREAS, NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { money } from "@/lib/format";
import { useT } from "@/lib/hooks";
import type { TKey } from "@/lib/i18n";
import { assess } from "@/lib/risk";
import { allJobs, findJob, useDemo } from "@/lib/store";
import type { Agreement, JobSpan } from "@/lib/types";
import { cn } from "@/lib/utils";

type SpanFilter = "all" | JobSpan;

const RISK_RANK = { safe: 0, careful: 1, danger: 2 } as const;

const SPAN_CHIPS: { id: SpanFilter; key: TKey }[] = [
  { id: "all", key: "filterAll" },
  { id: "today", key: "filterToday" },
  { id: "few-days", key: "filterFew" },
  { id: "long-term", key: "filterLong" },
];

export default function WorkerHome() {
  const { t, p, lang } = useT();
  const me = useDemo((s) => s.me);
  const postedJobs = useDemo((s) => s.postedJobs);
  const agreements = useDemo((s) => s.agreements);
  const reported = useDemo((s) => s.reported);
  const [mineOnly, setMineOnly] = useState(true);
  const [span, setSpan] = useState<SpanFilter>("all");
  const [view, setView] = useState<"list" | "map">("list");
  const naka = NAKAS[me.naka] ?? NAKAS["ghatkopar-naka"]!;

  const jobs = useMemo(() => {
    const list = allJobs({ postedJobs }).filter((j) => !reported.includes(j.id));
    return list
      .filter((j) => (mineOnly ? j.trade === me.trade : true))
      .filter((j) => (span === "all" ? true : j.span === span))
      .sort((a, b) => {
        // Live posts first, scams last, then the worker's own trade, then the nearest.
        const live = Number(!!b.live) - Number(!!a.live);
        if (live) return live;
        const risk = RISK_RANK[assess(a, EMPLOYERS[a.employerId]).level] - RISK_RANK[assess(b, EMPLOYERS[b.employerId]).level];
        if (risk) return risk;
        const mine = Number(b.trade === me.trade) - Number(a.trade === me.trade);
        if (mine) return mine;
        return (a.abroad ? Infinity : a.km) - (b.abroad ? Infinity : b.km);
      });
  }, [postedJobs, reported, mineOnly, span, me.trade]);

  const myDeals = agreements.filter((a) => a.workerId === me.id && !["declined", "paid"].includes(a.status));
  const hiringCount = new Set(allJobs({ postedJobs }).map((j) => j.employerId)).size + 14;

  return (
    <div className="space-y-6 pt-4">
      <section className="flex items-center gap-3">
        <Avatar name={me.name} hue={me.hue} trade={me.trade} size="md" />
        <div className="min-w-0">
          <h1 className="font-display text-[1.6rem] leading-tight font-extrabold">
            {t("greet", { name: (lang !== "en" && me.nameDeva ? me.nameDeva : me.name).split(" ")[0]! })}
          </h1>
          <p className="flex items-center gap-1 text-[0.95rem] text-muted">
            <MapPin className="size-4" aria-hidden="true" />
            {p(naka.spot)}
          </p>
        </div>
      </section>

      <Availability hiringCount={hiringCount} />

      {myDeals.length ? (
        <section aria-labelledby="deals-title" className="space-y-3">
          <SectionTitle id="deals-title">{t("yourDeals")}</SectionTitle>
          <ul className="space-y-3">
            {myDeals.map((a) => (
              <DealRow key={a.id} a={a} />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="work-title" className="space-y-3">
        <SectionTitle
          id="work-title"
          action={
            <div className="flex rounded-full border-2 border-ink/15 bg-white p-0.5" role="group" aria-label="View">
              {(["list", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  aria-label={v === "list" ? "List" : "Map"}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full transition-colors",
                    view === v ? "bg-ink text-paper" : "text-ink hover:bg-sand",
                  )}
                >
                  {v === "list" ? <List className="size-5" aria-hidden="true" /> : <MapIcon className="size-5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          }
        >
          {t("workNear", { naka: p(naka.name) })}
        </SectionTitle>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          <Chip selected={mineOnly} onClick={() => setMineOnly(true)}>
            <span className="-ml-2 flex size-8 items-center justify-center rounded-full bg-white">
              <TradeIcon trade={me.trade} className="size-6" />
            </span>
            {t("myTrade")} · {p(TRADES[me.trade].label)}
          </Chip>
          <Chip selected={!mineOnly} onClick={() => setMineOnly(false)}>
            {t("allTrades")}
          </Chip>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {SPAN_CHIPS.map((c) => (
            <Chip key={c.id} selected={span === c.id} onClick={() => setSpan(c.id)} className="h-10 text-[0.9rem]">
              {t(c.key)}
            </Chip>
          ))}
        </div>

        <p className="text-[0.9rem] font-bold text-muted" aria-live="polite">
          {t("jobsCount", { n: jobs.length })}
        </p>

        {view === "map" ? (
          <AreaMap
            lang={lang}
            label={t("workNear", { naka: p(naka.name) })}
            className="aspect-[4/5]"
            pins={[
              { id: "naka", x: AREAS[naka.area].pin.x, y: AREAS[naka.area].pin.y, kind: "naka", label: "★" },
              ...jobs
                .filter((j) => !j.abroad)
                .map((j) => {
                  const danger = assess(j, EMPLOYERS[j.employerId]).level === "danger";
                  return {
                    id: j.id,
                    x: j.pin.x,
                    y: j.pin.y,
                    kind: danger ? ("danger" as const) : ("job" as const),
                    label: money(j.pay),
                  };
                }),
            ]}
          />
        ) : null}

        {jobs.length === 0 ? (
          <div className="rounded-[1.4rem] border-2 border-dashed border-line bg-white p-6 text-center">
            <p className="font-display text-lg font-extrabold">{t("noJobs")}</p>
            <p className="mt-1 text-muted">{t("noJobsHint")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={true}>
              {jobs.map((job, i) => (
                <motion.li
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <JobCard
                    job={job}
                    mine={job.trade === me.trade && !mineOnly}
                    asked={agreements.some((a) => a.jobId === job.id && a.workerId === me.id && a.status !== "declined")}
                    href={`/worker/job/${job.id}`}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

function Availability({ hiringCount }: { hiringCount: number }) {
  const { t } = useT();
  const available = useDemo((s) => s.available);
  const setAvailable = useDemo((s) => s.setAvailable);
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border-2 border-ink p-4 transition-colors duration-300",
        available ? "bg-ink text-paper on-dark" : "bg-white text-ink",
      )}
    >
      {available ? <div className="absolute inset-0 ink-grain opacity-60" aria-hidden="true" /> : null}
      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 id="avail-q" className="font-display text-[1.3rem] leading-tight font-extrabold">
            {t("availQ")}
          </h2>
          <p className={cn("mt-1 flex items-center gap-2 font-bold", available ? "text-marigold" : "text-muted")}>
            <span
              className={cn("inline-block size-2.5 rounded-full", available ? "animate-pulse-ring bg-[#3ddc84]" : "bg-muted/50")}
              aria-hidden="true"
            />
            {available ? t("availOn") : t("availOff")}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={available}
          aria-labelledby="avail-q"
          onClick={() => setAvailable(!available)}
          className={cn(
            "relative h-14 w-24 shrink-0 rounded-full border-2 transition-colors duration-300",
            available ? "border-marigold bg-marigold" : "border-ink bg-sand-2",
          )}
        >
          <motion.span
            className="absolute top-1 left-1 flex size-11 items-center justify-center rounded-full border-2 border-ink bg-white font-display text-sm font-extrabold text-ink"
            animate={{ x: available ? 40 : 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 400 }}
          >
            {available ? t("yes") : t("no")}
          </motion.span>
        </button>
      </div>
      <p className={cn("relative mt-3 text-[0.9rem]", available ? "text-paper/75" : "text-muted")}>
        {t("availHint", { count: hiringCount })}
      </p>
    </section>
  );
}

const DEAL_STATUS: Record<Agreement["status"], { key: TKey; tone: "marigold" | "sky" | "leaf" | "alert" | "danger" | "sand" }> = {
  offered: { key: "statusOffered", tone: "marigold" },
  requested: { key: "statusRequested", tone: "sky" },
  agreed: { key: "statusAgreed", tone: "leaf" },
  done: { key: "statusDone", tone: "marigold" },
  paid: { key: "statusPaid", tone: "leaf" },
  declined: { key: "statusDeclined", tone: "sand" },
  disputed: { key: "statusDisputed", tone: "danger" },
};

function DealRow({ a }: { a: Agreement }) {
  const { t, p } = useT();
  const postedJobs = useDemo((s) => s.postedJobs);
  const job = findJob({ postedJobs }, a.jobId);
  if (!job) return null;
  const st = DEAL_STATUS[a.status];
  const urgent = a.status === "offered" || a.status === "done";
  const employer = EMPLOYERS[a.employerId]?.name ?? "";
  return (
    <li>
      <Link
        href={`/worker/agreement/${a.id}`}
        className={cn(
          "flex items-center gap-3 rounded-[1.4rem] border-2 p-3.5 transition-transform hover:-translate-y-0.5",
          urgent ? "border-ink bg-marigold shadow-[0_4px_0_0_var(--color-ink)]" : "border-ink/10 bg-white shadow-card",
        )}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/70">
          <TradeIcon trade={job.trade} className="size-9" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[1.05rem] leading-tight font-extrabold">
            {a.status === "offered" ? t("offerFor", { employer }) : p(TRADES[job.trade].work)}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <Tag tone={urgent ? "ink" : st.tone}>{t(st.key, { employer })}</Tag>
            <span className="text-[0.85rem] font-bold">{money(job.pay)}</span>
          </span>
        </span>
        <ChevronRight className="size-6 shrink-0" aria-hidden="true" />
      </Link>
    </li>
  );
}
