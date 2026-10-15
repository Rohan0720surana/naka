"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, MessageSquareText, PhoneOff, Send, UserPlus, Users } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { SpeakButton } from "@/components/SpeakButton";
import { Card, SectionTitle, Tag } from "@/components/ui/primitives";
import { EMPLOYERS } from "@/lib/data/jobs";
import { AREAS, NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { SAATHI_NAME } from "@/lib/data/workers";
import { hoursRange, money, UNIT_KEY } from "@/lib/format";
import { useT } from "@/lib/hooks";
import { jobSpeech } from "@/lib/jobText";
import { assess } from "@/lib/risk";
import { allJobs, allWorkers, useDemo } from "@/lib/store";
import type { Worker } from "@/lib/types";
import { cn } from "@/lib/utils";

const NONE_SENT: string[] = [];

export default function SaathiPage() {
  const { t, p } = useT();
  const state = useDemo();
  const managed = allWorkers(state).filter((w) => w.helpedBy === SAATHI_NAME);
  const present = managed.filter((w) => w.availableToday);
  const naka = NAKAS["ghatkopar-naka"]!;

  return (
    <div className="space-y-6 pt-4">
      <section className="flex items-center gap-3">
        <Avatar name={SAATHI_NAME} hue={140} size="md" ring />
        <div>
          <h1 className="font-display text-[1.5rem] leading-tight font-extrabold">{SAATHI_NAME}</h1>
          <p className="text-[0.95rem] text-muted">
            {t("saathiTitle")} · {p(naka.name)}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.6rem] border-2 border-ink bg-ink p-5 text-paper on-dark">
        <div className="absolute inset-0 ink-grain opacity-60" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <Users className="size-10 text-marigold" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.6rem] leading-none font-extrabold">{t("presentCount", { a: present.length, b: managed.length })}</p>
            <p className="mt-1.5 text-[0.95rem] text-paper/75">{t("saathiSub")}</p>
          </div>
        </div>
        <p className="relative mt-4 rounded-xl bg-white/10 p-3 text-[0.95rem] leading-snug">{t("saathiNote")}</p>
      </section>

      <section className="space-y-3" aria-labelledby="managed">
        <SectionTitle id="managed">{t("saathiWorkers")}</SectionTitle>
        <ul className="space-y-2.5">
          {managed.map((w, i) => (
            <motion.li key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <WorkerRow w={w} />
            </motion.li>
          ))}
        </ul>
        <Link
          href="/worker/welcome?for=saathi"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-marigold text-lg font-bold btn-sign"
        >
          <UserPlus className="size-6" aria-hidden="true" />
          {t("registerNew")}
        </Link>
      </section>

      <section className="space-y-3" aria-labelledby="fits">
        <SectionTitle id="fits">{t("jobsForThem")}</SectionTitle>
        {present.length === 0 ? <p className="text-muted">—</p> : null}
        <ul className="space-y-3">
          {present.map((w) => (
            <JobsFor key={w.id} w={w} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function WorkerRow({ w }: { w: Worker }) {
  const { t, p, lang } = useT();
  const toggle = useDemo((s) => s.saathiToggle);
  return (
    <Card className="flex items-center gap-3 p-3.5">
      <Avatar name={w.name} hue={w.hue} trade={w.trade} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold">{lang !== "en" && w.nameDeva ? w.nameDeva : w.name}</p>
        <p className="text-[0.85rem] text-muted">{p(TRADES[w.trade].label)}</p>
        <Tag tone={w.phone === "feature" ? "sky" : "sand"} className="mt-1" icon={w.phone === "feature" ? <MessageSquareText className="size-3.5" aria-hidden="true" /> : <PhoneOff className="size-3.5" aria-hidden="true" />}>
          {w.phone === "feature" ? t("smsOn") : t("viaYou")}
        </Tag>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={w.availableToday}
        aria-label={`${t("atNakaToday")}: ${w.name}`}
        onClick={() => toggle(w.id)}
        className={cn(
          "flex h-12 shrink-0 items-center gap-1.5 rounded-full border-2 px-3 text-[0.85rem] font-extrabold transition-colors",
          w.availableToday ? "border-ink bg-leaf text-white" : "border-line bg-white text-muted",
        )}
      >
        {w.availableToday ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : null}
        {t("atNakaToday")}
      </button>
    </Card>
  );
}

function JobsFor({ w }: { w: Worker }) {
  const { t, p, lang } = useT();
  const postedJobs = useDemo((s) => s.postedJobs);
  const sent = useDemo((s) => s.smsSentJobs[w.id]) ?? NONE_SENT;
  const send = useDemo((s) => s.saathiSendJob);
  const jobs = allJobs({ postedJobs })
    .filter((j) => j.trade === w.trade && assess(j, EMPLOYERS[j.employerId]).level === "safe")
    .slice(0, 2);
  if (jobs.length === 0) return null;
  return (
    <li>
      <Card className="p-4">
        <p className="flex items-center gap-2 font-display text-lg font-extrabold">
          <TradeIcon trade={w.trade} className="size-7" />
          {t("forWorker", { name: (lang !== "en" && w.nameDeva ? w.nameDeva : w.name).split(" ")[0]! })}
        </p>
        <ul className="mt-3 space-y-2">
          {jobs.map((j) => {
            const done = sent.includes(j.id);
            return (
              <li key={j.id} className="flex items-center gap-3 rounded-2xl bg-sand p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {p(AREAS[j.area].name)} · {money(j.pay)} {t(UNIT_KEY[j.unit])}
                  </p>
                  <p className="text-[0.85rem] text-muted">
                    {hoursRange(j.startHour, j.endHour, lang)} · {EMPLOYERS[j.employerId]?.name}
                  </p>
                </div>
                {w.phone === "feature" ? (
                  <button
                    type="button"
                    disabled={done}
                    onClick={() => send(w.id, j.id)}
                    className={cn(
                      "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border-2 px-3 font-bold",
                      done ? "border-leaf/40 bg-leaf-soft text-leaf" : "border-ink bg-white hover:bg-marigold-soft",
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                    {done ? t("smsSent") : t("sendSms")}
                  </button>
                ) : (
                  <SpeakButton say={(l) => jobSpeech(j, l)} compact />
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </li>
  );
}
