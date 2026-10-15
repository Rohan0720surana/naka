"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  CircleCheck,
  Circle,
  CreditCard,
  HandCoins,
  HardHat,
  HeartPulse,
  IdCard,
  Navigation,
  Phone,
  PiggyBank,
  RotateCcw,
  Sparkles,
  Umbrella,
  Wheat,
} from "lucide-react";
import { useState } from "react";
import { AreaMap } from "@/components/AreaMap";
import { Sheet } from "@/components/Sheet";
import { SpeakButton } from "@/components/SpeakButton";
import { Button, Card, Notice, SectionTitle, Tag } from "@/components/ui/primitives";
import { DOCS, HELP_CENTRES, HELPLINES, SCHEMES, type DocId, type Scheme } from "@/lib/data/schemes";
import { useT } from "@/lib/hooks";
import type { TKey } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import type { EligibilityAnswers } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<Scheme["kind"], typeof IdCard> = {
  id: IdCard,
  pension: PiggyBank,
  welfare: HardHat,
  health: HeartPulse,
  insurance: Umbrella,
  loan: HandCoins,
  ration: Wheat,
  bank: CreditCard,
};

type Q = { key: TKey; field: keyof EligibilityAnswers; options: { value: string; key: TKey }[] };

const QUESTIONS: Q[] = [
  { key: "q1", field: "age", options: [{ value: "18-40", key: "age1" }, { value: "41-59", key: "age2" }, { value: "60+", key: "age3" }] },
  {
    key: "q2",
    field: "work",
    options: [
      { value: "construction", key: "aConstruction" },
      { value: "vending", key: "aVending" },
      { value: "household", key: "aHousehold" },
      { value: "other", key: "aOther" },
    ],
  },
  { key: "q3", field: "income", options: [{ value: "under-15k", key: "aUnder15" }, { value: "over-15k", key: "aOver15" }] },
  { key: "q4", field: "bank", options: [{ value: "yes", key: "yes" }, { value: "no", key: "no" }] },
];

