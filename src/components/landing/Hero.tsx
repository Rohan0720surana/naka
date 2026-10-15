"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Mic, Play, ShieldCheck, ShieldX, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/primitives";
import { JobCard } from "@/components/worker/JobCard";
import { SEED_JOBS } from "@/lib/data/jobs";
import { LangContext } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const job = SEED_JOBS.find((j) => j.id === "j1")!;
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 paper-grain opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold"
          >
            <span className="size-2 rounded-full bg-leaf" aria-hidden="true" />
            For daily-wage workers, hawkers &amp; the people who hire them
          </motion.p>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="mt-5 font-display text-[2.7rem] leading-[1.02] font-extrabold tracking-tight sm:text-[3.6rem] lg:text-[4.4rem]"
          >
            Work shouldn&apos;t depend on{" "}
            <span className="relative inline-block">
              <span className="relative z-10">who walks past</span>
              <motion.span
                className="absolute inset-x-[-0.15em] bottom-[0.08em] z-0 h-[0.38em] origin-left rounded-sm bg-marigold"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                aria-hidden="true"
              />
            </span>{" "}
            the naka.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mt-6 max-w-xl text-[1.15rem] leading-relaxed text-ink/80"
          >
            Naka puts the roadside hiring point in every worker&apos;s pocket: nearby work with clear pay, a Kaam Card instead of a
            résumé, deals both sides keep, and rights in plain words — by voice, in Hindi, Marathi and English. Even on a button phone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/demo" size="xl">
              <Play className="size-5 fill-ink" aria-hidden="true" />
              See the live demo
            </ButtonLink>
            <ButtonLink href="/worker/welcome" variant="outline" size="xl">
              Try the worker app
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          </motion.div>
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-bold text-ink/75"
          >
            {[
              { Icon: Mic, t: "Speak, don't type" },
              { Icon: BadgeCheck, t: "No résumé needed" },
              { Icon: Smartphone, t: "Works by SMS too" },
            ].map(({ Icon, t }) => (
              <motion.li key={t} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                <Icon className="size-5 text-marigold-deep" aria-hidden="true" />
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual job={job} />
      </div>
    </section>
  );
}

function HeroVisual({ job }: { job: (typeof SEED_JOBS)[number] }) {
  return (
    <div className="relative mx-auto w-full max-w-[480px] pt-12 pb-16" aria-hidden="true">
      <motion.div
        className="absolute top-20 left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-marigold"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
      />
      <motion.div
        className="absolute top-28 left-1/2 size-[300px] -translate-x-1/2 rounded-full border-[3px] border-dashed border-ink/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ y: 60, rotate: 6, opacity: 0 }}
        animate={{ y: 0, rotate: -3, opacity: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 90, delay: 0.2 }}
        className="relative mx-auto w-[320px] rounded-[2.6rem] border-[3px] border-ink bg-ink p-2.5 shadow-[0_50px_80px_-30px_rgba(22,26,61,0.65)]"
      >
        <div className="overflow-hidden rounded-[2.1rem] bg-paper" lang="hi">
          <LangContext.Provider value="hi">
            <div className="flex items-center gap-2 border-b-2 border-ink/8 px-3.5 pt-6 pb-2.5">
              <LogoMark className="size-8" />
              <div className="leading-tight">
                <p className="font-display text-sm font-extrabold">नाका</p>
                <p className="text-[0.68rem] font-bold text-muted">घाटकोपर नाका</p>
              </div>
              <span className="ml-auto rounded-full border-2 border-ink bg-marigold px-2 py-0.5 text-[0.7rem] font-bold">हिंदी</span>
            </div>
            <div className="space-y-3 p-3">
              <p className="font-display text-xl font-extrabold">नमस्ते, रमेश</p>
              <div className="flex items-center justify-between rounded-2xl bg-ink px-3 py-2.5 text-paper">
                <span className="text-[0.8rem] font-bold">आज काम के लिए फ़्री हैं?</span>
                <span className="flex h-7 w-12 items-center justify-end rounded-full bg-marigold p-0.5">
                  <span className="size-6 rounded-full border-2 border-ink bg-white" />
                </span>
              </div>
              <JobCard job={job} preview />
            </div>
          </LangContext.Provider>
        </div>
      </motion.div>

      <FloatChip className="top-[7.5rem] -right-2 sm:-right-10" delay={0.9}>
        <ShieldCheck className="size-5 text-leaf" />
        <span>
          Safety check <b className="text-leaf">Checked</b>
        </span>
      </FloatChip>
      <FloatChip className="bottom-2 -right-2 sm:-right-8" delay={1.1} tone="danger">
        <ShieldX className="size-5" />
        <span>“Pay ₹15,000 for visa” — scam</span>
      </FloatChip>
      <FloatChip className="top-0 -left-2 sm:-left-6" delay={1.3} tone="ink">
        <Mic className="size-5 text-marigold" />
        <span lang="hi">“मैं पेंटर हूँ, 12 साल…”</span>
      </FloatChip>
    </div>
  );
}

function FloatChip({
  children,
  className,
  delay,
  tone = "white",
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  tone?: "white" | "danger" | "ink";
}) {
  const tones = { white: "bg-white text-ink", danger: "bg-danger text-white", ink: "bg-ink text-paper" };
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 14, delay }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }}
        className={`flex items-center gap-2 rounded-2xl border-2 border-ink px-3.5 py-2.5 text-[0.85rem] font-bold whitespace-nowrap shadow-[0_4px_0_0_var(--color-ink)] ${tones[tone]}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
