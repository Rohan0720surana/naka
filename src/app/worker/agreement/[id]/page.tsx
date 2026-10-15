"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, CircleCheck, Hourglass, Scale, Share2, ShieldAlert, Sparkles } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { SpeakButton } from "@/components/SpeakButton";
import { AgreementTerms, agreementSpeech } from "@/components/worker/AgreementTerms";
import { Button, ButtonLink, Card, Notice } from "@/components/ui/primitives";
import { EMPLOYERS } from "@/lib/data/jobs";
import { jobTotal, money, timeOfDay } from "@/lib/format";
import { useT } from "@/lib/hooks";
import type { TKey } from "@/lib/i18n";
import { findJob, useDemo } from "@/lib/store";
import type { AgreementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: { key: TKey; reached: AgreementStatus[] }[] = [
  { key: "stepAsked", reached: ["offered", "requested", "agreed", "done", "paid", "disputed"] },
  { key: "stepPakka", reached: ["agreed", "done", "paid", "disputed"] },
  { key: "stepDone", reached: ["done", "paid", "disputed"] },
  { key: "stepPaid", reached: ["paid"] },
];

const STATUS: Record<AgreementStatus, { key: TKey; cls: string; Icon: typeof Check }> = {
  offered: { key: "statusOffered", cls: "bg-marigold text-ink", Icon: Sparkles },
  requested: { key: "statusRequested", cls: "bg-sky-soft text-ink", Icon: Hourglass },
  agreed: { key: "statusAgreed", cls: "bg-leaf text-white", Icon: CircleCheck },
  done: { key: "statusDone", cls: "bg-marigold text-ink", Icon: Hourglass },
  paid: { key: "statusPaid", cls: "bg-leaf text-white", Icon: CircleCheck },
  declined: { key: "statusDeclined", cls: "bg-sand text-ink", Icon: Check },
  disputed: { key: "statusDisputed", cls: "bg-danger text-white", Icon: ShieldAlert },
};

export default function AgreementPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useT();
  const a = useDemo((s) => s.agreements.find((x) => x.id === id));
  const postedJobs = useDemo((s) => s.postedJobs);
  const me = useDemo((s) => s.me);
  const respond = useDemo((s) => s.respond);
  const confirmPaid = useDemo((s) => s.confirmPaid);

  const job = a ? findJob({ postedJobs }, a.jobId) : undefined;
  if (!a || !job) {
    return (
      <div className="pt-10 text-center">
        <p className="font-display text-xl font-extrabold">{t("agreementNotFound")}</p>
        <ButtonLink href="/worker" variant="outline" className="mt-4">
          {t("back")}
        </ButtonLink>
      </div>
    );
  }

  const employer = EMPLOYERS[a.employerId];
  const st = STATUS[a.status];
  const amount = jobTotal(job);
  const shareText = `${t("pakkaTitle")} ${a.code}\n${agreementSpeech(job, lang)}`;

  return (
    <div className="space-y-5 pt-3">
      <div className="flex items-center justify-between">
        <Link href="/worker" className="-ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-2 font-bold hover:bg-sand">
          <ArrowLeft className="size-5" aria-hidden="true" />
          {t("back")}
        </Link>
        <span className="rounded-full border-2 border-ink/15 bg-white px-3 py-1 font-mono text-sm font-bold">{a.code}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={a.status}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className={cn("flex items-center gap-3 rounded-[1.4rem] border-2 border-ink p-4", st.cls)}
          role="status"
        >
          <st.Icon className="size-9 shrink-0" aria-hidden="true" />
          <p className="font-display text-xl leading-tight font-extrabold">
            {t(st.key, { employer: employer?.name ?? "" })}
          </p>
        </motion.div>
      </AnimatePresence>

      <ol className="grid grid-cols-4 gap-1" aria-label={t("pakkaTitle")}>
        {STEPS.map((step, i) => {
          const done = step.reached.includes(a.status);
          return (
            <li key={step.key} className="flex flex-col items-center gap-1.5 text-center">
              <span className="flex w-full items-center">
                <span className={cn("h-1 flex-1 rounded-full", i === 0 ? "opacity-0" : done ? "bg-leaf" : "bg-line")} />
                <motion.span
                  initial={false}
                  animate={{ scale: done ? 1 : 0.85 }}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-extrabold",
                    done ? "border-ink bg-leaf text-white" : "border-line bg-white text-muted",
                  )}
                >
                  {done ? <Check className="size-5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                </motion.span>
                <span className={cn("h-1 flex-1 rounded-full", i === 3 ? "opacity-0" : STEPS[i + 1]!.reached.includes(a.status) ? "bg-leaf" : "bg-line")} />
              </span>
              <span className={cn("text-[0.8rem] font-bold", done ? "text-ink" : "text-muted")}>{t(step.key)}</span>
            </li>
          );
        })}
      </ol>

      <Card className="relative overflow-hidden border-ink p-0">
        <div className="flex items-center justify-between gap-2 bg-ink px-4 py-3 text-paper on-dark">
          <div className="flex items-center gap-2">
            <Scale className="size-5 text-marigold" aria-hidden="true" />
            <span className="font-display text-lg font-extrabold">{t("pakkaTitle")}</span>
          </div>
          <SpeakButton text={agreementSpeech(job, lang)} compact />
        </div>
        <div className="px-4 pt-1 pb-2">
          <AgreementTerms job={job} lang={lang} />
        </div>
        <div className="grid grid-cols-2 gap-px border-t-2 border-dashed border-line bg-line">
          <Party
            name={me.name}
            hue={me.hue}
            agreedAt={a.workerAgreedAt}
            label={a.workerAgreedAt ? t("agreedBy", { name: me.name.split(" ")[0]! }) : t("waiting")}
          />
          <Party
            name={employer?.name ?? ""}
            hue={210}
            agreedAt={a.employerAgreedAt}
            label={a.employerAgreedAt ? t("agreedBy", { name: (employer?.name ?? "").split(" ")[0]! }) : t("waiting")}
          />
        </div>
      </Card>

      {a.status === "offered" ? (
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <Button variant="outline" size="lg" onClick={() => respond(a.id, false, "worker")}>
            {t("decline")}
          </Button>
          <Button variant="leaf" size="lg" onClick={() => respond(a.id, true, "worker")}>
            <Check className="size-6" strokeWidth={3} aria-hidden="true" />
            {t("accept")}
          </Button>
        </div>
      ) : null}

      {a.status === "done" ? (
        <Card className="border-ink bg-marigold-soft p-4">
          <p className="font-display text-xl font-extrabold">{t("gotPaidQ", { amount: amount.toLocaleString("en-IN") })}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="lg" onClick={() => confirmPaid(a.id, false)}>
              {t("gotPaidNo")}
            </Button>
            <Button variant="leaf" size="lg" onClick={() => confirmPaid(a.id, true)}>
              {t("gotPaidYes")}
            </Button>
          </div>
        </Card>
      ) : null}

      {a.status === "paid" ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 14 }}>
          <Card className="flex items-center gap-3 border-leaf/40 bg-leaf-soft p-4">
            <CircleCheck className="size-10 shrink-0 text-leaf" aria-hidden="true" />
            <div>
              <p className="font-display text-xl font-extrabold">{money(amount)}</p>
              <Link href="/worker/khata" className="font-bold text-leaf underline underline-offset-4">
                {t("statusPaid")}
              </Link>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {a.status === "disputed" ? (
        <Card className="border-danger/40 p-4">
          <p className="font-display text-lg font-extrabold">{t("disputeTitle")}</p>
          <ol className="mt-3 space-y-3">
            {(["dispute1", "dispute2", "dispute3"] as const).map((k, i) => (
              <li key={k} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-paper">
                  {i + 1}
                </span>
                <span className="leading-snug">{t(k)}</span>
              </li>
            ))}
          </ol>
          <a href="tel:15100" className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl border-2 border-ink bg-white font-bold">
            15100
          </a>
        </Card>
      ) : null}

      {["agreed", "done", "paid", "disputed"].includes(a.status) ? (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-[#25d366] font-bold text-ink btn-sign"
        >
          <Share2 className="size-5" aria-hidden="true" />
          {t("shareWa")}
        </a>
      ) : null}

      <Notice tone="sky">{t("proofNote")}</Notice>
    </div>
  );
}

function Party({ name, hue, agreedAt, label }: { name: string; hue: number; agreedAt?: number; label: string }) {
  const { lang } = useT();
  return (
    <div className="flex items-center gap-2.5 bg-white p-3">
      <Avatar name={name} hue={hue} size="sm" />
      <div className="min-w-0">
        <p className={cn("truncate text-[0.88rem] font-extrabold", agreedAt ? "text-leaf" : "text-muted")}>
          {agreedAt ? "✓ " : ""}
          {label}
        </p>
        {agreedAt ? <p className="text-[0.78rem] text-muted">{timeOfDay(agreedAt, lang)}</p> : null}
      </div>
    </div>
  );
}
