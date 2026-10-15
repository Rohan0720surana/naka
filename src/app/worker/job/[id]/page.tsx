"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Flag, Phone, ShieldX, Star, Users } from "lucide-react";
import { useState } from "react";
import { AreaMap } from "@/components/AreaMap";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { Sheet } from "@/components/Sheet";
import { SpeakButton } from "@/components/SpeakButton";
import { AgreementTerms, agreementSpeech } from "@/components/worker/AgreementTerms";
import { FairMeter, HoursBar, ProvidedGrid, SafetyChecks } from "@/components/worker/JobBits";
import { Button, ButtonLink, Card, Notice, SectionTitle, ShieldBadge, Tag } from "@/components/ui/primitives";
import { EMPLOYERS } from "@/lib/data/jobs";
import { AREAS, NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { money, startsKey, TIMING_KEY, UNIT_KEY } from "@/lib/format";
import { useT } from "@/lib/hooks";
import type { TKey } from "@/lib/i18n";
import { durationText, jobSpeech, jobTotalText, SHIELD_KEY, travelText } from "@/lib/jobText";
import { assess } from "@/lib/risk";
import { findJob, useDemo } from "@/lib/store";
import type { EmployerKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_KEY: Record<EmployerKind, TKey> = {
  home: "kindHome",
  contractor: "kindContractor",
  company: "kindCompany",
  agent: "kindAgent",
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, p, lang } = useT();
  const postedJobs = useDemo((s) => s.postedJobs);
  const me = useDemo((s) => s.me);
  const agreements = useDemo((s) => s.agreements);
  const reported = useDemo((s) => s.reported);
  const requestJob = useDemo((s) => s.requestJob);
  const reportJob = useDemo((s) => s.reportJob);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

  const job = findJob({ postedJobs }, id);
  if (!job) {
    return (
      <div className="pt-10 text-center">
        <p className="font-display text-xl font-extrabold">{t("noJobs")}</p>
        <ButtonLink href="/worker" variant="outline" className="mt-4">
          {t("back")}
        </ButtonLink>
      </div>
    );
  }

  const employer = EMPLOYERS[job.employerId];
  const a = assess(job, employer);
  const danger = a.level === "danger";
  const deal = agreements.find((x) => x.jobId === job.id && x.workerId === me.id && x.status !== "declined");
  const isReported = reported.includes(job.id);
  const naka = NAKAS[me.naka] ?? NAKAS["ghatkopar-naka"]!;
  const s = startsKey(job.startsIn);
  const total = jobTotalText(job, lang);

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between gap-2">
        <Link href="/worker" className="-ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-2 font-bold hover:bg-sand">
          <ArrowLeft className="size-5" aria-hidden="true" />
          {t("back")}
        </Link>
        <SpeakButton say={(l) => jobSpeech(job, l)} />
      </div>

      {danger ? (
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: [0, -8, 8, -6, 6, -3, 0] }}
          transition={{ x: { delay: 0.35, duration: 0.5 } }}
          className="mt-3 overflow-hidden rounded-[1.4rem] border-2 border-ink bg-danger text-white"
          role="alert"
        >
          <div className="h-3 hatch-marigold" aria-hidden="true" />
          <div className="flex gap-3 p-4">
            <ShieldX className="size-9 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display text-xl leading-tight font-extrabold">{t("shieldDanger")}</p>
              <p className="mt-1 text-[0.95rem] leading-snug">{t("dangerAdvice")}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      <header className="mt-4 flex items-start gap-3.5">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-[1.2rem] border-2 border-ink bg-marigold-soft">
          <TradeIcon trade={job.trade} className="size-12" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-[1.65rem] leading-tight font-extrabold">{p(TRADES[job.trade].work)}</h1>
          <p className="mt-0.5 text-muted">
            {employer?.name} · {t(KIND_KEY[employer?.kind ?? "home"])}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <ShieldBadge level={a.level} label={t(SHIELD_KEY[a.level])} />
            <Tag icon={<Users className="size-3.5" aria-hidden="true" />}>
              {job.workers === 1 ? t("needOneWorker") : t("needWorkers", { n: job.workers })}
            </Tag>
          </div>
        </div>
      </header>

      <Card className="mt-5 p-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[2.6rem] leading-none font-extrabold tabular">{money(job.pay)}</span>
          <span className="text-lg font-bold text-muted">{t(UNIT_KEY[job.unit])}</span>
        </div>
        {total ? <p className="mt-1 font-bold text-muted">{total}</p> : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag tone={job.payTiming === "same-day" ? "leaf" : job.payTiming === "unclear" ? "alert" : "sand"}>
            {t(TIMING_KEY[job.payTiming])}
          </Tag>
          <Tag>{{ cash: t("modeCash"), upi: t("modeUpi"), bank: t("modeBank") }[job.payMode]}</Tag>
        </div>
      </Card>

      <section className="mt-6 space-y-3" aria-labelledby="when">
        <SectionTitle id="when">{t("jobWhen")}</SectionTitle>
        <Card className="p-4">
          <p className="mb-3 font-bold">
            {t(s.key, { n: s.n ?? 0 })} · {durationText(job, lang)}
          </p>
          <HoursBar start={job.startHour} end={job.endHour} />
        </Card>
      </section>

      <section className="mt-6 space-y-3" aria-labelledby="where">
        <SectionTitle id="where">{t("jobWhere")}</SectionTitle>
        <Card className="overflow-hidden">
          {job.abroad ? (
            <div className="flex h-36 items-center justify-center bg-danger-soft font-display text-xl font-extrabold text-danger">
              {t("outsideIndia")}
            </div>
          ) : (
            <AreaMap
              lang={lang}
              label={t("jobWhere")}
              className="aspect-[16/10] rounded-none border-0"
              pins={[
                { id: "naka", x: AREAS[naka.area].pin.x, y: AREAS[naka.area].pin.y, kind: "me", label: "★" },
                {
                  id: job.id,
                  x: job.pin.x,
                  y: job.pin.y,
                  kind: danger ? "danger" : "job",
                  label: job.vagueLocation ? "?" : p(AREAS[job.area].name),
                  active: true,
                },
              ]}
            />
          )}
          <div className="p-4">
            <p className="font-display text-lg font-extrabold">{p(AREAS[job.area].name)}</p>
            <p className={cn("text-[0.95rem]", job.vagueLocation ? "font-bold text-danger" : "text-muted")}>{job.landmark}</p>
            {job.abroad ? null : (
              <p className="mt-1 font-bold">
                {job.km} km · {travelText(job, lang)}
              </p>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6 space-y-3" aria-labelledby="given">
        <SectionTitle id="given">{t("jobGiven")}</SectionTitle>
        <ProvidedGrid provided={job.provided} />
      </section>

      {job.note ? (
        <section className="mt-6 space-y-3" aria-labelledby="about">
          <SectionTitle id="about">{t("jobAbout")}</SectionTitle>
          <p className="rounded-[1.2rem] bg-sand p-4 text-[1.05rem] leading-relaxed">{p(job.note)}</p>
        </section>
      ) : null}

      <section className="mt-6 space-y-3" aria-labelledby="fair">
        <SectionTitle id="fair">{t("fairTitle")}</SectionTitle>
        <Card className="p-4">
          <FairMeter job={job} fair={a.fair} />
        </Card>
      </section>

      <section className="mt-6 space-y-3" aria-labelledby="safety">
        <SectionTitle id="safety">{t("shieldTitle")}</SectionTitle>
        <Card className={cn("p-4", danger && "border-danger/40")}>
          <SafetyChecks a={a} />
          {a.level !== "safe" ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant={danger ? "danger" : "outline"} size="sm" onClick={() => reportJob(job.id)} disabled={isReported}>
                <Flag className="size-4" aria-hidden="true" />
                {t("reportJob")}
              </Button>
              <ButtonLink href="/worker/haq#help" variant="outline" size="sm">
                {t("askSaathi")}
              </ButtonLink>
            </div>
          ) : null}
          {isReported ? (
            <p className="mt-3 rounded-xl bg-leaf-soft p-3 font-bold text-leaf" role="status">
              {t("reported")}
            </p>
          ) : null}
        </Card>
      </section>

      {employer ? (
        <section className="mt-6 space-y-3" aria-labelledby="who">
          <SectionTitle id="who">{t("jobEmployer")}</SectionTitle>
          <Card className="p-4">
            <p className="font-display text-lg font-extrabold">{employer.name}</p>
            <p className="text-muted">{t(KIND_KEY[employer.kind])}</p>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li className={cn("flex items-center gap-2 font-bold", employer.phoneVerified ? "text-leaf" : "text-danger")}>
                <BadgeCheck className="size-5" aria-hidden="true" />
                {employer.phoneVerified ? t("phoneVerified") : t("phoneNotVerified")}
              </li>
              <li>
                {employer.hiredOnNaka > 0 ? t("hiredBefore", { n: employer.hiredOnNaka }) : t("newEmployer")}
              </li>
              {employer.hiredOnNaka > 0 ? (
                <li>{t("paidOnTime", { a: employer.paidOnTime, b: employer.hiredOnNaka })}</li>
              ) : null}
              {employer.rating ? (
                <li className="flex items-center gap-1 font-bold">
                  <Star className="size-4 fill-marigold text-marigold-deep" aria-hidden="true" />
                  {employer.rating.toFixed(1)}
                </li>
              ) : null}
            </ul>
          </Card>
        </section>
      ) : null}

      <div className="h-24" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-[78px] z-20 mx-auto max-w-[480px] px-4 pb-2 no-print">
        <div className="rounded-[1.4rem] border-2 border-ink/10 bg-paper/95 p-2 shadow-pop backdrop-blur">
          {danger ? (
            <Button variant="danger" size="lg" className="w-full" onClick={() => reportJob(job.id)} disabled={isReported}>
              <Flag className="size-5" aria-hidden="true" />
              {isReported ? t("reported").split(".")[0] : t("dontGo")}
            </Button>
          ) : deal ? (
            <ButtonLink href={`/worker/agreement/${deal.id}`} variant="primary" size="lg" className="w-full">
              {t("viewDeal")}
            </ButtonLink>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="lg" className="px-4" onClick={() => setCallOpen(true)} aria-label={t("call")}>
                <Phone className="size-5" aria-hidden="true" />
              </Button>
              <Button variant="primary" size="lg" className="flex-1" onClick={() => setConfirmOpen(true)}>
                {t("wantWork")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title={t("checkDeal")} closeLabel={t("close")}>
        <div className="rounded-[1.2rem] border-2 border-ink bg-white p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-display text-lg font-extrabold">{t("pakkaTitle")}</span>
            <SpeakButton say={(l) => agreementSpeech(job, l)} compact />
          </div>
          <AgreementTerms job={job} lang={lang} />
        </div>
        {a.level === "careful" ? (
          <Notice tone="alert" className="mt-3">
            {a.flags.map((f) => t(f.key, f.vars)).join(" ")}
          </Notice>
        ) : null}
        <Button
          variant="primary"
          size="xl"
          className="mt-4 w-full"
          data-autofocus
          onClick={() => {
            const ag = requestJob(job.id);
            setConfirmOpen(false);
            if (ag) router.push(`/worker/agreement/${ag.id}`);
          }}
        >
          {t("sendRequest")}
        </Button>
      </Sheet>

      <Sheet open={callOpen} onClose={() => setCallOpen(false)} title={t("call")} closeLabel={t("close")}>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-ink bg-marigold">
            <Phone className="size-8" aria-hidden="true" />
          </span>
          <p className="font-display text-lg font-extrabold">{employer?.name}</p>
          <p className="text-[1rem] leading-snug">{t("callNote")}</p>
          <Notice tone="sky" className="w-full text-left">
            {t("callDemo")}
          </Notice>
        </div>
      </Sheet>
    </div>
  );
}
