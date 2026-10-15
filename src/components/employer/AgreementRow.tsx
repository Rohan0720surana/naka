"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown, Hourglass, MessageSquareText, Star, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { AgreementTerms } from "@/components/worker/AgreementTerms";
import { Button, Tag } from "@/components/ui/primitives";
import { TRADES } from "@/lib/data/trades";
import { jobTotal, money } from "@/lib/format";
import { findJob, findWorker, useDemo } from "@/lib/store";
import type { Agreement } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: Record<Agreement["status"], { label: string; tone: "marigold" | "sky" | "leaf" | "sand" | "danger" | "alert" }> = {
  requested: { label: "Wants this work", tone: "marigold" },
  offered: { label: "Offer sent", tone: "sky" },
  agreed: { label: "Pakka", tone: "leaf" },
  done: { label: "Waiting for payment check", tone: "alert" },
  paid: { label: "Paid · closed", tone: "leaf" },
  declined: { label: "Declined", tone: "sand" },
  disputed: { label: "Payment not received", tone: "danger" },
};

export function AgreementRow({ a }: { a: Agreement }) {
  const state = useDemo();
  const respond = useDemo((s) => s.respond);
  const markDone = useDemo((s) => s.markDone);
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const job = findJob(state, a.jobId);
  const worker = findWorker(state, a.workerId);
  if (!job || !worker) return null;
  const st = STATUS[a.status];
  const first = worker.name.split(" ")[0];
  const amount = jobTotal(job);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[1.4rem] border-2 bg-white p-4 shadow-card",
        a.status === "requested" ? "border-ink shadow-[0_4px_0_0_var(--color-ink)]" : "border-ink/10",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Avatar name={worker.name} hue={worker.hue} trade={worker.trade} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight font-extrabold">
            {worker.name}
            {a.via === "sms" ? (
              <Tag tone="sky" className="ml-2 align-middle" icon={<MessageSquareText className="size-3.5" aria-hidden="true" />}>
                via SMS
              </Tag>
            ) : null}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <TradeIcon trade={job.trade} className="size-5" />
            {TRADES[job.trade].work.en} · {money(job.pay)} · <span className="font-mono">{a.code}</span>
          </p>
        </div>
        <Tag tone={st.tone}>{st.label}</Tag>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {a.status === "requested" ? (
          <>
            <Button size="sm" variant="outline" onClick={() => respond(a.id, false, "employer")}>
              Decline
            </Button>
            <Button size="sm" variant="leaf" onClick={() => respond(a.id, true, "employer")}>
              <Check className="size-4" strokeWidth={3} aria-hidden="true" />
              Confirm — make it pakka
            </Button>
          </>
        ) : null}
        {a.status === "offered" ? (
          <p className="flex items-center gap-2 text-sm font-bold text-muted">
            <Hourglass className="size-4" aria-hidden="true" /> Waiting for {first} to answer
            {a.via === "sms" ? " by SMS" : ""}
          </p>
        ) : null}
        {a.status === "agreed" ? (
          <Button size="sm" variant="primary" onClick={() => markDone(a.id)}>
            Mark work done & paid {money(amount)}
          </Button>
        ) : null}
        {a.status === "done" ? (
          <p className="flex items-center gap-2 text-sm font-bold text-muted">
            <Hourglass className="size-4" aria-hidden="true" /> {first} is confirming the {money(amount)} payment
          </p>
        ) : null}
        {a.status === "disputed" ? (
          <>
            <p className="flex items-center gap-2 text-sm font-bold text-danger">
              <TriangleAlert className="size-4" aria-hidden="true" /> {first} says the payment didn&apos;t arrive.
            </p>
            <Button size="sm" variant="outline" onClick={() => markDone(a.id)}>
              I&apos;ve sent it again
            </Button>
          </>
        ) : null}
        {a.status === "paid" ? (
          <div className="flex items-center gap-1" role="radiogroup" aria-label={`Rate ${first}`}>
            <span className="mr-1 text-sm font-bold text-muted">Rate {first}</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setStars(n)}
                className="inline-flex size-9 items-center justify-center rounded-full hover:bg-sand"
              >
                <Star className={cn("size-5", n <= stars ? "fill-marigold text-marigold-deep" : "text-line")} aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="ml-auto inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-bold hover:bg-sand"
        >
          Terms <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <div className="mt-2 rounded-2xl bg-paper px-3">
          <AgreementTerms job={job} lang="en" />
        </div>
      ) : null}
    </motion.article>
  );
}
