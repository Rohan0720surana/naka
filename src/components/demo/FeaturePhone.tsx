"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { timeOfDay } from "@/lib/format";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const KEYS: [string, string][] = [
  ["1", ""],
  ["2", "abc"],
  ["3", "def"],
  ["4", "ghi"],
  ["5", "jkl"],
  ["6", "mno"],
  ["7", "pqrs"],
  ["8", "tuv"],
  ["9", "wxyz"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

/**
 * Arjun's button phone. RozGhar reaches him by SMS in Hindi; he answers with a
 * single key — 1 for yes, 2 for no, 0 for help.
 */
export function FeaturePhone() {
  const sms = useDemo((s) => s.sms);
  const reply = useDemo((s) => s.smsReply);
  const [gloss, setGloss] = useState(true);
  const screenRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const lastCount = useRef(sms.length);

  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight, behavior: "smooth" });
    const incoming = sms.length > lastCount.current && sms[sms.length - 1]?.from === "naka";
    lastCount.current = sms.length;
    if (incoming) void controls.start({ x: [0, -6, 6, -5, 5, -2, 0], transition: { duration: 0.5 } });
  }, [sms, controls]);

  const press = (k: string) => {
    if (["1", "2", "0"].includes(k)) reply(k);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={controls}
        className="relative w-[270px] rounded-[2.6rem] border-[3px] border-ink bg-[#252a52] px-4 pt-7 pb-6 shadow-[0_40px_80px_-30px_rgba(22,26,61,0.6)]"
      >
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-black/40" aria-hidden="true" />
        <p className="mb-2 text-center text-[0.65rem] font-extrabold tracking-[0.3em] text-white/50">ROZGHAR · SMS</p>
        <div className="overflow-hidden rounded-xl border-4 border-[#14172e] bg-[#c8d6b0] shadow-inner">
          <div className="flex items-center justify-between bg-[#b5c59b] px-2 py-1 font-mono text-[0.65rem] font-bold text-[#22301a]">
            <span aria-hidden="true">▂▄▆█</span>
            <span>Arjun Paswan</span>
            <span aria-hidden="true">▮▮▮▯</span>
          </div>
          <div
            ref={screenRef}
            className="h-[300px] space-y-2 overflow-y-auto px-2 py-2 font-deva text-[0.85rem] leading-snug text-[#1d2814]"
            aria-live="polite"
            aria-label="SMS inbox"
            tabIndex={0}
          >
            <AnimatePresence initial={false}>
              {sms.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-md border px-2 py-1.5", m.from === "me" ? "ml-10 border-[#22301a]/40 bg-[#e2ecd0] text-right" : "mr-3 border-[#22301a]/30 bg-[#d6e2c1]")}
                >
                  <p lang="hi" className="font-semibold">
                    {m.text.hi}
                  </p>
                  {gloss && m.from === "naka" ? <p className="mt-1 font-sans text-[0.7rem] leading-tight text-[#3d4c2c] italic">{m.text.en}</p> : null}
                  <p className="mt-0.5 text-right font-mono text-[0.6rem] text-[#3d4c2c]">{timeOfDay(m.at, "en")}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 items-center gap-2">
          <span className="flex h-9 items-center justify-center rounded-full bg-[#1a8f3c] text-white" aria-hidden="true">
            <Phone className="size-4" />
          </span>
          <span className="mx-auto size-10 rounded-full border-2 border-white/20 bg-[#323866]" aria-hidden="true" />
          <span className="flex h-9 items-center justify-center rounded-full bg-[#c22a2a] text-white" aria-hidden="true">
            <PhoneOff className="size-4" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Keypad: 1 yes, 2 no, 0 help">
          {KEYS.map(([k, letters]) => {
            const live = ["1", "2", "0"].includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                aria-label={k === "1" ? "1 — yes" : k === "2" ? "2 — no" : k === "0" ? "0 — help" : k}
                className={cn(
                  "flex h-11 flex-col items-center justify-center rounded-[0.9rem] border-b-4 leading-none transition-transform active:translate-y-0.5 active:border-b-2",
                  live ? "border-[#b37a00] bg-marigold text-ink" : "border-black/40 bg-[#3a4078] text-white/85",
                )}
              >
                <span className="font-display text-lg font-extrabold">{k}</span>
                {letters ? <span className="text-[0.55rem] tracking-widest uppercase opacity-60">{letters}</span> : null}
              </button>
            );
          })}
        </div>
      </motion.div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={gloss} onChange={(e) => setGloss(e.target.checked)} className="size-4 accent-[#161a3d]" />
        Show English translation
      </label>
      <p className="max-w-[270px] text-center text-sm text-muted">
        Arjun has no smartphone. RozGhar sends work by SMS in Hindi; he replies with one key: <strong>1</strong> yes, <strong>2</strong> no,{" "}
        <strong>0</strong> help.
      </p>
    </div>
  );
}
