"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import { Figure, NakaSign, SKYLINE_PATH } from "@/components/art/Scenes";
import { cn } from "@/lib/utils";

const BEATS = [
  {
    time: "6:30",
    ampm: "AM",
    hour: 6.5,
    title: "The naka fills up.",
    body: "Painters, masons, helpers. Tools in hand, tiffin in the bag. Around 140 people at the Ghatkopar naka alone, waiting to be picked.",
    people: 8,
  },
  {
    time: "8:15",
    ampm: "AM",
    hour: 8.25,
    title: "A car slows down.",
    body: "A contractor points at three men. No names, no rate, nothing written. “Come, we'll settle the pay later.” Sometimes later never comes.",
    people: 8,
  },
  {
    time: "10:30",
    ampm: "AM",
    hour: 10.5,
    title: "Half are still waiting.",
    body: "The ones who weren't picked have years of skill, and no way to show it. There is no résumé for a clean finish on a wall.",
    people: 4,
  },
  {
    time: "1:00",
    ampm: "PM",
    hour: 13,
    title: "Home with nothing.",
    body: "Rent is due. The pension, insurance and welfare board they qualify for live in forms, in English, in an office far away.",
    people: 1,
  },
];

const PEOPLE = [
  { x: 176, color: "#c98200", tool: "roller" as const },
  { x: 210, color: "#137a3a", tool: "bag" as const },
  { x: 244, color: "#c8202f", tool: "spade" as const },
  { x: 278, color: "#2456c9" },
  { x: 312, color: "#4a5190", tool: "bag" as const },
  { x: 346, color: "#a8430b", tool: "roller" as const },
  { x: 380, color: "#137a7a" },
  { x: 414, color: "#6b4f2a", tool: "spade" as const },
];

const GROUND = 520;

/**
 * The problem, told as one morning at a naka. Scrolling moves the clock: the
 * sun climbs, the sky turns harsh, and the crowd thins out.
 */
