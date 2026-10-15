"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  Ear,
  Hand,
  HardHat,
  Home,
  Landmark,
  Languages,
  MessageSquareText,
  Mic,
  MousePointerClick,
  Play,
  Scale,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import { useRef, type ReactNode } from "react";
import { LogoMark, Logo } from "@/components/brand/Logo";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ButtonLink, Card } from "@/components/ui/primitives";
import { FairMeter, HoursBar, SafetyChecks } from "@/components/worker/JobBits";
import { JobCard } from "@/components/worker/JobCard";
import { KaamCard } from "@/components/worker/KaamCard";
import { EMPLOYERS, SEED_JOBS } from "@/lib/data/jobs";
import { SCHEMES } from "@/lib/data/schemes";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import { SEED_WORKERS } from "@/lib/data/workers";
import { LangContext } from "@/lib/hooks";
import { assess } from "@/lib/risk";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={cn("text-sm font-extrabold tracking-[0.18em] uppercase", dark ? "text-marigold" : "text-marigold-deep")}>{children}</p>
  );
}

/* --------------------------------- marquee -------------------------------- */

export function TradeMarquee() {
  const phrases = [
    "No résumé needed",
    "पैसे का दिन तय",
    "Your documents stay with you",
    "ऐका तुमच्या भाषेत",
    "Pay shown before you go",
    "बोलकर बताइए",
    "Pakka agreement, both sides",
    "हक्क आणि मदत",
  ];
  return (
    <section aria-label="Trades and promises" className="border-y-2 border-ink bg-ink py-5 text-paper on-dark">
      <Marquee pauseOnHover className="[--duration:46s] [--gap:1.25rem]">
        {TRADE_ORDER.map((id) => (
          <span key={id} className="flex items-center gap-3 rounded-full border-2 border-white/15 bg-white/5 py-1.5 pr-5 pl-1.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-paper">
              <TradeIcon trade={id} className="size-8" />
            </span>
            <span className="font-display text-lg font-extrabold whitespace-nowrap">
              {TRADES[id].label.en} <span className="text-marigold">·</span> <span lang="hi">{TRADES[id].label.hi}</span>{" "}
              <span className="text-marigold">·</span> <span lang="mr">{TRADES[id].label.mr}</span>
            </span>
          </span>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="mt-2 [--duration:38s] [--gap:2rem]">
        {phrases.map((p) => (
          <span key={p} className="flex items-center gap-3 font-display text-xl font-extrabold whitespace-nowrap text-paper/70">
            <span className="size-2 rounded-full bg-marigold" aria-hidden="true" />
            {p}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* --------------------------------- problem -------------------------------- */

const PAINS = [
  { n: "01", title: "Work depends on luck", body: "Whether a family eats tonight depends on whether the right person stops at the naka this morning." },
  { n: "02", title: "Skill is invisible", body: "Twelve years of fine finishing work, and nothing to show for it — no résumé, no profile, no network." },
  { n: "03", title: "Terms are vague, scams are real", body: "“We'll see about pay.” Advance fees for jobs abroad. Aadhaar cards kept “for safety”. Wages that never arrive." },
  { n: "04", title: "Rights are out of reach", body: "Pensions, insurance and welfare boards exist — written in forms, English and offices few workers can reach." },
];

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="scroll-mt-20 bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow>6:30 AM · Ghatkopar naka</Eyebrow>
            <h2 id="problem-title" className="mt-3 font-display text-[2.4rem] leading-[1.05] font-extrabold sm:text-[3.2rem]">
              Every morning, a city&apos;s builders wait by the road to be chosen.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
              Plumbers, carpenters, painters, masons, sweepers and helpers stand with their tools at roadside hiring points. Years of
              skill, and no way to show it. The work is real — the system around it isn&apos;t.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="grid grid-cols-2 gap-3">
              <Stat value={90} suffix="%" label="of India's workers are in informal work (approx.)" />
              <Stat value={30} suffix=" crore+" label="unorganised workers registered on e-Shram" />
              <Stat value={0} suffix="" label="résumés needed to get work on Naka" dark className="col-span-2" />
            </dl>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((p, i) => (
            <li key={p.n}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="h-full rounded-[1.6rem] border-2 border-ink bg-white p-6 shadow-[0_6px_0_0_var(--color-ink)]">
                  <span className="font-display text-4xl font-extrabold text-marigold-deep">{p.n}</span>
                  <h3 className="mt-3 font-display text-xl leading-tight font-extrabold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{p.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label, dark, className }: { value: number; suffix: string; label: string; dark?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-[1.4rem] border-2 border-ink p-5", dark ? "bg-ink text-paper" : "bg-marigold", className)}>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="font-display text-[2.6rem] leading-none font-extrabold">
          <NumberTicker value={value} className={cn("tracking-tight", dark ? "text-marigold" : "text-ink")} />
          {suffix}
        </span>
        <span className={cn("mt-2 block text-[0.95rem] leading-snug font-bold", dark ? "text-paper/75" : "text-ink/75")}>{label}</span>
      </dd>
    </div>
  );
}

/* ------------------------------- how it works ------------------------------ */

const BEAM_BASE = { pathColor: "#161a3d", pathOpacity: 0.15, pathWidth: 3, duration: 4 };
const BEAM_IN = { ...BEAM_BASE, gradientStartColor: "#f5b014", gradientStopColor: "#c98200" };
const BEAM_OUT = { ...BEAM_BASE, gradientStartColor: "#137a3a", gradientStopColor: "#2456c9" };

export function HowItWorks() {
  const container = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const w1 = useRef<HTMLDivElement>(null);
  const w2 = useRef<HTMLDivElement>(null);
  const w3 = useRef<HTMLDivElement>(null);
  const e1 = useRef<HTMLDivElement>(null);
  const e2 = useRef<HTMLDivElement>(null);
  const e3 = useRef<HTMLDivElement>(null);

  const left = [
    { ref: w1, Icon: Smartphone, title: "Worker with a smartphone", sub: "App · voice · 3 languages" },
    { ref: w2, Icon: MessageSquareText, title: "Worker with a button phone", sub: "SMS in Hindi · reply 1 or 2" },
    { ref: w3, Icon: Users, title: "Naka Saathi", sub: "Registers & helps those with no phone" },
  ];
  const right = [
    { ref: e1, Icon: Home, title: "Households", sub: "Post work in 3 steps" },
    { ref: e2, Icon: Building2, title: "Contractors & companies", sub: "Find verified, vouched workers" },
    { ref: e3, Icon: Landmark, title: "Schemes & help centres", sub: "e-Shram, pension, welfare board" },
  ];

  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-20 border-y-2 border-ink bg-sand py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 id="how-title" className="mt-3 font-display text-[2.4rem] leading-[1.05] font-extrabold sm:text-[3.2rem]">
            The naka stays. Naka connects it to everyone else.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            Workers keep standing where they always stand. Naka makes that spot visible — to households, contractors and the
            government services meant for them.
          </p>
        </Reveal>

        <div ref={container} className="relative mt-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
          <div className="space-y-5">
            {left.map((n) => (
              <Node key={n.title} {...n} />
            ))}
          </div>
          <div ref={hub} className="relative z-10 flex size-24 items-center justify-center rounded-[1.8rem] border-2 border-ink bg-ink shadow-[0_8px_0_0_var(--color-marigold-deep)] sm:size-32">
            <LogoMark className="size-16 sm:size-20" />
          </div>
          <div className="space-y-5">
            {right.map((n) => (
              <Node key={n.title} {...n} alignRight />
            ))}
          </div>
          <AnimatedBeam containerRef={container} fromRef={w1} toRef={hub} curvature={40} {...BEAM_IN} delay={0} />
          <AnimatedBeam containerRef={container} fromRef={w2} toRef={hub} {...BEAM_IN} delay={0.5} />
          <AnimatedBeam containerRef={container} fromRef={w3} toRef={hub} curvature={-40} {...BEAM_IN} delay={1} />
          <AnimatedBeam containerRef={container} fromRef={hub} toRef={e1} curvature={40} {...BEAM_OUT} delay={1.5} />
          <AnimatedBeam containerRef={container} fromRef={hub} toRef={e2} {...BEAM_OUT} delay={2} />
          <AnimatedBeam containerRef={container} fromRef={hub} toRef={e3} curvature={-40} {...BEAM_OUT} delay={2.5} />
        </div>

        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { Icon: MousePointerClick, t: "Say “I'm free today”", b: "One big switch, or the Naka Saathi marks you present. Employers nearby can now see your Kaam Card." },
            { Icon: Ear, t: "Get clear work — and hear it", b: "Pay, hours, place and pay day, in your language. A safety check flags anything that looks like a scam." },
            { Icon: Scale, t: "Make it pakka, get paid, keep proof", b: "Both sides hold the same agreement. Payment is confirmed and every day lands in your Kamai Khata." },
          ].map(({ Icon, t, b }, i) => (
            <li key={t}>
              <Reveal delay={i * 0.1} className="h-full">
                <div className="flex h-full gap-4 rounded-[1.6rem] border-2 border-ink/15 bg-paper p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-marigold font-display text-xl font-extrabold">{i + 1}</span>
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-xl font-extrabold">
                      <Icon className="size-5" aria-hidden="true" />
                      {t}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink/70">{b}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Node({
  ref,
  Icon,
  title,
  sub,
  alignRight,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  Icon: typeof Home;
  title: string;
  sub: string;
  alignRight?: boolean;
}) {
  return (
    <div className={cn("flex", alignRight ? "justify-start" : "justify-end")}>
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex max-w-[16rem] items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3 shadow-[0_4px_0_0_var(--color-ink)]",
          alignRight && "flex-row",
        )}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-marigold-soft">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block font-bold leading-tight">{title}</span>
          <span className="block text-sm leading-tight text-muted">{sub}</span>
        </span>
        <span className="sr-only sm:hidden">{title}</span>
      </div>
    </div>
  );
}

/* --------------------------------- features -------------------------------- */

export function Features() {
  const safe = SEED_JOBS.find((j) => j.id === "j2")!;
  const scam = SEED_JOBS.find((j) => j.id === "j4")!;
  const ramesh = SEED_WORKERS[0]!;
  const scamCheck = assess(scam, EMPLOYERS[scam.employerId]);
  const fairJob = SEED_JOBS.find((j) => j.id === "j1")!;
  const fairCheck = assess(fairJob, EMPLOYERS[fairJob.employerId]);

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>What Naka does</Eyebrow>
          <h2 id="features-title" className="mt-3 font-display text-[2.4rem] leading-[1.05] font-extrabold sm:text-[3.2rem]">
            Four promises, built for irregular work and a five-inch screen.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-24">
          <Feature
            n="01"
            Icon={Briefcase}
            title="Find work, reliably"
            lead="Nearby daily-wage, short and monthly work — where the important things are the biggest things on the screen."
            points={["Pay in big numbers, with the total for the job", "Hours drawn from sunrise to night", "Minutes on foot, by bus or by train", "Every job can be read aloud"]}
            visual={
              <div className="space-y-4">
                <JobCard job={safe} preview />
                <Card className="p-4">
                  <p className="mb-3 text-sm font-bold text-muted">Hours, without reading numbers</p>
                  <HoursBar start={8} end={17} />
                </Card>
              </div>
            }
          />
          <Feature
            n="02"
            Icon={BadgeCheck}
            title="Show skills, without credentials"
            lead="The Kaam Card replaces the résumé: trade, years, work photos and the people who vouch — with a QR code for the toolbox."
            points={["Made in 60 seconds by voice or pictures", "Vouches from the naka's Saathi and past employers", "Logged work days become proof of experience", "Print it, share it on WhatsApp, or let them scan"]}
            visual={<KaamCard worker={ramesh} lang="en" daysLogged={74} className="mx-auto max-w-md rotate-[-1.5deg]" />}
            flip
          />
          <Feature
            n="03"
            Icon={ShieldCheck}
            title="Trust before anyone commits"
            lead="Every listing must say the pay, hours and pay day. A safety check reads it like a careful friend would."
            points={["Six plain checks on every job", "A fair-pay meter against usual local rates", "Scams named in words: fees, kept documents, too-good pay", "A Pakka agreement both sides keep — proof if pay doesn't come"]}
            visual={
              <div className="space-y-4">
                <Card className="border-danger/40 p-5">
                  <p className="mb-3 font-display text-lg font-extrabold">“Painters needed in Dubai — pay ₹15,000 for visa”</p>
                  <SafetyChecks a={scamCheck} />
                </Card>
                <Card className="p-5">
                  <FairMeter job={fairJob} fair={fairCheck.fair} />
                </Card>
              </div>
            }
          />
          <Feature
            n="04"
            Icon={Landmark}
            title="Rights and support, in plain words"
            lead="Four taps find the schemes a worker may qualify for — then the papers needed, the nearest help centre and a number to call."
            points={["e-Shram, pension, welfare board, health and insurance", "Paper checklist: what you have, what you need", "Unpaid wages? Steps, legal aid and the agreement as proof", "Work days count toward the welfare board's 90 days"]}
            visual={
              <div className="grid gap-3 sm:grid-cols-2">
                {SCHEMES.filter((s) => ["eshram", "bocw", "pmsym", "pmjay"].includes(s.id)).map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-[1.3rem] border-2 border-ink/10 bg-white p-4 shadow-card"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-sky-soft text-sky">
                      {s.id === "bocw" ? <HardHat className="size-5" aria-hidden="true" /> : <Landmark className="size-5" aria-hidden="true" />}
                    </span>
                    <p className="mt-3 font-display text-lg leading-tight font-extrabold">{s.name.en}</p>
                    <p lang="hi" className="text-sm font-bold text-muted">{s.name.hi}</p>
                    <p className="mt-2 text-[0.95rem] leading-snug">{s.short.en}</p>
                  </motion.div>
                ))}
              </div>
            }
            flip
          />
        </div>
      </div>
    </section>
  );
}

function Feature({
  n,
  Icon,
  title,
  lead,
  points,
  visual,
  flip,
}: {
  n: string;
  Icon: typeof Briefcase;
  title: string;
  lead: string;
  points: string[];
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(flip && "lg:order-2")}>
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl font-extrabold text-marigold-deep">{n}</span>
          <span className="flex size-12 items-center justify-center rounded-2xl border-2 border-ink bg-marigold">
            <Icon className="size-6" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-4 font-display text-[2rem] leading-tight font-extrabold sm:text-[2.4rem]">{title}</h3>
        <p className="mt-3 text-lg leading-relaxed text-ink/75">{lead}</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[1.05rem] font-bold">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf text-white">
                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.12} className={cn("relative", flip && "lg:order-1")}>
        <div className="absolute -inset-4 -z-0 rounded-[2.2rem] bg-sand" aria-hidden="true" />
        <div className="relative">
          <LangContext.Provider value="en">{visual}</LangContext.Provider>
        </div>
      </Reveal>
    </div>
  );
}

