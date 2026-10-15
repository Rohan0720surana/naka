"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { BestBus, Rickshaw, SKYLINE_PATH } from "@/components/art/Scenes";
import { DemoReel } from "@/components/landing/DemoReel";
import { ButtonLink } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="paper-texture relative overflow-hidden bg-gradient-to-b from-paper via-paper to-[#ffe2bf]" aria-labelledby="hero-title">
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-3 h-40 w-full" aria-hidden="true">
        <path d={SKYLINE_PATH} fill="#2b3166" opacity="0.12" />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-ink/85" aria-hidden="true" />
      <motion.div
        className="pointer-events-none absolute bottom-2 left-0 w-28 sm:w-36"
        initial={{ x: "-30vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 1 }}
        aria-hidden="true"
      >
        <BestBus className="w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-2 left-0 w-14 sm:w-16"
        initial={{ x: "115vw" }}
        animate={{ x: "-20vw" }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 6 }}
        aria-hidden="true"
      >
        <Rickshaw className="w-full -scale-x-100" />
      </motion.div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-10 pb-28 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-16 lg:pb-32">
        <div>
          <motion.p
            lang="hi"
            initial={{ opacity: 0, rotate: -4, y: 10 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-block rounded-md bg-bus px-3 py-1 font-poster text-[1.35rem] leading-tight text-white shadow-[3px_3px_0_0_var(--color-ink)]"
          >
            नाके का काम, अब फ़ोन पर
          </motion.p>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="signboard mt-6 text-[3.2rem] sm:text-[4.2rem] lg:text-[5rem]"
          >
            Work shouldn&apos;t depend on who walks past the naka.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mt-7 max-w-xl text-[1.15rem] leading-relaxed text-ink/80"
          >
            Every morning, skilled workers across Mumbai stand at roadside nakas hoping to be picked. RozGhar puts that hiring point on
            their phone: pay, hours and a safety check before they go, a card that shows their work, and their rights in plain Hindi
            or Marathi. It even works on a basic button phone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <ButtonLink href="/demo" size="xl" className="w-full sm:w-auto">
              <Play className="size-5 fill-ink" aria-hidden="true" />
              Watch the live demo
            </ButtonLink>
            <ButtonLink href="/worker/welcome" variant="outline" size="xl" className="w-full sm:w-auto">
              Open the worker app
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 grid max-w-lg grid-cols-3 divide-x-2 divide-ink/10 border-y-2 border-ink/10 py-3"
          >
            {[
              ["3", "languages, by voice"],
              ["0", "résumés needed"],
              ["1 key", "to answer by SMS"],
            ].map(([k, v]) => (
              <div key={v} className="px-3 first:pl-0">
                <dt className="sr-only">{v}</dt>
                <dd>
                  <span className="block font-display text-[2rem] leading-none font-bold">{k}</span>
                  <span className="text-sm font-bold text-ink/60">{v}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}>
          <DemoReel />
        </motion.div>
      </div>
    </section>
  );
}