export function MorningStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [beat, setBeat] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setBeat(Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length)))));

  const sky = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], ["#ffc995", "#ffe2b5", "#fff1d4", "#f7c58c"]);
  const sunY = useTransform(scrollYProgress, [0, 0.55, 1], [430, 130, 190]);
  const sunX = useTransform(scrollYProgress, [0, 1], [70, 455]);
  const b = BEATS[beat]!;
  const minuteAngle = (b.hour % 1) * 360;
  const hourAngle = ((b.hour % 12) / 12) * 360;

  return (
    <section ref={ref} id="problem" aria-labelledby="story-title" className="relative h-[420vh] scroll-mt-16 bg-ink">
      <h2 id="story-title" className="sr-only">
        A morning at the naka, without RozGhar
      </h2>
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden md:grid md:grid-cols-[1.15fr_1fr]">
        <motion.div className="relative min-h-0 flex-1 overflow-hidden md:h-full" style={{ backgroundColor: sky }}>
          {/* Big painted time in the sky, so the scene reads as a clock face from far away. */}
          <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center md:top-28" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={b.time}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="font-display text-[clamp(5rem,13vw,11rem)] leading-none font-bold text-ink/10"
              >
                {b.time}
              </motion.span>
            </AnimatePresence>
          </div>

          <svg viewBox="0 0 520 600" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
            <motion.circle r="34" fill="#f5b014" cx={sunX} cy={sunY} />

            {/* drifting clouds */}
            {[
              { y: 150, d: 70, s: 1 },
              { y: 230, d: 95, s: 0.7 },
              { y: 95, d: 120, s: 0.55 },
            ].map((c, i) => (
              <motion.g
                key={i}
                initial={{ x: -140 + i * 160 }}
                animate={{ x: [-140 + i * 160, 600] }}
                transition={{ duration: c.d, repeat: Infinity, ease: "linear" }}
                opacity={0.75}
              >
                <g transform={`translate(0 ${c.y}) scale(${c.s})`}>
                  <ellipse cx="40" cy="20" rx="40" ry="14" fill="#fffaf0" />
                  <ellipse cx="70" cy="12" rx="28" ry="14" fill="#fffaf0" />
                  <ellipse cx="18" cy="14" rx="18" ry="10" fill="#fffaf0" />
                </g>
              </motion.g>
            ))}

            {/* a flock of birds crossing */}
            <motion.g initial={{ x: -80 }} animate={{ x: 620 }} transition={{ duration: 26, repeat: Infinity, ease: "linear", delay: 2 }}>
              {[
                [0, 200],
                [24, 188],
                [46, 204],
                [64, 192],
              ].map(([x, y], i) => (
                <motion.path
                  key={i}
                  d={`M${x! - 7} ${y}q7-6 7 0q0-6 7 0`}
                  fill="none"
                  stroke="#161a3d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.g>

            {/* far towers and the city skyline */}
            <g fill="#2b3166" opacity="0.14">
              <rect x="20" y="250" width="44" height="270" />
              <rect x="72" y="300" width="30" height="220" />
              <rect x="400" y="230" width="52" height="290" />
              <rect x="458" y="285" width="40" height="235" />
            </g>
            <path d={SKYLINE_PATH} transform={`translate(0 ${GROUND - 120}) scale(1.3 1.33)`} fill="#2b3166" opacity="0.24" />

            {/* electricity poles and sagging wires, a fixture of every naka */}
            <g stroke="#161a3d" strokeWidth="2.5" fill="none" opacity="0.7">
              <path d="M24 300v220M496 290v230" strokeWidth="5" />
              <path d="M16 304h16M488 294h16" strokeWidth="3" />
              <path d="M24 306q236 70 472 -10" />
              <path d="M24 316q236 80 472 -6" />
            </g>

            {/* station clock */}
            <g transform="translate(460 330)">
              <path d="M0 34v156" stroke="#161a3d" strokeWidth="6" />
              <circle r="36" fill="#fffaf0" stroke="#161a3d" strokeWidth="6" />
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d="M0 -28v6" stroke="#161a3d" strokeWidth="3" transform={`rotate(${i * 30})`} />
              ))}
              {/* Each hand sits in a group centred on the pivot (an invisible full circle), so it turns about the clock centre. */}
              <motion.g initial={false} animate={{ rotate: hourAngle }} transition={{ type: "spring", stiffness: 60, damping: 14 }}>
                <circle r="30" fill="none" />
                <path d="M0 4V-18" stroke="#161a3d" strokeWidth="5" strokeLinecap="round" />
              </motion.g>
              <motion.g
                initial={false}
                animate={{ rotate: minuteAngle + Math.floor(b.hour) * 360 }}
                transition={{ type: "spring", stiffness: 50, damping: 14 }}
              >
                <circle r="30" fill="none" />
                <path d="M0 4V-27" stroke="#c8202f" strokeWidth="3" strokeLinecap="round" />
              </motion.g>
              <circle r="4" fill="#161a3d" />
            </g>

            {/* road */}
            <path d={`M0 ${GROUND}h520v80H0z`} fill="#161a3d" />
            <path d={`M0 ${GROUND - 6}h520v8H0z`} fill="#2b3166" />
            <path d={`M0 ${GROUND + 44}h520`} stroke="#f5b014" strokeWidth="4" strokeDasharray="22 18" />

            <g transform={`translate(0 ${GROUND - 121})`}>
              <NakaSign x={34} label="घाटकोपर नाका" width={120} />
              {PEOPLE.map((p, i) => (
                <motion.g
                  key={p.x}
                  initial={false}
                  animate={{ opacity: i < b.people ? 1 : 0, x: i < b.people ? 0 : 40 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: (PEOPLE.length - i) * 0.04 }}
                >
                  <Figure x={p.x} color={p.color} tool={p.tool} />
                </motion.g>
              ))}
            </g>

            <AnimatePresence>
              {beat === 1 ? (
                <motion.g
                  key="car"
                  initial={{ x: 600 }}
                  animate={{ x: 330 }}
                  exit={{ x: -260, transition: { duration: 0.9, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 55, damping: 15 }}
                >
                  <g transform={`translate(0 ${GROUND - 40})`}>
                    <path d="M0 40h120V18c0-7-5-12-12-14L90-12H38L18 4H8c-5 0-8 4-8 8z" fill="#e9e4da" stroke="#161a3d" strokeWidth="3" />
                    <path d="M42-6h42l14 14H28z" fill="#9fc4e4" stroke="#161a3d" strokeWidth="2" />
                    <circle cx="28" cy="42" r="11" fill="#161a3d" />
                    <circle cx="94" cy="42" r="11" fill="#161a3d" />
                  </g>
                </motion.g>
              ) : null}
            </AnimatePresence>
          </svg>

          <div className="absolute top-20 left-5 flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-3 py-1.5 font-mono text-lg font-bold shadow-[0_3px_0_0_var(--color-ink)]">
            <span className="size-2.5 rounded-full bg-bus" aria-hidden="true" />
            {b.time} {b.ampm}
          </div>
        </motion.div>

        <div className="relative flex shrink-0 flex-col justify-center bg-ink px-6 py-8 text-paper on-dark md:px-12">
          <p className="font-mono text-sm font-bold tracking-wider text-marigold uppercase">Without RozGhar · one morning</p>
          {/* All beats share one grid cell and crossfade, so the text never blanks out. */}
          <div className="mt-3 grid">
            {BEATS.map((x, i) => (
              <motion.div
                key={x.time}
                className="[grid-area:1/1]"
                initial={false}
                animate={{ opacity: i === beat ? 1 : 0, y: i === beat ? 0 : i < beat ? -14 : 14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden={i !== beat}
              >
                <h3 className="signboard-dark text-[2.4rem] sm:text-[3.4rem]">{x.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/80">{x.body}</p>
              </motion.div>
            ))}
          </div>
          <ol className="mt-8 flex gap-2" aria-hidden="true">
            {BEATS.map((x, i) => (
              <li key={x.time} className={cn("h-1.5 w-10 rounded-full transition-colors", i <= beat ? "bg-marigold" : "bg-white/20")} />
            ))}
          </ol>
          <div className="mt-8 min-h-12">
            {beat === BEATS.length - 1 ? (
              <motion.a
                href="#how"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-marigold px-4 py-3 font-bold text-ink"
              >
                RozGhar changes how this morning ends
                <ArrowDown className="size-4" aria-hidden="true" />
              </motion.a>
            ) : (
              <p className="text-sm text-paper/50">Keep scrolling. The clock moves with you.</p>
            )}
          </div>
        </div>
      </div>
      <ol className="sr-only">
        {BEATS.map((x) => (
          <li key={x.time}>
            {x.time} {x.ampm}: {x.title} {x.body}
          </li>
        ))}
      </ol>
    </section>
  );
}