/* ----------------------------- inclusive design ---------------------------- */

const PRINCIPLES = [
  { Icon: Mic, t: "Speak, don't type", b: "Onboarding by voice: say your work, years and naka — the form fills itself." },
  { Icon: Hand, t: "Pictures before words", b: "Hand-drawn tool pictograms for every trade. Recognisable without reading." },
  { Icon: Ear, t: "Every screen can talk", b: "Jobs, agreements and schemes read aloud in Hindi, Marathi or English." },
  { Icon: Languages, t: "One tap to your language", b: "Switch language anywhere. Employers' listings are shown in the worker's own." },
  { Icon: MessageSquareText, t: "No smartphone needed", b: "Button phones get work by SMS and answer with one key. A Naka Saathi helps the rest." },
  { Icon: MousePointerClick, t: "Big, forgiving targets", b: "48px controls, high contrast for sunlight, a bigger-text switch, and nothing hidden behind hover." },
];

const COMPARE: [string, string][] = [
  ["Upload a résumé", "Kaam Card: trade, photos, vouches, days worked"],
  ["Type long forms in English", "Speak or tap pictures, in your language"],
  ["Apply and wait", "Ask, agree and get a shared Pakka agreement"],
  ["“Salary: negotiable”", "Pay, hours and pay day are required"],
  ["Smartphone and data only", "Works by SMS and through a Naka Saathi"],
  ["Rights live on government websites", "Schemes, papers and helplines in four taps"],
];

