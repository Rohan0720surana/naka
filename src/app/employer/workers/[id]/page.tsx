"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CircleCheck, Hourglass, MessageSquareText, Phone, Quote, Send } from "lucide-react";
import { useState } from "react";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { KaamCard } from "@/components/worker/KaamCard";
import { AgreementTerms } from "@/components/worker/AgreementTerms";
import { BeforeAfter, WorkTiles } from "@/components/worker/WorkPhotos";
import { Button, ButtonLink, Card, Notice, Tag } from "@/components/ui/primitives";
import { DEMO_EMPLOYER_ID } from "@/lib/data/jobs";
import { AREAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { MAIN_WORKER_ID } from "@/lib/data/workers";
import { hoursRange, money, UNIT_KEY } from "@/lib/format";
import { translate } from "@/lib/i18n";
import { allJobs, findWorker, khataDays, useDemo } from "@/lib/store";

export default function WorkerProfile() {
  const { id } = useParams<{ id: string }>();
  const state = useDemo();
  const offerJob = useDemo((s) => s.offerJob);
  const worker = findWorker(state, id);
  const myJobs = allJobs(state).filter((j) => j.employerId === DEMO_EMPLOYER_ID);
  const fitting = worker ? myJobs.filter((j) => j.trade === worker.trade) : [];
  const [jobId, setJobId] = useState<string | null>(null);
  const selected = fitting.find((j) => j.id === (jobId ?? fitting[0]?.id));

  if (!worker) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl font-extrabold">Worker not found</p>
        <ButtonLink href="/employer/workers" variant="outline" className="mt-4">
          Back to workers
        </ButtonLink>
      </div>
    );
  }

  const agreement = selected
    ? state.agreements.find((a) => a.jobId === selected.id && a.workerId === worker.id && a.status !== "declined")
    : undefined;
  const first = worker.name.split(" ")[0];
  const days = worker.id === MAIN_WORKER_ID ? khataDays(state) : worker.daysLogged;

  return (
    <div className="space-y-6">
      <Link href="/employer/workers" className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-2 font-bold hover:bg-sand">
        <ArrowLeft className="size-4" aria-hidden="true" /> All workers
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-5">
          <KaamCard worker={worker} lang="en" daysLogged={days} />
          <div className="flex flex-wrap gap-1.5">
            <Tag tone={worker.availableToday ? "leaf" : "sand"}>{worker.availableToday ? "Free today" : "Not free today"}</Tag>
            {worker.phone === "feature" ? (
              <Tag tone="sky" icon={<MessageSquareText className="size-3.5" aria-hidden="true" />}>
                Gets offers by SMS
              </Tag>
            ) : null}
            {worker.helpedBy ? <Tag tone="sky">Helped by {worker.helpedBy} (Naka Saathi)</Tag> : null}
          </div>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="offer" className="rounded-[1.6rem] border-2 border-ink bg-white p-5 shadow-pop">
            <h1 id="offer" className="font-display text-[1.8rem] leading-tight font-extrabold">
              Offer work to {first}
            </h1>
            {fitting.length === 0 ? (
              <div className="mt-3 space-y-3">
                <p className="text-muted">
                  You have no {TRADES[worker.trade].work.en.toLowerCase()} posted yet. Post it once — {first} and others get it in their own language
                  {worker.phone === "feature" ? ", and by SMS" : ""}.
                </p>
                <ButtonLink href={`/employer/post?trade=${worker.trade}`} size="lg">
                  Post {TRADES[worker.trade].work.en.toLowerCase()}
                </ButtonLink>
              </div>
            ) : (
              <>
                <fieldset className="mt-4">
                  <legend className="mb-2 font-bold text-muted">Which job?</legend>
                  <div className="grid gap-2">
                    {fitting.map((j) => {
                      const on = selected?.id === j.id;
                      return (
                        <label
                          key={j.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition-colors ${on ? "border-ink bg-marigold-soft" : "border-line hover:border-ink/40"}`}
                        >
                          <input type="radio" name="job" className="size-5 accent-[#161a3d]" checked={on} onChange={() => setJobId(j.id)} />
                          <TradeIcon trade={j.trade} className="size-8" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold">
                              {TRADES[j.trade].work.en} · {AREAS[j.area].name.en}
                            </span>
                            <span className="block text-sm text-muted">
                              {money(j.pay)} {translate("en", UNIT_KEY[j.unit])} · {hoursRange(j.startHour, j.endHour, "en")}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {selected ? (
                  <div className="mt-4 rounded-2xl bg-paper px-4">
                    <AgreementTerms job={selected} lang="en" />
                  </div>
                ) : null}

                <AnimatePresence mode="wait">
                  {agreement ? (
                    <motion.div
                      key={agreement.status}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-ink bg-ink p-4 text-paper on-dark"
                      role="status"
                    >
                      {agreement.status === "offered" || agreement.status === "requested" ? (
                        <Hourglass className="size-7 shrink-0 text-marigold" aria-hidden="true" />
                      ) : (
                        <CircleCheck className="size-7 shrink-0 text-[#3ddc84]" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-display text-lg font-extrabold">
                          {agreement.status === "offered"
                            ? `Offer sent — waiting for ${first}`
                            : agreement.status === "requested"
                              ? `${first} asked for this work — confirm on your dashboard`
                              : agreement.status === "agreed"
                                ? `Pakka! ${first} accepted`
                                : agreement.status === "paid"
                                  ? "Paid and closed"
                                  : "In progress"}
                        </p>
                        <p className="text-sm text-paper/75">
                          Agreement {agreement.code}
                          {agreement.via === "sms" ? " · sent by SMS" : " · sent to the Naka app"}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                      <Button size="lg" onClick={() => selected && offerJob(selected.id, worker.id)} disabled={!selected}>
                        <Send className="size-5" aria-hidden="true" />
                        Send offer{worker.phone === "feature" ? " by SMS" : ""}
                      </Button>
                      <Button variant="outline" size="lg" aria-label={`Call ${first}`} title="Masked call — numbers stay private">
                        <Phone className="size-5" aria-hidden="true" />
                        Call
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!worker.availableToday ? (
                  <Notice tone="alert" className="mt-3">
                    {first} marked “not free today”. You can still send an offer for a later date.
                  </Notice>
                ) : null}
              </>
            )}
          </section>

          {worker.vouches.length ? (
            <section aria-labelledby="vouches" className="space-y-3">
              <h2 id="vouches" className="font-display text-2xl font-extrabold">
                People who vouch for {first}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {worker.vouches.map((v) => (
                  <Card key={v.by} className="p-4">
                    <Quote className="size-5 text-marigold-deep" aria-hidden="true" />
                    <blockquote className="mt-1 leading-snug">{v.quote.en}</blockquote>
                    <p className="mt-2 font-extrabold">{v.by}</p>
                    <p className="text-sm text-muted">
                      {v.role.en} · known {v.known.en}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {worker.id === MAIN_WORKER_ID ? (
            <section aria-labelledby="work" className="space-y-3">
              <h2 id="work" className="font-display text-2xl font-extrabold">
                {first}&apos;s work
              </h2>
              <BeforeAfter />
              <WorkTiles />
            </section>
          ) : null}

          {worker.skills.length ? (
            <section aria-labelledby="skills" className="space-y-3">
              <h2 id="skills" className="font-display text-2xl font-extrabold">
                Skills
              </h2>
              <ul className="flex flex-wrap gap-2">
                {worker.skills.map((s) => (
                  <li key={s.en} className="rounded-full border-2 border-ink bg-marigold-soft px-3.5 py-1.5 font-bold">
                    {s.en}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
