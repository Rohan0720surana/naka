"use client";

import Link from "next/link";
import { BadgeCheck, CalendarDays, Clock, MapPin, ShieldX } from "lucide-react";
import { ScamTape } from "@/components/art/Moments";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { SpeakButton } from "@/components/SpeakButton";
import { ShieldBadge, Tag } from "@/components/ui/primitives";
import { EMPLOYERS } from "@/lib/data/jobs";
import { AREAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { hoursRange, money, PROVIDED_KEY, startsKey, TIMING_KEY, UNIT_KEY } from "@/lib/format";
import { useT } from "@/lib/hooks";
import { jobSpeech, jobTotalText, SHIELD_KEY, travelText } from "@/lib/jobText";
import { assess } from "@/lib/risk";
import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

export function JobCard({
  job,
  mine,
  asked,
  href,
  preview,
}: {
  job: Job;
  mine?: boolean;
  asked?: boolean;
  href?: string;
  /** Static preview (employer posting form) — no link, no speech. */
  preview?: boolean;
}) {
  const { t, p, lang } = useT();
  const employer = EMPLOYERS[job.employerId];
  const a = assess(job, employer);
  const s = startsKey(job.startsIn);
  const isNew = job.live || job.postedMinutesAgo < 10;
  const danger = a.level === "danger";
  const total = jobTotalText(job, lang);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.4rem] border-2 bg-white shadow-card transition-[transform,box-shadow] duration-200",
        danger ? "border-danger/50" : "border-ink/10",
        !preview && "hover:-translate-y-0.5 hover:shadow-pop",
      )}
    >
      {danger && !preview ? <ScamTape className="top-[56%]" /> : null}
      {danger ? (
        <div className="flex items-center gap-2 bg-danger px-4 py-2 text-[0.9rem] font-extrabold text-white">
          <ShieldX className="size-5" aria-hidden="true" />
          {t("shieldDanger")}
        </div>
      ) : null}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", danger ? "bg-danger-soft" : "bg-sand")}>
            <TradeIcon trade={job.trade} className="size-10" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {isNew ? <Tag tone="ink">{t("newBadge")}</Tag> : null}
              {mine ? <Tag tone="marigold">{t("myTrade")}</Tag> : null}
            </div>
            <h3 className="mt-1 font-display text-[1.2rem] leading-tight font-extrabold">
              {preview || !href ? (
                p(TRADES[job.trade].work)
              ) : (
                <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                  {p(TRADES[job.trade].work)}
                </Link>
              )}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[0.88rem] text-muted">
              {employer?.phoneVerified ? <BadgeCheck className="size-4 shrink-0 text-leaf" aria-hidden="true" /> : null}
              <span className="truncate">{employer?.name}</span>
            </p>
          </div>
          {preview ? null : <SpeakButton text={jobSpeech(job, lang)} compact />}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-[2rem] leading-none font-extrabold tabular">{money(job.pay)}</span>
          <span className="text-[1rem] font-bold text-muted">{t(UNIT_KEY[job.unit])}</span>
        </div>
        {total ? <p className="mt-1 text-[0.85rem] font-bold text-muted">{total}</p> : null}

        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[0.92rem]">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{t("termHours")}</dt>
            <Clock className="size-[1.1rem] shrink-0 text-ink-3" aria-hidden="true" />
            <dd className="font-bold whitespace-nowrap">{hoursRange(job.startHour, job.endHour, lang)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{t("termStart")}</dt>
            <CalendarDays className="size-[1.1rem] shrink-0 text-ink-3" aria-hidden="true" />
            <dd className="font-bold whitespace-nowrap">{t(s.key, { n: s.n ?? 0 })}</dd>
          </div>
          <div className="flex w-full min-w-0 items-center gap-1.5">
            <dt className="sr-only">{t("termPlace")}</dt>
            <MapPin className="size-[1.1rem] shrink-0 text-ink-3" aria-hidden="true" />
            <dd className="truncate">
              <span className="font-bold">{p(AREAS[job.area].name)}</span>
              {job.abroad ? null : <span className="text-muted"> · {job.km} km · {travelText(job, lang)}</span>}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <ShieldBadge level={a.level} label={t(SHIELD_KEY[a.level])} />
          <Tag tone={job.payTiming === "same-day" ? "leaf" : job.payTiming === "unclear" ? "alert" : "sand"}>
            {t(TIMING_KEY[job.payTiming])}
          </Tag>
          {job.provided.slice(0, 2).map((pr) => (
            <Tag key={pr}>{t(PROVIDED_KEY[pr])}</Tag>
          ))}
          {asked ? <Tag tone="sky">{t("alreadyAsked")}</Tag> : null}
        </div>
      </div>
    </article>
  );
}
