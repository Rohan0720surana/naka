"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, BellRing, Pause, Play, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AndroidFrame } from "@/components/art/Devices";
import { CoinDrop, PakkaStamp } from "@/components/art/Moments";
import { NakaStrip } from "@/components/art/Scenes";
import { LogoMark } from "@/components/brand/Logo";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { JobCard } from "@/components/worker/JobCard";
import { SEED_JOBS } from "@/lib/data/jobs";
import { LangContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const STEPS = [
  { time: "7:00 AM", caption: "Ramesh taps “free today”. Employers nearby can now see his Kaam Card." },
  { time: "7:05 AM", caption: "A painting job in Powai arrives — in Hindi, with the pay up front." },
  { time: "7:06 AM", caption: "Pay, hours, place and a safety check, before he spends on the bus." },
  { time: "7:08 AM", caption: "Both sides say yes. The deal is pakka, and both keep the same copy." },
  { time: "6:30 PM", caption: "Paid ₹1,800. The two days land in his Kamai Khata as proof of work." },
];

/** An autoplaying walk through the worker app, inside a real phone frame. */
export function DemoReel() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const playing = !userPaused && !reduce;
  const job = SEED_JOBS.find((j) => j.id === "j1")!;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 3400);
    return () => clearTimeout(t);
  }, [playing, step]);

  return (
    <div className="flex flex-col items-center">
      <AndroidFrame tilt screenClassName="h-[540px]">
        <LangContext.Provider value="hi">
          <div lang="hi" className="relative h-[513px] overflow-hidden">
            <div className="flex items-center gap-2 border-b-2 border-ink/8 px-3.5 py-2">
              <LogoMark className="size-8" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold">रोज़घर</p>
                <p className="text-[0.65rem] font-bold text-muted">घाटकोपर नाका</p>
              </div>
              <span className="ml-auto rounded-full border-2 border-ink bg-marigold px-2 py-0.5 text-[0.7rem] font-bold">हिंदी</span>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={step === 1 ? 0 : step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="p-3"
              >
                {step <= 1 ? <HomeScreen dim={step === 1} /> : null}
                {step === 2 ? (
                  <div className="space-y-2.5">
                    <JobCard job={job} preview />
                    <div className="flex items-center gap-2 rounded-2xl bg-leaf-soft p-2.5 text-[0.8rem] font-bold text-leaf">
                      <ShieldCheck className="size-5 shrink-0" />
                      पैसा माँगा नहीं · पता पक्का · मज़दूरी सही
                    </div>
                  </div>
                ) : null}
                {step === 3 ? <ChitScreen /> : null}
                {step === 4 ? <PaidScreen /> : null}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {step === 1 ? (
                <motion.div
                  initial={{ y: -90, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 260, delay: 0.25 }}
                  className="absolute inset-x-2.5 top-14 z-10 flex gap-2.5 rounded-2xl border-2 border-ink bg-ink p-3 text-paper shadow-pop"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-marigold text-ink">
                    <BellRing className="size-4" />
                  </span>
                  <span>
                    <span className="block font-display text-[0.95rem] leading-tight font-bold">पास में नया काम: पेंटिंग का काम</span>
                    <span className="block text-[0.78rem] text-paper/75">पवई · ₹900 रोज़ · कल से</span>
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </LangContext.Provider>
      </AndroidFrame>

      <div className="mt-7 w-full max-w-[22rem]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <ol className="flex flex-1 gap-1.5" aria-label="Walkthrough steps">
            {STEPS.map((s, i) => (
              <li key={s.time} className="flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(i);
                    setUserPaused(true);
                  }}
                  aria-current={step === i ? "step" : undefined}
                  aria-label={`${s.time}: ${s.caption}`}
                  className="block h-2.5 w-full overflow-hidden rounded-full bg-ink/15"
                >
                  {step === i ? (
                    <motion.span
                      key={`${i}-${playing}`}
                      className="block h-full rounded-full bg-ink"
                      initial={{ width: playing ? "0%" : "100%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: playing ? 3.4 : 0, ease: "linear" }}
                    />
                  ) : i < step ? (
                    <span className="block h-full w-full rounded-full bg-ink/60" />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-3 min-h-[3.2rem] text-[0.95rem] leading-snug" aria-live="polite">
          <span className="font-mono text-sm font-bold text-bus">{STEPS[step]!.time}</span>{" "}
          <span className="text-ink/80">{STEPS[step]!.caption}</span>
        </p>
      </div>
    </div>
  );
}

function HomeScreen({ dim }: { dim: boolean }) {
  return (
    <div className={cn("space-y-3 transition-opacity duration-300", dim && "opacity-40")}>
      <p className="font-display text-[1.45rem] leading-none font-bold">नमस्ते, रमेश</p>
      <div className="overflow-hidden rounded-[1.3rem] border-2 border-ink bg-ink text-paper">
        <div className="flex items-center justify-between px-3 pt-3">
          <span className="font-display text-[1.05rem] leading-tight font-bold">आज काम के लिए फ़्री हैं?</span>
          <span className="flex h-8 w-14 items-center rounded-full bg-marigold p-0.5">
            <motion.span
              className="flex size-7 items-center justify-center rounded-full border-2 border-ink bg-white text-[0.6rem] font-bold text-ink"
              initial={{ x: 0 }}
              animate={{ x: 22 }}
              transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.5 }}
            >
              हाँ
            </motion.span>
          </span>
        </div>
        <NakaStrip on className="mt-1" />
      </div>
      <div className="space-y-2">
        <p className="pt-1 font-display text-[1.05rem] font-bold">घाटकोपर नाका के पास काम</p>
        {[
          { trade: "painter" as const, title: "पेंटिंग का काम", where: "पवई · 5 km", pay: "₹900", tag: "उसी दिन पैसा" },
          { trade: "labourer" as const, title: "हेल्पर का काम", where: "घाटकोपर · 0.6 km", pay: "₹650", tag: "खाना मिलेगा" },
          { trade: "tiler" as const, title: "टाइल का काम", where: "सायन · 7 km", pay: "₹1,100", tag: "जाँचा हुआ" },
        ].map((j, i) => (
          <motion.div
            key={j.title}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-2.5 rounded-2xl border-2 border-ink/10 bg-white p-2.5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sand">
              <TradeIcon trade={j.trade} className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[0.95rem] leading-tight font-bold">{j.title}</span>
              <span className="block text-[0.68rem] font-bold text-muted">
                {j.where} · <span className="text-leaf">{j.tag}</span>
              </span>
            </span>
            <span className="font-display text-lg font-bold tabular">{j.pay}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChitScreen() {
  const rows: [string, string][] = [
    ["काम", "पेंटिंग का काम"],
    ["जगह", "पवई, हीरानंदानी"],
    ["समय", "सुबह 9 – शाम 6"],
    ["मज़दूरी", "₹900 रोज़ · 2 दिन"],
    ["पैसा कब", "उसी दिन · UPI"],
  ];
  return (
    <div className="relative">
      <div className="rounded-xl border-2 border-ink bg-white">
        <div className="flex items-center justify-between bg-ink px-3 py-2 text-paper">
          <span className="font-display text-base font-bold">पक्का करार</span>
          <span className="font-mono text-xs">NK-2401</span>
        </div>
        <dl className="divide-y divide-dashed divide-line px-3 font-mono text-[0.78rem]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="grid grid-cols-2 border-t-2 border-dashed border-line text-[0.75rem] font-bold text-leaf">
          <span className="flex items-center gap-1 p-2.5">
            <BadgeCheck className="size-4" /> रमेश
          </span>
          <span className="flex items-center gap-1 p-2.5">
            <BadgeCheck className="size-4" /> प्रिया
          </span>
        </div>
      </div>
      <PakkaStamp code="NK-2401" className="absolute top-24 right-1 w-40" />
    </div>
  );
}

function PaidScreen() {
  return (
    <div className="space-y-3 pt-4 text-center">
      <CoinDrop count={6} className="justify-center" />
      <p className="font-display text-[2.6rem] leading-none font-bold">₹1,800</p>
      <p className="font-bold text-leaf">पैसा मिला · खाते में जुड़ गया</p>
      <div className="mx-auto mt-4 max-w-[15rem] rounded-2xl border-2 border-ink/10 bg-white p-3 text-left">
        <p className="text-[0.75rem] font-bold text-muted">निर्माण मज़दूर कल्याण बोर्ड</p>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-sand">
          <motion.div className="h-full rounded-full bg-leaf" initial={{ width: "80%" }} animate={{ width: "84%" }} transition={{ duration: 1, delay: 0.6 }} />
        </div>
        <p className="mt-1.5 text-[0.75rem] font-bold">90 में से 76 दिन</p>
      </div>
    </div>
  );
}
