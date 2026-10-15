"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, CirclePlus, FileCheck2, Scale, Search, ShieldCheck, Users } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AgreementRow } from "@/components/employer/AgreementRow";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { ButtonLink, Card, Tag } from "@/components/ui/primitives";
import { DEMO_EMPLOYER_ID } from "@/lib/data/jobs";
import { AREAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { hoursRange, money, TIMING_KEY, UNIT_KEY } from "@/lib/format";
import { translate } from "@/lib/i18n";
import { allJobs, allWorkers, useDemo } from "@/lib/store";

export default function EmployerDashboard() {
  const state = useDemo();
  const myAgreements = state.agreements.filter((a) => a.employerId === DEMO_EMPLOYER_ID);
  const myJobs = allJobs(state).filter((j) => j.employerId === DEMO_EMPLOYER_ID);
  const freeNow = allWorkers(state).filter((w) => w.availableToday).length;
  const pakka = myAgreements.filter((a) => ["agreed", "done", "paid"].includes(a.status)).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-muted">{greeting}, Priya</p>
          <h1 className="mt-1 max-w-2xl font-display text-[2.1rem] leading-[1.1] font-extrabold sm:text-[2.6rem]">
            Hire people you can trust, on terms everyone understands.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/employer/post" size="lg">
            <CirclePlus className="size-5" aria-hidden="true" />
            Post work
          </ButtonLink>
          <ButtonLink href="/employer/workers" variant="outline" size="lg">
            <Search className="size-5" aria-hidden="true" />
            Find workers
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Today at a glance">
        <Stat icon={<Users className="size-6" aria-hidden="true" />} value={freeNow + 31} label="Workers free near Powai today" />
        <Stat icon={<FileCheck2 className="size-6" aria-hidden="true" />} value={myJobs.length} label="Your open jobs" />
        <Stat icon={<Scale className="size-6" aria-hidden="true" />} value={pakka} label="Pakka agreements" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <section aria-labelledby="requests" className="space-y-3">
          <h2 id="requests" className="font-display text-2xl font-extrabold">
            Requests &amp; agreements
          </h2>
          {myAgreements.length === 0 ? (
            <Card className="p-6">
              <p className="font-display text-lg font-extrabold">No requests yet</p>
              <p className="mt-1 text-muted">
                Post work or send an offer. When a worker says yes, the pakka agreement appears here — the same one they see on their phone.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {myAgreements.map((a) => (
                <AgreementRow key={a.id} a={a} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="jobs" className="space-y-3">
            <h2 id="jobs" className="font-display text-2xl font-extrabold">
              Your jobs
            </h2>
            <ul className="space-y-3">
              {myJobs.map((j) => {
                const asks = state.agreements.filter((a) => a.jobId === j.id && a.status !== "declined").length;
                return (
                  <li key={j.id}>
                    <Card className="flex items-start gap-3 p-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sand">
                        <TradeIcon trade={j.trade} className="size-9" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-tight font-extrabold">{TRADES[j.trade].work.en}</p>
                        <p className="text-sm text-muted">
                          {AREAS[j.area].name.en} · {hoursRange(j.startHour, j.endHour, "en")}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Tag tone="marigold">
                            {money(j.pay)} {translate("en", UNIT_KEY[j.unit])}
                          </Tag>
                          <Tag tone="leaf">{translate("en", TIMING_KEY[j.payTiming])}</Tag>
                          {j.live ? <Tag tone="ink">Live now</Tag> : null}
                          <Tag>{asks} interested</Tag>
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
            <Link href="/employer/post" className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
              Post more work <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>

          <Card className="bg-ink p-5 text-paper on-dark">
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold">
              <ShieldCheck className="size-6 text-marigold" aria-hidden="true" />
              Why listings on RozGhar are clear
            </h2>
            <ul className="mt-3 space-y-2.5 text-[0.95rem] text-paper/85">
              {[
                "Pay, hours and pay day are required — no “we'll discuss”.",
                "Workers see your listing in their language, and can hear it read aloud.",
                "Every hire becomes a pakka agreement both sides keep.",
                "Your number stays private: calls are connected through RozGhar.",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-marigold" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-marigold">{icon}</span>
      <div>
        <NumberTicker value={value} className="font-display text-[2rem] leading-none font-extrabold text-ink" />
        <p className="mt-1 text-sm font-bold text-muted">{label}</p>
      </div>
    </Card>
  );
}