export function Inclusive() {
  return (
    <section id="inclusive" aria-labelledby="inclusive-title" className="scroll-mt-20 border-y-2 border-ink bg-ink py-24 text-paper on-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow dark>Inclusive by design</Eyebrow>
          <h2 id="inclusive-title" className="mt-3 font-display text-[2.4rem] leading-[1.05] font-extrabold sm:text-[3.2rem]">
            Not another job portal. Built for a thumb, a voice and a cracked screen.
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ Icon, t, b }, i) => (
            <li key={t}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <div className="h-full rounded-[1.6rem] border-2 border-white/15 bg-white/[0.04] p-6 transition-colors hover:border-marigold/60">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-marigold text-ink">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-extrabold">{t}</h3>
                  <p className="mt-2 leading-relaxed text-paper/70">{b}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-16">
          <div className="overflow-hidden rounded-[1.6rem] border-2 border-white/15">
            <table className="w-full text-left">
              <caption className="sr-only">A typical job portal compared with Naka</caption>
              <thead>
                <tr className="bg-white/[0.06]">
                  <th scope="col" className="w-1/2 p-4 font-display text-lg font-extrabold text-paper/60">
                    A typical job portal
                  </th>
                  <th scope="col" className="w-1/2 p-4 font-display text-lg font-extrabold text-marigold">
                    Naka
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([a, b]) => (
                  <tr key={a} className="border-t border-white/10">
                    <td className="p-4 text-paper/60">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
                        {a}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 size-5 shrink-0 text-[#3ddc84]" aria-hidden="true" />
                        {b}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------ cta ----------------------------------- */

export function DemoCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-marigold py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 id="cta-title" className="font-display text-[2.6rem] leading-[1.02] font-extrabold sm:text-[3.6rem]">
              See both sides of the naka, at the same time.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">
              The live demo puts Ramesh&apos;s phone, Arjun&apos;s button phone and Priya&apos;s employer site side by side. Post a job on one —
              watch it arrive on the other, in another language.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo" variant="ink" size="xl">
                <Play className="size-5 fill-paper" aria-hidden="true" />
                Open the live demo
              </ButtonLink>
              <ButtonLink href="/employer" variant="outline" size="xl">
                Employer site <ArrowRight className="size-5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-3">
              {[
                { href: "/worker/welcome", Icon: Mic, t: "Worker onboarding by voice", s: "Pick a language, say your work" },
                { href: "/worker", Icon: Smartphone, t: "Worker app", s: "Work feed, Kaam Card, Khata, rights" },
                { href: "/saathi", Icon: Users, t: "Naka Saathi app", s: "For the helper with the one smartphone" },
                { href: "/employer/post", Icon: Briefcase, t: "Post work", s: "With live preview in Hindi & Marathi" },
              ].map(({ href, Icon, t, s }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-ink bg-paper p-4 shadow-[0_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-marigold">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-extrabold">{t}</span>
                      <span className="block text-sm text-muted">{s}</span>
                    </span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink py-12 text-paper on-dark">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo tone="marigold" />
          <p className="mt-4 leading-relaxed text-paper/70">
            The labour naka, in your pocket. A frontend prototype for Artemis 2026 (ACM KJSSE · Abhiyantriki), Problem Statement 2 —
            “Beyond the Waiting Line”.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 font-bold">
          <Link href="/demo" className="hover:text-marigold">Live demo</Link>
          <Link href="/worker" className="hover:text-marigold">Worker app</Link>
          <Link href="/employer" className="hover:text-marigold">For employers</Link>
          <Link href="/saathi" className="hover:text-marigold">Naka Saathi</Link>
          <Link href="/worker/haq" className="hover:text-marigold">Rights &amp; schemes</Link>
          <Link href="/worker/welcome" className="hover:text-marigold">Voice onboarding</Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-4 text-sm text-paper/50 sm:px-6">
        All people, jobs, employers and help centres shown are sample data. Scheme details are simplified — confirm with official
        sources. Helpline numbers are real public helplines.
      </p>
    </footer>
  );
}
