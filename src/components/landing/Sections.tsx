"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Play, X } from "lucide-react";
import type { ReactNode } from "react";
import { AndroidFrame, LaptopFrame } from "@/components/art/Devices";
import { PakkaStamp, ScamTape } from "@/components/art/Moments";
import { Portrait, type PersonaId } from "@/components/art/Portraits";
import { TornEdge } from "@/components/art/Scenes";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ButtonLink } from "@/components/ui/primitives";
import { JobCard } from "@/components/worker/JobCard";
import { KaamCard } from "@/components/worker/KaamCard";
import { SEED_JOBS } from "@/lib/data/jobs";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import { SEED_WORKERS } from "@/lib/data/workers";
import { LangContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ painted band ------------------------------ */

export function SignBand() {
  return (
    <section aria-label="Trades on the naka" className="relative border-y-[3px] border-ink bg-bus py-4 text-white">
      <div className="absolute inset-x-0 top-0 h-2 tape-hazard tape-moving opacity-90" aria-hidden="true" />
      <Marquee pauseOnHover className="mt-1 [--duration:52s] [--gap:2.5rem]">
        {TRADE_ORDER.map((id) => (
          <span key={id} className="flex items-center gap-3 whitespace-nowrap">
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-paper">
              <TradeIcon trade={id} className="size-8" />
            </span>
            <span className="font-display text-[1.6rem] font-bold tracking-wide">{TRADES[id].label.en}</span>
            <span lang="hi" className="font-poster text-[1.3rem] text-marigold">
              {TRADES[id].label.hi}
            </span>
            <span lang="mr" className="font-display text-[1.3rem] font-semibold text-white/70">
              {TRADES[id].label.mr}
            </span>
          </span>
        ))}
      </Marquee>
      <div className="absolute inset-x-0 bottom-0 h-2 tape-hazard tape-moving opacity-90 [animation-direction:reverse]" aria-hidden="true" />
    </section>
  );
}

/* --------------------------------- personas -------------------------------- */

const PERSONAS: {
  id: PersonaId;
  name: string;
  role: string;
  quote: string;
  quoteLang: "hi" | "mr" | "en";
  english?: string;
  naka: string;
  href: string;
}[] = [
  {
    id: "ramesh",
    name: "Ramesh Yadav",
    role: "Painter · 12 years · Ghatkopar naka",
    quote: "बारह साल का काम है, पर दिखाने को कुछ नहीं।",
    quoteLang: "hi",
    english: "Twelve years of work, and nothing to show for it.",
    naka: "Gets a Kaam Card, work near him in Hindi, and a pakka deal before he travels.",
    href: "/worker",
  },
  {
    id: "arjun",
    name: "Arjun Paswan",
    role: "Helper · no smartphone",
    quote: "मेरे पास बटन वाला फ़ोन है। काम उसी पर आना चाहिए।",
    quoteLang: "hi",
    english: "I have a button phone. Work should reach me on that.",
    naka: "Gets work alerts by SMS in Hindi and answers with one key: 1 for yes.",
    href: "/demo",
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Home owner · Powai",
    quote: "I want someone I can trust, and to pay them fairly. I just don't know where to look.",
    quoteLang: "en",
    naka: "Posts work in three steps, sees vouched workers nearby, and keeps the same agreement.",
    href: "/employer",
  },
  {
    id: "sunil",
    name: "Sunil Patil",
    role: "Naka Saathi · Ghatkopar",
    quote: "नाक्यावर एक फोन असला तरी सगळ्यांना काम मिळू शकतं.",
    quoteLang: "mr",
    english: "Even one phone at the naka can bring work to everyone.",
    naka: "Registers workers who have no phone and marks who's at the naka each morning.",
    href: "/saathi",
  },
];

export function Personas() {
  return (
    <section id="how" aria-labelledby="personas-title" className="paper-texture scroll-mt-16 bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 id="personas-title" className="signboard text-[2.8rem] sm:text-[3.8rem]">
            Four people. One naka.
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-ink/75">
            RozGhar is built around the people who already meet at the roadside every morning. Nobody is asked to change how they find
            work. They just get better tools for it.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <li key={p.id} className={cn("flex", i % 2 === 1 ? "lg:pt-10" : "lg:pb-10")}>
              <Reveal delay={i * 0.07} className="flex w-full">
                <article className="flex w-full flex-col rounded-[1.4rem] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_0_var(--color-ink)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg]">
                  <Portrait who={p.id} className="size-24" title={`Illustration of ${p.name}`} />
                  <h3 className="mt-4 font-display text-[1.6rem] leading-none font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm font-bold text-ink/55">{p.role}</p>
                  <blockquote className="mt-4 flex-1">
                    <p lang={p.quoteLang} className="font-hand text-[1.25rem] leading-snug text-ink">
                      “{p.quote}”
                    </p>
                    {p.english ? <p className="mt-1.5 text-sm text-ink/55 italic">{p.english}</p> : null}
                  </blockquote>
                  <p className="mt-5 border-t-2 border-dashed border-line pt-4 text-[0.95rem] leading-snug">{p.naka}</p>
                  <Link href={p.href} className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline decoration-marigold decoration-2 underline-offset-4">
                    See their screen <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-ink/50">Illustrative people, based on how roadside hiring works in Mumbai.</p>
      </div>
    </section>
  );
}

/* --------------------------------- posters --------------------------------- */

export function PosterWall() {
  const posters = [
    { value: 90, suffix: "%", label: "of India's workers earn their living in informal work (approx.)", tone: "bg-marigold", rot: "-rotate-2" },
    { value: 30, suffix: " cr+", label: "unorganised workers have signed up on the e-Shram portal", tone: "bg-white", rot: "rotate-1" },
    { value: 0, suffix: "", label: "résumés, forms in English or smartphones needed to get work on RozGhar", tone: "bg-ink text-paper", rot: "-rotate-1" },
  ];
  return (
    <section aria-label="The scale of it" className="relative overflow-hidden border-y-[3px] border-ink bg-[#d9cdb4] py-20">
      <div className="paper-texture absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
        {posters.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, rotate: i % 2 ? 14 : -14, y: -30 }}
            whileInView={{ opacity: 1, rotate: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 120, damping: 11, delay: i * 0.12 }}
            style={{ transformOrigin: "50% 0%" }}
          >
            <figure className={cn("relative transition-transform duration-300 hover:rotate-0", p.rot)}>
              <span className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#f3ead2]/80 shadow-sm" aria-hidden="true" />
              <div className={cn("border-2 border-ink p-6 pb-7 shadow-[6px_8px_0_0_rgba(22,26,61,0.35)]", p.tone)}>
                <p className="font-display text-[4.2rem] leading-none font-bold">
                  <NumberTicker value={p.value} className={cn("tracking-tight", p.tone.includes("ink") ? "text-marigold" : "text-ink")} />
                  {p.suffix}
                </p>
                <figcaption className="mt-3 text-[1.02rem] leading-snug font-bold">{p.label}</figcaption>
              </div>
              <TornEdge className={p.tone.includes("ink") ? "text-ink" : p.tone.includes("marigold") ? "text-marigold" : "text-white"} />
            </figure>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- feature wall ------------------------------ */

export function FeatureWall() {
  const safe = SEED_JOBS.find((j) => j.id === "j2")!;
  const scam = SEED_JOBS.find((j) => j.id === "j4")!;
  const ramesh = SEED_WORKERS[0]!;

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16 bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <h2 id="features-title" className="signboard text-[2.8rem] sm:text-[3.8rem]">
            What changes with RozGhar.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">
            Every screen below is the real app, not a mock-up. Open the live demo to use them.
          </p>
        </Reveal>

        <LangContext.Provider value="en">
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <Tile
              className="lg:col-span-2"
              kicker="Find work"
              title="The pay is the biggest thing on the card. Scams get taped off."
              body="Hours as a sunrise-to-night bar, distance in minutes by bus or on foot, and every listing read aloud. Six plain checks catch advance fees, kept documents and too-good pay."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <JobCard job={safe} preview />
                <div className="relative">
                  <JobCard job={scam} preview />
                  <ScamTape className="top-[44%]" />
                </div>
              </div>
            </Tile>
            <Tile className="lg:row-span-2" kicker="Show skills" title="A visiting card for people who never had one.">
              <div className="mx-auto w-full max-w-[19rem] rotate-[1.5deg] transition-transform duration-300 hover:rotate-0">
                <KaamCard worker={ramesh} lang="en" daysLogged={74} />
              </div>
              <ul className="mt-6 space-y-2 text-[0.95rem] font-bold">
                {["Made by voice in a minute", "Vouched for by the Naka Saathi", "QR for the toolbox, share on WhatsApp"].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </Tile>
            <Tile kicker="Build trust" title="Both sides keep the same pakka agreement.">
              <Chit />
            </Tile>
            <Tile kicker="Rights" title="Four taps to the schemes you may qualify for.">
              <div className="space-y-2">
                {["How old are you?", "What work do you mostly do?", "Monthly income under ₹15,000?", "Do you have a bank account?"].map((q, i) => (
                  <div key={q} className="flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-paper px-3 py-2.5 text-[0.95rem] font-bold">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-paper">{i + 1}</span>
                    {q}
                  </div>
                ))}
                <p className="rounded-xl bg-leaf px-3 py-2.5 font-bold text-white">→ 5 schemes may be for you: e-Shram, pension, welfare board…</p>
              </div>
            </Tile>
            <Tile className="lg:col-span-3" kicker="No smartphone" title="Work by SMS, answered with one key.">
              <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
                <div className="space-y-2 rounded-xl bg-[#c8d6b0] p-4 font-deva text-[0.95rem] text-[#1d2814]">
                  <p className="rounded-md border border-[#22301a]/30 bg-[#d6e2c1] px-3 py-2">
                    रोज़घर: हेल्पर का काम, घाटकोपर। ₹650 रोज़, सुबह 8 – शाम 5। उसी दिन पैसा। काम चाहिए तो 1 भेजें।
                  </p>
                  <p className="ml-auto w-fit rounded-md border border-[#22301a]/40 bg-[#e2ecd0] px-3 py-1.5 font-bold">1</p>
                  <p className="rounded-md border border-[#22301a]/30 bg-[#d6e2c1] px-3 py-2">पक्का! श्री गणेश कॉन्ट्रैक्टर्स ने हाँ कहा। करार नं. NK-2401।</p>
                </div>
                <div className="space-y-3 text-[1.02rem] leading-relaxed text-ink/75">
                  <p>
                    Arjun has a ₹1,000 button phone. RozGhar sends work in Hindi; he replies <strong>1</strong> for yes, <strong>2</strong> for no,{" "}
                    <strong>0</strong> for help.
                  </p>
                  <p>A Naka Saathi, one person at the naka with a smartphone, registers anyone with no phone at all and marks who is there each morning.</p>
                </div>
              </div>
            </Tile>
          </div>
        </LangContext.Provider>
      </div>
    </section>
  );
}

function Tile({
  kicker,
  title,
  body,
  children,
  className,
}: {
  kicker: string;
  title: string;
  body?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("h-full", className)}>
      <article className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border-2 border-ink bg-sand transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]">
        <div className="p-6 pb-4">
          <p className="font-mono text-sm font-bold tracking-wider text-bus uppercase">{kicker}</p>
          <h3 className="mt-2 font-display text-[1.75rem] leading-[1.05] font-bold">{title}</h3>
          {body ? <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">{body}</p> : null}
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 pb-6">{children}</div>
      </article>
    </Reveal>
  );
}

function Chit() {
  const rows: [string, string][] = [
    ["Work", "Painting, 2 days"],
    ["Place", "Powai, Hiranandani"],
    ["Hours", "9 AM – 6 PM"],
    ["Pay", "₹900 a day"],
    ["Paid", "Same day · UPI"],
  ];
  return (
    <div className="relative mx-auto max-w-xs">
      <div className="rotate-[-1deg] border-2 border-ink bg-white shadow-[4px_4px_0_0_var(--color-ink)]">
        <div className="flex items-center justify-between bg-ink px-3 py-2 text-paper">
          <span className="font-display text-lg font-bold">Pakka agreement</span>
          <span className="font-mono text-xs">NK-2401</span>
        </div>
        <dl className="divide-y divide-dashed divide-line px-3 font-mono text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 py-1.5">
              <dt className="text-muted">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="perforated h-3" aria-hidden="true" />
      </div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-80px" }}>
        <PakkaStamp code="NK-2401" className="absolute right-[-0.5rem] bottom-6 w-36" />
      </motion.div>
    </div>
  );
}

/* --------------------------------- design --------------------------------- */

const RULES = [
  ["Speak, don't type.", "Onboarding works by voice: say your work, years and naka, and the form fills itself."],
  ["Pictures before words.", "Every trade has a drawn tool, so choosing work doesn't depend on reading."],
  ["Every screen can talk.", "Jobs, agreements and schemes can be read aloud in Hindi, Marathi or English."],
  ["Nothing important hides.", "Pay, hours and pay day are required fields. No “salary negotiable”."],
  ["No phone? Still in.", "Button phones get work by SMS. A Naka Saathi helps people with no phone at all."],
  ["Made for a cracked screen in sunlight.", "Big targets, strong contrast, a bigger-text switch, nothing behind hover."],
];

const COMPARE: [string, string][] = [
  ["Upload a résumé", "Show a Kaam Card: photos, vouches, days worked"],
  ["Type long forms in English", "Speak or tap pictures, in your language"],
  ["Apply, then wait", "Ask, agree, and both keep the same agreement"],
  ["“Salary: negotiable”", "Pay, hours and pay day shown up front"],
  ["Smartphone and data only", "Works by SMS and through a Naka Saathi"],
  ["Rights on a government website", "Schemes, papers and helplines in four taps"],
];

export function DesignLedger() {
  return (
    <section id="inclusive" aria-labelledby="design-title" className="scroll-mt-16 border-y-[3px] border-ink bg-ink py-24 text-paper on-dark">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 id="design-title" className="signboard-dark text-[2.8rem] sm:text-[3.8rem]">
            Not another job portal.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/75">Six rules we held every screen to.</p>
          <ol className="mt-10 space-y-6">
            {RULES.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-mono text-lg font-bold text-marigold">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-[1.45rem] leading-tight font-bold">{t}</span>
                  <span className="mt-1 block leading-relaxed text-paper/70">{b}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rotate-[0.6deg] border-2 border-ink bg-paper p-1 text-ink shadow-[8px_8px_0_0_var(--color-marigold)]">
            <table className="w-full text-left">
              <caption className="border-b-2 border-ink bg-marigold px-4 py-3 text-left font-display text-xl font-bold">
                A typical job portal vs RozGhar
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Typical job portal</th>
                  <th scope="col">RozGhar</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dashed divide-line">
                {COMPARE.map(([a, b]) => (
                  <tr key={a} className="align-top">
                    <td className="w-[42%] px-4 py-3 font-mono text-[0.9rem] text-ink/50">
                      <span className="flex gap-2">
                        <X className="mt-0.5 size-4 shrink-0 text-bus" aria-hidden="true" />
                        <span className="line-through decoration-bus/60">{a}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      <span className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
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
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-bus py-24">
      <div className="paper-texture absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="relative rotate-[-1deg] bg-paper p-8 shadow-[10px_10px_0_0_var(--color-ink)]">
              <TornEdge className="absolute inset-x-0 -top-4 text-paper" flip />
              <h2 id="cta-title" className="signboard text-[2.6rem] sm:text-[3.4rem]">
                See both sides of the naka at once.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                The live demo puts Ramesh&apos;s phone, Arjun&apos;s button phone and Priya&apos;s laptop side by side. Post a job on one and
                watch it arrive on the other, in another language.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/demo" variant="ink" size="lg">
                  <Play className="size-5 fill-paper" aria-hidden="true" />
                  Open the live demo
                </ButtonLink>
                <ButtonLink href="/employer" variant="outline" size="lg">
                  Employer site <ArrowRight className="size-5" aria-hidden="true" />
                </ButtonLink>
              </div>
              <TornEdge className="absolute inset-x-0 -bottom-4 text-paper" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative pb-10">
            <LaptopFrame url="rozghar.app/employer" className="max-w-xl">
              <MiniDashboard />
            </LaptopFrame>
            <div className="absolute -bottom-2 right-0 w-[150px] sm:right-6 sm:w-[170px]">
              <AndroidFrame className="w-full rounded-[1.6rem] p-[5px]" screenClassName="rounded-[1.3rem] h-[300px]">
                <div className="space-y-2 p-2" lang="hi">
                  <div className="rounded-lg bg-ink p-2 text-[0.6rem] text-paper">
                    <p className="font-bold">प्रिया नायर आपको काम पर रखना चाहती हैं</p>
                    <p className="mt-1 inline-block rounded bg-marigold px-1.5 py-0.5 font-bold text-ink">ऑफ़र देखें</p>
                  </div>
                  <div className="rounded-lg border border-ink/15 bg-white p-2">
                    <p className="font-display text-[0.8rem] font-bold">पेंटिंग का काम</p>
                    <p className="font-display text-lg leading-none font-bold">₹900</p>
                    <p className="mt-1 text-[0.55rem] font-bold text-leaf">जाँचा हुआ · उसी दिन पैसा</p>
                  </div>
                </div>
              </AndroidFrame>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MiniDashboard() {
  return (
    <div className="bg-[#f7f1e4] p-4 text-ink">
      <div className="flex items-center gap-2">
        <LogoMark className="size-6" />
        <span className="font-display text-sm font-bold">RozGhar · for employers</span>
        <span className="ml-auto rounded-full bg-ink px-2 py-0.5 text-[0.6rem] font-bold text-paper">Dashboard</span>
      </div>
      <p className="mt-3 font-display text-xl leading-tight font-bold">Hire people you can trust.</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["39", "free today"],
          ["1", "open job"],
          ["1", "pakka"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-lg border border-ink/10 bg-white p-2">
            <p className="font-display text-lg leading-none font-bold">{n}</p>
            <p className="text-[0.6rem] font-bold text-muted">{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-ink bg-white p-2">
        <Portrait who="ramesh" className="size-8" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold">Ramesh Yadav wants this work</p>
          <p className="text-[0.6rem] text-muted">Painting · ₹900 · NK-2401</p>
        </div>
        <span className="rounded-md bg-leaf px-2 py-1 text-[0.6rem] font-bold text-white">Confirm</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink py-14 text-paper on-dark">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo tone="marigold" />
          <p className="mt-4 leading-relaxed text-paper/70">
            The labour naka, in your pocket. A frontend prototype for Artemis 2026 (ACM KJSSE · Abhiyantriki), Problem Statement 2,
            “Beyond the Waiting Line”.
          </p>
          <p lang="hi" className="mt-4 font-poster text-xl text-marigold">
            काम मिलेगा, इज़्ज़त से।
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-2.5 font-bold">
          <Link href="/demo" className="hover:text-marigold">Live demo</Link>
          <Link href="/worker" className="hover:text-marigold">Worker app</Link>
          <Link href="/employer" className="hover:text-marigold">For employers</Link>
          <Link href="/saathi" className="hover:text-marigold">Naka Saathi</Link>
          <Link href="/worker/haq" className="hover:text-marigold">Rights &amp; schemes</Link>
          <Link href="/worker/welcome" className="hover:text-marigold">Voice onboarding</Link>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-7xl px-4 text-sm text-paper/45 sm:px-6">
        All people, jobs, employers and help centres shown are sample data. Scheme details are simplified; confirm with official
        sources. Helpline numbers are real public helplines.
      </p>
    </footer>
  );
}
