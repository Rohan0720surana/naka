"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, MessageSquareText, Minus, Plus, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { TradeGrid } from "@/components/TradeGrid";
import { FairMeter, SafetyChecks } from "@/components/worker/JobBits";
import { JobCard } from "@/components/worker/JobCard";
import { Button, ButtonLink, Card, Chip, Notice } from "@/components/ui/primitives";
import { DEMO_EMPLOYER_ID, EMPLOYERS } from "@/lib/data/jobs";
import { AREAS, FROM_NAKA, POSTABLE_AREAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { SMS_WORKER_ID } from "@/lib/data/workers";
import { hourLabel, PROVIDED_KEY, PROVIDED_ORDER } from "@/lib/format";
import { LangContext } from "@/lib/hooks";
import { LANGS, translate } from "@/lib/i18n";
import { assess } from "@/lib/risk";
import { allWorkers, findWorker, useDemo, type PostJobInput } from "@/lib/store";
import type { Job, Lang, PayMode, PayTiming, PayUnit, TradeId } from "@/lib/types";
import { cn } from "@/lib/utils";

type Duration = "one" | "few" | "monthly";

const STEPS = ["What work?", "When & where?", "Pay & what you give"];

export function PostWork({ initialTrade }: { initialTrade?: TradeId }) {
  const postJob = useDemo((s) => s.postJob);
  const state = useDemo();

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState<TradeId>(initialTrade ?? "painter");
  const [workers, setWorkers] = useState(1);
  const [note, setNote] = useState("");
  const [startsIn, setStartsIn] = useState<0 | 1 | 2>(1);
  const [duration, setDuration] = useState<Duration>("few");
  const [days, setDays] = useState(2);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(18);
  const [area, setArea] = useState<Job["area"]>("powai");
  const [landmark, setLandmark] = useState("Hiranandani Gardens, Tower 4");
  const [unit, setUnit] = useState<PayUnit>("day");
  const [pay, setPay] = useState(900);
  const [payTiming, setPayTiming] = useState<PayTiming | null>(null);
  const [payMode, setPayMode] = useState<PayMode>("upi");
  const [provided, setProvided] = useState<Job["provided"]>(["materials", "lunch", "tea"]);
  const [previewLang, setPreviewLang] = useState<Lang>("hi");
  const [posted, setPosted] = useState<Job | null>(null);

  const effectiveUnit: PayUnit = duration === "monthly" ? "month" : unit === "month" ? "day" : unit;
  const draft: Job = useMemo(() => {
    const travel = FROM_NAKA[area] ?? { km: 5, mode: "bus" as const, minutes: 25 };
    return {
      id: "draft",
      trade,
      employerId: DEMO_EMPLOYER_ID,
      area,
      landmark: landmark || AREAS[area].name.en,
      pin: AREAS[area].pin,
      km: travel.km,
      travel: { mode: travel.mode, minutes: travel.minutes },
      pay,
      unit: effectiveUnit,
      startHour,
      endHour,
      days: duration === "one" ? 1 : duration === "few" ? days : 26,
      span: duration === "monthly" ? "long-term" : startsIn === 0 && duration === "one" ? "today" : "few-days",
      startsIn,
      workers,
      provided,
      payTiming: payTiming ?? "unclear",
      payMode,
      note: note ? { en: note, hi: note, mr: note } : undefined,
      postedMinutesAgo: 0,
      live: true,
    };
  }, [trade, area, landmark, pay, effectiveUnit, startHour, endHour, duration, days, startsIn, workers, provided, payTiming, payMode, note]);

  const pickShort = (d: Duration) => {
    if (duration === "monthly") setPay(Math.round((TRADES[trade].fairDay[0] + TRADES[trade].fairDay[1]) / 2 / 50) * 50);
    setDuration(d);
  };

  const a = assess(draft, EMPLOYERS[DEMO_EMPLOYER_ID]);
  const canNext = step === 0 ? true : step === 1 ? endHour > startHour && landmark.trim().length > 2 : pay > 0 && !!payTiming;
  const blocked = a.level === "danger";

  if (posted) {
    const reach = allWorkers(state).filter((w) => w.trade === posted.trade && w.availableToday);
    const arjun = findWorker(state, SMS_WORKER_ID);
    const sms = posted.trade === arjun?.trade && arjun.availableToday ? 1 : 0;
    return (
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto max-w-xl py-6 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, delay: 0.1 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-ink bg-leaf text-white"
        >
          <Send className="size-9" aria-hidden="true" />
        </motion.span>
        <h1 className="mt-5 font-display text-[2.2rem] leading-tight font-extrabold">Your work is live</h1>
        <p className="mt-2 text-lg text-muted">
          Sent to <strong className="text-ink">{reach.length + 12} {TRADES[posted.trade].label.en.toLowerCase()}s</strong> near{" "}
          {AREAS[posted.area].name.en}, in Hindi, Marathi and English.
          {sms ? (
            <>
              {" "}
              <strong className="text-ink">{sms} worker</strong> without a smartphone got it by SMS.
            </>
          ) : null}
        </p>
        <div className="mx-auto mt-6 max-w-sm text-left">
          <LangContext.Provider value="hi">
            <JobCard job={posted} preview />
          </LangContext.Provider>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ButtonLink href={`/employer/workers?trade=${posted.trade}`} size="lg">
            Find {TRADES[posted.trade].label.en.toLowerCase()}s now
          </ButtonLink>
          <ButtonLink href="/employer" variant="outline" size="lg">
            Go to dashboard
          </ButtonLink>
        </div>
        <button type="button" onClick={() => { setPosted(null); setStep(0); }} className="mt-4 font-bold underline underline-offset-4">
          Post another job
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div>
        <Link href="/employer" className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-2 font-bold hover:bg-sand">
          <ArrowLeft className="size-4" aria-hidden="true" /> Dashboard
        </Link>
        <h1 className="mt-2 font-display text-[2.2rem] leading-tight font-extrabold">Post work</h1>
        <p className="text-muted">Three short steps. Workers see exactly what you write — nothing is left to “we&apos;ll discuss”.</p>

        <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "w-full rounded-2xl border-2 p-3 text-left transition-colors",
                  i === step ? "border-ink bg-marigold" : i < step ? "border-leaf/40 bg-leaf-soft" : "border-line bg-white",
                )}
              >
                <span className="block text-xs font-extrabold tracking-wider text-ink/60 uppercase">Step {i + 1}</span>
                <span className="block font-bold leading-tight">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.12 } }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-6"
          >
            {step === 0 ? (
              <>
                <Field label="What kind of work?">
                  <TradeGrid value={trade} onChange={setTrade} lang="en" cols={4} />
                </Field>
                <Field label="How many workers?">
                  <Stepper value={workers} min={1} max={20} onChange={setWorkers} suffix={workers === 1 ? "worker" : "workers"} />
                </Field>
                <Field label="Describe the work in one line" hint="Optional. Keep it simple — it is read aloud to workers.">
                  <input
                    value={note}
                    maxLength={120}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Two bedrooms, light colours. Paint is ready at home."
                    className="h-13 w-full rounded-2xl border-2 border-ink/20 bg-white px-4 py-3 font-bold outline-none focus:border-ink"
                  />
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field label="When does it start?">
                  <div className="flex flex-wrap gap-2">
                    {(["Today", "Tomorrow", "Day after"] as const).map((l, i) => (
                      <Chip key={l} selected={startsIn === i} onClick={() => setStartsIn(i as 0 | 1 | 2)}>
                        {l}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="How long?">
                  <div className="flex flex-wrap gap-2">
                    <Chip selected={duration === "one"} onClick={() => pickShort("one")}>One day</Chip>
                    <Chip selected={duration === "few"} onClick={() => pickShort("few")}>A few days</Chip>
                    <Chip selected={duration === "monthly"} onClick={() => { setDuration("monthly"); setPay(Math.round(TRADES[trade].fairDay[1] * 19.5 / 500) * 500); }}>
                      Monthly job
                    </Chip>
                  </div>
                  {duration === "few" ? (
                    <div className="mt-3">
                      <Stepper value={days} min={2} max={30} onChange={setDays} suffix="days" />
                    </div>
                  ) : null}
                </Field>
                <Field label="Working hours">
                  <div className="grid grid-cols-2 gap-3">
                    <HourSelect
                      label="Start"
                      value={startHour}
                      onChange={(h) => {
                        setStartHour(h);
                        if (endHour < h + 2) setEndHour(h + 2);
                      }}
                      from={6}
                      to={14}
                    />
                    <HourSelect label="End" value={endHour} onChange={setEndHour} from={startHour + 2} to={22} />
                  </div>
                  <p className="mt-2 text-sm font-bold text-muted">{endHour - startHour} hours a day</p>
                </Field>
                <Field label="Where?">
                  <div className="flex flex-wrap gap-2">
                    {POSTABLE_AREAS.map((id) => (
                      <Chip key={id} selected={area === id} onClick={() => setArea(id)}>
                        {AREAS[id].name.en}
                      </Chip>
                    ))}
                  </div>
                  <input
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    aria-label="Exact place or landmark"
                    placeholder="Building, landmark"
                    className="mt-3 h-13 w-full rounded-2xl border-2 border-ink/20 bg-white px-4 py-3 font-bold outline-none focus:border-ink"
                  />
                  <p className="mt-2 text-sm text-muted">An exact place keeps the “Exact place is given” check green.</p>
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Field label="Pay">
                  {duration !== "monthly" ? (
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Chip selected={effectiveUnit === "day"} onClick={() => setUnit("day")}>Per day</Chip>
                      <Chip selected={effectiveUnit === "job"} onClick={() => setUnit("job")}>For the whole job</Chip>
                    </div>
                  ) : null}
                  <label className="flex h-16 items-center gap-2 rounded-2xl border-2 border-ink bg-white px-4">
                    <span className="font-display text-2xl font-extrabold">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={pay}
                      onChange={(e) => setPay(Number(e.target.value) || 0)}
                      aria-label="Pay amount in rupees"
                      className="w-full bg-transparent font-display text-2xl font-extrabold outline-none"
                    />
                    <span className="shrink-0 font-bold text-muted">
                      {effectiveUnit === "day" ? "/ day" : effectiveUnit === "month" ? "/ month" : "for the job"}
                    </span>
                  </label>
                  <Card className="mt-3 p-4">
                    <LangContext.Provider value="en">
                      <FairMeter job={draft} fair={a.fair} />
                    </LangContext.Provider>
                  </Card>
                </Field>
                <Field label="When will you pay?" hint="Required — the most common reason workers distrust a job is an unclear pay day.">
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["same-day", "Same day"],
                      ["weekly", "Every week"],
                      ["monthly", "Every month"],
                    ] as const).map(([id, l]) => (
                      <Chip key={id} selected={payTiming === id} onClick={() => setPayTiming(id)}>
                        {l}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="How will you pay?">
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["upi", "UPI"],
                      ["cash", "Cash"],
                      ["bank", "Bank transfer"],
                    ] as const).map(([id, l]) => (
                      <Chip key={id} selected={payMode === id} onClick={() => setPayMode(id)}>
                        {l}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="What will you give at the site?">
                  <div className="flex flex-wrap gap-2">
                    {PROVIDED_ORDER.map((p) => {
                      const on = provided.includes(p);
                      return (
                        <Chip
                          key={p}
                          selected={on}
                          onClick={() => setProvided(on ? provided.filter((x) => x !== p) : [...provided, p])}
                        >
                          {on ? <CircleCheck className="size-4" aria-hidden="true" /> : null}
                          {translate("en", PROVIDED_KEY[p])}
                        </Chip>
                      );
                    })}
                  </div>
                </Field>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="size-5" aria-hidden="true" /> Back
            </Button>
          ) : null}
          {step < 2 ? (
            <Button size="lg" onClick={() => setStep(step + 1)} disabled={!canNext}>
              Next <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={!canNext || blocked}
              onClick={() => {
                const input: PostJobInput = {
                  trade,
                  area,
                  landmark,
                  pay,
                  unit: effectiveUnit,
                  startHour,
                  endHour,
                  days: draft.days,
                  span: draft.span,
                  startsIn,
                  workers,
                  provided,
                  payTiming: payTiming!,
                  payMode,
                  note: note || undefined,
                };
                setPosted(postJob(input));
              }}
            >
              <Sparkles className="size-5" aria-hidden="true" />
              Publish to workers
            </Button>
          )}
          {step === 2 && !payTiming ? <span className="text-sm font-bold text-alert">Choose when you will pay</span> : null}
        </div>
        {blocked ? (
          <Notice tone="alert" className="mt-4">
            This listing would be flagged as a likely scam, so it can&apos;t be published. Check the pay amount.
          </Notice>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Live preview">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between gap-2 border-b-2 border-ink/10 bg-ink px-4 py-3 text-paper on-dark">
            <span className="flex items-center gap-2 font-bold">
              <MessageSquareText className="size-4 text-marigold" aria-hidden="true" />
              How workers see it
            </span>
            <div className="flex rounded-full bg-white/10 p-0.5" role="group" aria-label="Preview language">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  lang={l.id}
                  onClick={() => setPreviewLang(l.id)}
                  aria-pressed={previewLang === l.id}
                  className={cn(
                    "h-8 rounded-full px-2.5 text-sm font-bold",
                    previewLang === l.id ? "bg-marigold text-ink" : "text-paper/80 hover:text-paper",
                  )}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-paper p-4">
            <LangContext.Provider value={previewLang}>
              <div lang={previewLang}>
                <JobCard job={draft} preview />
              </div>
            </LangContext.Provider>
          </div>
          <div className="border-t-2 border-ink/10 p-4">
            <p className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold">
              <ShieldCheck className="size-5" aria-hidden="true" />
              Safety check on your listing
            </p>
            <LangContext.Provider value="en">
              <SafetyChecks a={a} />
            </LangContext.Provider>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-extrabold">{label}</legend>
      {hint ? <p className="mb-3 text-sm text-muted">{hint}</p> : <div className="mb-3" />}
      {children}
    </fieldset>
  );
}

function Stepper({ value, min, max, onChange, suffix }: { value: number; min: number; max: number; onChange: (n: number) => void; suffix: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-ink/15 bg-white p-1.5">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="inline-flex size-11 items-center justify-center rounded-xl bg-sand" aria-label="Fewer">
        <Minus className="size-5" aria-hidden="true" />
      </button>
      <span className="min-w-24 text-center font-display text-xl font-extrabold" aria-live="polite">
        {value} <span className="text-base text-muted">{suffix}</span>
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="inline-flex size-11 items-center justify-center rounded-xl bg-sand" aria-label="More">
        <Plus className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}

function HourSelect({ label, value, onChange, from, to }: { label: string; value: number; onChange: (n: number) => void; from: number; to: number }) {
  const hours = Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-13 w-full rounded-2xl border-2 border-ink/20 bg-white px-3 py-3 font-bold outline-none focus:border-ink"
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {hourLabel(h, "en")}
          </option>
        ))}
      </select>
    </label>
  );
}