export default function HaqPage() {
  const { t, p, lang } = useT();
  const eligibility = useDemo((s) => s.eligibility);
  const docsHave = useDemo((s) => s.docsHave);
  const toggleDoc = useDemo((s) => s.toggleDoc);
  const [open, setOpen] = useState<Scheme | null>(null);

  const matched = eligibility
    ? SCHEMES.map((s) => ({ s, why: s.fits(eligibility) })).filter((x): x is { s: Scheme; why: NonNullable<ReturnType<Scheme["fits"]>> } => !!x.why)
    : [];
  const docIds = Object.keys(DOCS) as DocId[];

  return (
    <div className="space-y-7 pt-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.75rem] leading-tight font-extrabold">{t("haqTitle")}</h1>
          <p className="text-muted">{t("haqSub")}</p>
        </div>
        <SpeakButton text={`${t("haqTitle")}. ${t("haqSub")}`} compact />
      </header>

      <EligibilityCheck onOpen={setOpen} matched={matched} />

      <section className="space-y-3" aria-labelledby="all-schemes">
        <SectionTitle id="all-schemes">{t("allSchemes")}</SectionTitle>
        <ul className="space-y-2.5">
          {SCHEMES.map((s) => (
            <li key={s.id}>
              <SchemeRow scheme={s} onOpen={() => setOpen(s)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="papers">
        <SectionTitle
          id="papers"
          action={<Tag tone="leaf">{t("papersCount", { a: docsHave.length, b: docIds.length })}</Tag>}
        >
          {t("myPapers")}
        </SectionTitle>
        <ul className="grid gap-2">
          {docIds.map((d) => {
            const have = docsHave.includes(d);
            return (
              <li key={d}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={have}
                  onClick={() => toggleDoc(d)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors",
                    have ? "border-leaf/40 bg-leaf-soft" : "border-line bg-white hover:border-ink/30",
                  )}
                >
                  {have ? (
                    <CircleCheck className="size-7 shrink-0 text-leaf" aria-hidden="true" />
                  ) : (
                    <Circle className="size-7 shrink-0 text-line" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-bold">{p(DOCS[d].name)}</span>
                    <span className="block text-[0.85rem] leading-snug text-muted">{p(DOCS[d].hint)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="help" className="scroll-mt-24 space-y-3" aria-labelledby="help-title">
        <SectionTitle id="help-title">{t("helpNear")}</SectionTitle>
        <AreaMap
          lang={lang}
          label={t("helpNear")}
          className="aspect-[16/10]"
          pins={[
            { id: "me", x: 48, y: 52, kind: "me", label: "★" },
            ...HELP_CENTRES.map((c, i) => ({ id: c.id, x: c.pin.x, y: c.pin.y, kind: "help" as const, label: String(i + 1) })),
          ]}
        />
        <ul className="space-y-2.5">
          {HELP_CENTRES.map((c, i) => (
            <li key={c.id}>
              <Card className="flex items-start gap-3 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky font-extrabold text-white">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-snug">{p(c.name)}</p>
                  <p className="text-[0.9rem] text-muted">{p(c.does)}</p>
                  <p className="mt-1 text-[0.85rem] font-bold">
                    {c.km} km · {p(c.hours)}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(c.name.en + " Mumbai")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white"
                  aria-label={`${t("directions")}: ${p(c.name)}`}
                >
                  <Navigation className="size-5" aria-hidden="true" />
                </a>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="helplines">
        <SectionTitle id="helplines">{t("helplines")}</SectionTitle>
        <ul className="grid grid-cols-2 gap-2.5">
          {HELPLINES.map((h) => (
            <li key={h.number}>
              <a
                href={`tel:${h.number}`}
                className="flex h-full flex-col gap-1 rounded-[1.2rem] border-2 border-ink bg-white p-3.5 transition-colors hover:bg-marigold-soft"
              >
                <span className="flex items-center gap-2 font-display text-[1.6rem] leading-none font-extrabold tabular">
                  <Phone className="size-5 text-leaf" aria-hidden="true" />
                  {h.number}
                </span>
                <span className="text-[0.9rem] leading-tight font-bold">{p(h.name)}</span>
                <span className="text-[0.8rem] leading-tight text-muted">{p(h.for)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="problem" className="scroll-mt-24" aria-labelledby="problem-title">
        <Card className="overflow-hidden border-ink p-0">
          <div className="h-3 hatch-marigold" aria-hidden="true" />
          <div className="p-4">
            <h2 id="problem-title" className="font-display text-xl leading-tight font-extrabold">
              {t("problemTitle")}
            </h2>
            <ol className="mt-3 space-y-3">
              {(["problem1", "problem2", "problem3"] as const).map((k, i) => (
                <li key={k} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-extrabold text-paper">{i + 1}</span>
                  <span className="pt-1 leading-snug">{t(k)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="tel:15100" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-marigold font-bold btn-sign">
                <Phone className="size-5" aria-hidden="true" /> 15100
              </a>
              <a href="tel:112" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-danger font-bold text-white btn-sign">
                <Phone className="size-5" aria-hidden="true" /> 112
              </a>
            </div>
          </div>
        </Card>
      </section>

      <Notice tone="sky">{t("schemeNote")}</Notice>

      <SchemeSheet scheme={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function EligibilityCheck({
  onOpen,
  matched,
}: {
  onOpen: (s: Scheme) => void;
  matched: { s: Scheme; why: { en: string; hi: string; mr: string } }[];
}) {
  const { t, p } = useT();
  const eligibility = useDemo((s) => s.eligibility);
  const setEligibility = useDemo((s) => s.setEligibility);
  const [step, setStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Partial<EligibilityAnswers>>({});

  if (eligibility && step === null) {
    return (
      <section aria-labelledby="results" className="space-y-3">
        <div className="rounded-[1.6rem] border-2 border-ink bg-leaf p-5 text-white on-dark">
          <Sparkles className="size-7 text-marigold" aria-hidden="true" />
          <h2 id="results" className="mt-2 font-display text-[1.5rem] leading-tight font-extrabold">
            {t("resultsTitle", { n: matched.length })}
          </h2>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setStep(0);
              setEligibility(null);
            }}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-3 font-bold hover:bg-white/25"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t("redo")}
          </button>
        </div>
        <ul className="space-y-2.5">
          {matched.map(({ s, why }, i) => (
            <motion.li key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <SchemeRow scheme={s} onOpen={() => onOpen(s)} why={p(why)} />
            </motion.li>
          ))}
        </ul>
      </section>
    );
  }

  if (step === null) {
    return (
      <section className="relative overflow-hidden rounded-[1.6rem] border-2 border-ink bg-marigold p-5">
        <div className="absolute -top-6 -right-6 size-28 rounded-full border-[14px] border-ink/10" aria-hidden="true" />
        <h2 className="relative font-display text-[1.45rem] leading-tight font-extrabold">{t("checkTitle")}</h2>
        <ul className="relative mt-3 flex gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="h-2 flex-1 rounded-full bg-ink/20" />
          ))}
        </ul>
        <Button variant="ink" size="lg" className="relative mt-4 w-full" onClick={() => setStep(0)}>
          {t("start")}
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </section>
    );
  }

  const q = QUESTIONS[step]!;
  return (
    <section className="rounded-[1.6rem] border-2 border-ink bg-white p-5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {QUESTIONS.map((_, i) => (
          <span key={i} className={cn("h-2 flex-1 rounded-full transition-colors", i <= step ? "bg-marigold" : "bg-sand")} />
        ))}
      </div>
      <p className="mt-3 text-sm font-bold text-muted">{t("obStep", { a: step + 1, b: QUESTIONS.length })}</p>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-[1.35rem] leading-tight font-extrabold">{t(q.key)}</h2>
            <SpeakButton text={[t(q.key), ...q.options.map((o) => t(o.key))].join(". ")} compact />
          </div>
          <div className="mt-4 grid gap-2">
            {q.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  const next = { ...answers, [q.field]: o.value } as Partial<EligibilityAnswers>;
                  setAnswers(next);
                  if (step < QUESTIONS.length - 1) setStep(step + 1);
                  else {
                    setEligibility(next as EligibilityAnswers);
                    setStep(null);
                  }
                }}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 text-left text-[1.05rem] font-bold transition-colors hover:border-ink hover:bg-marigold-soft"
              >
                {t(o.key)}
                <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="mt-3 h-11 font-bold text-muted underline underline-offset-4">
              {t("back")}
            </button>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function SchemeRow({ scheme, onOpen, why }: { scheme: Scheme; onOpen: () => void; why?: string }) {
  const { t, p } = useT();
  const saved = useDemo((s) => s.savedSchemes.includes(scheme.id));
  const Icon = KIND_ICON[scheme.kind];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[1.3rem] border-2 border-ink/10 bg-white p-3.5 text-left shadow-card transition-transform hover:-translate-y-0.5"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-soft text-sky">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[1.05rem] leading-tight font-extrabold">{p(scheme.name)}</span>
        <span className="mt-0.5 block text-[0.9rem] leading-snug text-muted">{p(scheme.short)}</span>
        {why ? (
          <span className="mt-1.5 block rounded-lg bg-leaf-soft px-2 py-1 text-[0.82rem] leading-snug font-bold text-leaf">
            {t("whyYou")}: {why}
          </span>
        ) : null}
      </span>
      {saved ? <BookmarkCheck className="size-5 shrink-0 text-leaf" aria-label={t("saved")} /> : null}
      <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
    </button>
  );
}

function SchemeSheet({ scheme, onClose }: { scheme: Scheme | null; onClose: () => void }) {
  const { t, p } = useT();
  const saved = useDemo((s) => (scheme ? s.savedSchemes.includes(scheme.id) : false));
  const docsHave = useDemo((s) => s.docsHave);
  const toggleScheme = useDemo((s) => s.toggleScheme);
  if (!scheme) return <Sheet open={false} onClose={onClose} title="">{null}</Sheet>;
  const Icon = KIND_ICON[scheme.kind];
  const spoken = [p(scheme.name), p(scheme.short), `${t("whoCan")}: ${p(scheme.who)}`, `${t("whatYouGet")}: ${p(scheme.get)}`, `${t("whereApply")}: ${p(scheme.where)}`].join(". ");
  return (
    <Sheet open={!!scheme} onClose={onClose} title={p(scheme.name)} closeLabel={t("close")}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-[1.2rem] bg-sky-soft p-4">
          <Icon className="size-9 shrink-0 text-sky" aria-hidden="true" />
          <p className="font-display text-lg leading-tight font-extrabold">{p(scheme.benefit)}</p>
        </div>
        <SpeakButton text={spoken} className="w-full" />
        {[
          { k: "whoCan" as const, v: p(scheme.who) },
          { k: "whatYouGet" as const, v: p(scheme.get) },
          { k: "whereApply" as const, v: p(scheme.where) },
        ].map((row) => (
          <div key={row.k}>
            <h3 className="text-[0.85rem] font-extrabold tracking-wide text-muted uppercase">{t(row.k)}</h3>
            <p className="mt-1 text-[1.02rem] leading-snug">{row.v}</p>
          </div>
        ))}
        <div>
          <h3 className="text-[0.85rem] font-extrabold tracking-wide text-muted uppercase">{t("papers")}</h3>
          <ul className="mt-2 space-y-1.5">
            {scheme.docs.map((d) => {
              const have = docsHave.includes(d);
              return (
                <li key={d} className="flex items-center gap-2 font-bold">
                  {have ? <CircleCheck className="size-5 text-leaf" aria-hidden="true" /> : <Circle className="size-5 text-alert" aria-hidden="true" />}
                  <span className={have ? "" : "text-alert"}>{p(DOCS[d].name)}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant={saved ? "leaf" : "primary"} onClick={() => toggleScheme(scheme.id)}>
            {saved ? <BookmarkCheck className="size-5" aria-hidden="true" /> : <Bookmark className="size-5" aria-hidden="true" />}
            {saved ? t("saved") : t("saveScheme")}
          </Button>
          {scheme.helpline ? (
            <a href={`tel:${scheme.helpline}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white font-bold btn-sign">
              <Phone className="size-5" aria-hidden="true" />
              {scheme.helpline}
            </a>
          ) : (
            <span />
          )}
        </div>
      </div>
    </Sheet>
  );
}
