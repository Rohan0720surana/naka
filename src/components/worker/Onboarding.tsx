"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Hand, LoaderCircle, MapPin, Mic, Minus, Plus, Smartphone, Sparkles, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { SpeakButton } from "@/components/SpeakButton";
import { TradeGrid } from "@/components/TradeGrid";
import { KaamCard } from "@/components/worker/KaamCard";
import { Button, Chip } from "@/components/ui/primitives";
import { NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { useT } from "@/lib/hooks";
import { LANGS, translate } from "@/lib/i18n";
import { EXAMPLE_SAYING, getRecognition, parseSaying, speak, stopSpeaking } from "@/lib/speech";
import { khataDays, useDemo } from "@/lib/store";
import type { Lang, PhoneKind, TradeId } from "@/lib/types";
import { cn } from "@/lib/utils";

type Step = "lang" | "welcome" | "voice" | "trade" | "years" | "naka" | "name" | "done";
const PROGRESS: Step[] = ["trade", "years", "naka", "name"];

export function Onboarding({ assisted }: { assisted: boolean }) {
  const { t, p, lang } = useT();
  const router = useRouter();
  const setLang = useDemo((s) => s.setLang);
  const completeOnboarding = useDemo((s) => s.completeOnboarding);
  const registerAssisted = useDemo((s) => s.registerAssisted);
  const me = useDemo((s) => s.me);
  const days = useDemo((s) => khataDays(s));

  const [step, setStep] = useState<Step>(assisted ? "welcome" : "lang");
  const [history, setHistory] = useState<Step[]>([]);
  const [trade, setTrade] = useState<TradeId | undefined>();
  const [years, setYears] = useState(5);
  const [naka, setNaka] = useState<string>("ghatkopar-naka");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [verify, setVerify] = useState<"idle" | "busy" | "ok">("idle");
  const [phoneKind, setPhoneKind] = useState<PhoneKind>("feature");

  const go = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
  };
  const back = () => {
    const prev = history[history.length - 1];
    if (!prev) return router.push(assisted ? "/saathi" : "/worker");
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  const progressIndex = PROGRESS.indexOf(step);

  const finish = () => {
    if (!trade) return;
    if (assisted) {
      registerAssisted({ name: name.trim(), trade, years, naka, phone: phoneKind });
    } else {
      completeOnboarding({ name: name.trim(), trade, years, naka });
    }
    go("done");
  };

  return (
    <div className="flex min-h-dvh flex-col pt-3">
      {step !== "lang" && step !== "done" ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            className="-ml-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-sand"
            aria-label={t("back")}
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </button>
          {progressIndex >= 0 ? (
            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {PROGRESS.map((s, i) => (
                  <span key={s} className={cn("h-2 flex-1 rounded-full transition-colors duration-300", i <= progressIndex ? "bg-marigold" : "bg-sand-2")} />
                ))}
              </div>
              <span className="text-sm font-bold text-muted">{t("obStep", { a: progressIndex + 1, b: PROGRESS.length })}</span>
            </div>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      ) : null}

      {assisted && step !== "done" ? (
        <p className="mt-2 flex items-center gap-2 rounded-xl bg-sky-soft px-3 py-2 text-[0.9rem] font-bold text-sky">
          <Users className="size-4" aria-hidden="true" />
          {t("obAssisted")}
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28, transition: { duration: 0.15 } }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          {step === "lang" ? (
            <LanguageStep
              onPick={(l) => {
                setLang(l);
                speak(translate(l, "obWelcome"), l);
                go("welcome");
              }}
            />
          ) : null}

          {step === "welcome" ? (
            <div className="flex flex-1 flex-col pt-6">
              <NakaScene />
              <h1 className="mt-6 font-display text-[2rem] leading-tight font-extrabold">{t("obWelcome")}</h1>
              <p className="mt-2 text-[1.1rem] leading-snug text-muted">{t("obWelcomeSub")}</p>
              <SpeakButton text={`${t("obWelcome")}. ${t("obWelcomeSub")}. ${t("obHow")}`} className="mt-4 self-start" />
              <h2 className="mt-7 font-display text-xl font-extrabold">{t("obHow")}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <BigChoice icon={<Mic className="size-9" aria-hidden="true" />} title={t("obSpeak")} sub={t("obSpeakSub")} onClick={() => go("voice")} primary />
                <BigChoice icon={<Hand className="size-9" aria-hidden="true" />} title={t("obTap")} sub={t("obTapSub")} onClick={() => go("trade")} />
              </div>
            </div>
          ) : null}

          {step === "voice" ? (
            <VoiceStep
              onDone={(r) => {
                if (r.trade) setTrade(r.trade);
                if (r.years) setYears(r.years);
                if (r.naka) setNaka(r.naka);
                go(r.trade ? "name" : "trade");
              }}
            />
          ) : null}

          {step === "trade" ? (
            <StepBody title={t("obTradeQ")}>
              <TradeGrid
                value={trade}
                lang={lang}
                onChange={(tr) => {
                  setTrade(tr);
                  speak(TRADES[tr].label[lang], lang);
                  setTimeout(() => go("years"), 260);
                }}
              />
            </StepBody>
          ) : null}

          {step === "years" ? (
            <StepBody title={t("obYearsQ")} footer={<Button size="xl" className="w-full" onClick={() => go("naka")}>{t("next")}</Button>}>
              <div className="flex items-center justify-center gap-5 py-4">
                <Button variant="outline" size="xl" className="size-16 px-0" onClick={() => setYears((y) => Math.max(0, y - 1))} aria-label="−1">
                  <Minus className="size-7" aria-hidden="true" />
                </Button>
                <div className="w-32 text-center" aria-live="polite">
                  <motion.span key={years} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="block font-display text-[4.5rem] leading-none font-extrabold tabular">
                    {years}
                  </motion.span>
                  <span className="font-bold text-muted">{t("yearsShort", { n: "" }).trim() || "yrs"}</span>
                </div>
                <Button variant="outline" size="xl" className="size-16 px-0" onClick={() => setYears((y) => Math.min(50, y + 1))} aria-label="+1">
                  <Plus className="size-7" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 3, 5, 10, 15, 20].map((n) => (
                  <Chip key={n} selected={years === n} onClick={() => setYears(n)} className="min-w-14 justify-center text-lg">
                    {n === 20 ? "20+" : n}
                  </Chip>
                ))}
              </div>
            </StepBody>
          ) : null}

          {step === "naka" ? (
            <StepBody title={t("obNakaQ")}>
              <div className="grid gap-2.5">
                {Object.values(NAKAS).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={naka === n.id}
                    onClick={() => {
                      setNaka(n.id);
                      setTimeout(() => go("name"), 220);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-[1.3rem] border-2 p-4 text-left transition-colors",
                      naka === n.id ? "border-ink bg-marigold" : "border-ink/12 bg-white hover:border-ink/40",
                    )}
                  >
                    <MapPin className="size-7 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="block font-display text-lg leading-tight font-extrabold">{p(n.name)}</span>
                      <span className="text-[0.9rem] text-muted">{p(n.spot)}</span>
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go("name")}
                  className="rounded-[1.3rem] border-2 border-dashed border-ink/25 p-4 text-left font-bold text-muted hover:border-ink/50"
                >
                  {t("obMoving")}
                </button>
              </div>
            </StepBody>
          ) : null}

          {step === "name" ? (
            <StepBody
              title={t("obNameQ")}
              footer={
                <Button
                  size="xl"
                  className="w-full"
                  disabled={name.trim().length < 2 || !trade || (!assisted && verify !== "ok")}
                  onClick={finish}
                >
                  <Sparkles className="size-6" aria-hidden="true" />
                  {t("obMakeCard")}
                </Button>
              }
            >
              {trade ? (
                <div className="mb-4 flex items-center gap-3 rounded-[1.2rem] bg-sand p-3">
                  <TradeIcon trade={trade} className="size-11" />
                  <div className="font-bold">
                    <p>{p(TRADES[trade].label)}</p>
                    <p className="text-[0.9rem] text-muted">
                      {t("yearsExp", { n: years })} · {p(NAKAS[naka]?.name)}
                    </p>
                  </div>
                </div>
              ) : null}
              <label className="block">
                <span className="mb-1.5 block font-bold">{t("obName")}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Ramesh Yadav"
                  className="h-14 w-full rounded-2xl border-2 border-ink/20 bg-white px-4 text-lg font-bold outline-none focus:border-ink"
                />
              </label>
              {assisted ? (
                <fieldset className="mt-5">
                  <legend className="mb-2 font-bold">{t("obPhoneType")}</legend>
                  <div className="grid gap-2">
                    {(["feature", "none", "smart"] as const).map((k) => (
                      <Chip key={k} selected={phoneKind === k} onClick={() => setPhoneKind(k)} className="h-12 justify-start">
                        <Smartphone className="size-5" aria-hidden="true" />
                        {t(k === "smart" ? "phoneSmart" : k === "feature" ? "phoneFeature" : "phoneNone")}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <label className="mt-5 block">
                  <span className="mb-1.5 block font-bold">{t("obPhone")}</span>
                  <span className="flex gap-2">
                    <span className="flex h-14 flex-1 items-center rounded-2xl border-2 border-ink/20 bg-white focus-within:border-ink">
                      <span className="pl-4 font-bold text-muted">+91</span>
                      <input
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setVerify("idle");
                        }}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="98XXXXXXXX"
                        className="h-full w-full bg-transparent px-2 text-lg font-bold tracking-wider outline-none"
                      />
                    </span>
                    <Button
                      variant={verify === "ok" ? "leaf" : "ink"}
                      size="lg"
                      disabled={phone.length !== 10 || verify !== "idle"}
                      onClick={() => {
                        setVerify("busy");
                        setTimeout(() => setVerify("ok"), 1100);
                      }}
                    >
                      {verify === "busy" ? (
                        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                      ) : verify === "ok" ? (
                        <BadgeCheck className="size-5" aria-hidden="true" />
                      ) : null}
                      {verify === "ok" ? t("obVerified") : t("obVerify")}
                    </Button>
                  </span>
                  <span className="mt-2 block text-[0.9rem] leading-snug text-muted">{t("obPhoneHint")}</span>
                </label>
              )}
            </StepBody>
          ) : null}

          {step === "done" ? (
            <div className="flex flex-1 flex-col pt-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-ink bg-leaf text-white"
              >
                <BadgeCheck className="size-9" aria-hidden="true" />
              </motion.div>
              <h1 className="mt-4 text-center font-display text-[1.8rem] leading-tight font-extrabold">
                {assisted ? t("obAssistDone") : t("obDoneTitle")}
              </h1>
              {assisted ? null : <p className="mt-2 text-center text-[1.05rem] leading-snug text-muted">{t("obDoneSub")}</p>}
              {assisted ? null : (
                <motion.div initial={{ y: 40, rotate: 3, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", damping: 16, delay: 0.15 }} className="mt-6">
                  <KaamCard worker={me} lang={lang} daysLogged={me.id === "ramesh" ? days : 0} />
                </motion.div>
              )}
              <Button size="xl" className="mt-6 w-full" onClick={() => router.push(assisted ? "/saathi" : "/worker")}>
                {assisted ? t("obBackToSaathi") : t("obGoWork")}
              </Button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepBody({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col pt-5">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">{title}</h1>
        <SpeakButton text={title} compact />
      </div>
      <div className="mt-5 flex-1">{children}</div>
      {footer ? <div className="sticky bottom-0 mt-6 bg-paper pt-2 pb-4">{footer}</div> : null}
    </div>
  );
}

function BigChoice({
  icon,
  title,
  sub,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-[1.4rem] border-2 border-ink p-5 text-center btn-sign",
        primary ? "bg-marigold" : "bg-white",
      )}
    >
      <span className={cn("flex size-16 items-center justify-center rounded-full", primary ? "bg-ink text-marigold" : "bg-sand")}>{icon}</span>
      <span className="font-display text-lg leading-tight font-extrabold">{title}</span>
      <span className="text-[0.85rem] leading-tight font-bold text-ink/70">{sub}</span>
    </button>
  );
}

function LanguageStep({ onPick }: { onPick: (l: Lang) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-8">
      <LogoMark className="size-14" />
      <h1 className="mt-6 font-display text-[1.9rem] leading-[1.15] font-extrabold">
        <span lang="hi" className="block">भाषा चुनें</span>
        <span lang="mr" className="block text-ink-3">भाषा निवडा</span>
        <span className="block text-muted">Choose your language</span>
      </h1>
      <ul className="mt-7 grid gap-3">
        {LANGS.map((l, i) => (
          <motion.li key={l.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
            <button
              type="button"
              lang={l.id}
              onClick={() => onPick(l.id)}
              className="flex w-full items-center justify-between rounded-[1.4rem] border-2 border-ink bg-white px-5 py-5 text-left btn-sign hover:bg-marigold-soft"
            >
              <span className="font-display text-[1.8rem] leading-none font-extrabold">{l.native}</span>
              <span className="text-sm font-bold text-muted">{l.english}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-muted">বাংলা · தமிழ் · తెలుగు · ગુજરાતી — soon</p>
    </div>
  );
}

function VoiceStep({ onDone }: { onDone: (r: ReturnType<typeof parseSaying>) => void }) {
  const { t, p, lang } = useT();
  const [state, setState] = useState<"idle" | "listening" | "typing" | "heard" | "nomic">("idle");
  const [text, setText] = useState("");
  const recRef = useRef<ReturnType<typeof getRecognition>>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      recRef.current?.stop();
      timers.current.forEach(clearTimeout);
      stopSpeaking();
    },
    [],
  );

  const result = parseSaying(text);

  const playExample = () => {
    const words = EXAMPLE_SAYING[lang].split(" ");
    setText("");
    setState("typing");
    speak(EXAMPLE_SAYING[lang], lang);
    words.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setText(words.slice(0, i + 1).join(" "));
          if (i === words.length - 1) setState("heard");
        }, 260 * (i + 1)),
      );
    });
  };

  const listen = () => {
    const rec = getRecognition(lang);
    if (!rec) {
      setState("nomic");
      return;
    }
    recRef.current = rec;
    setText("");
    setState("listening");
    let finalText = "";
    rec.onresult = (e) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i]![0]!.transcript;
      finalText = s;
      setText(s);
    };
    rec.onerror = () => setState("nomic");
    rec.onend = () => setState(finalText ? "heard" : "nomic");
    try {
      rec.start();
    } catch {
      setState("nomic");
    }
  };

  return (
    <div className="flex flex-1 flex-col pt-5">
      <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">{t("obSayPrompt")}</h1>
      <p className="mt-2 text-[1.05rem] text-muted">{t("obExample")}</p>

      <div className="flex flex-col items-center py-8">
        <button
          type="button"
          onClick={state === "listening" ? () => recRef.current?.stop() : listen}
          aria-pressed={state === "listening"}
          aria-label={state === "listening" ? t("obListening") : t("obTapToSpeak")}
          className="relative flex size-36 items-center justify-center rounded-full border-4 border-ink bg-marigold shadow-[0_6px_0_0_var(--color-ink)] transition-transform active:translate-y-1"
        >
          {state === "listening"
            ? [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border-4 border-marigold"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                />
              ))
            : null}
          <Mic className="size-16" aria-hidden="true" />
        </button>
        <p className="mt-5 font-display text-lg font-extrabold" aria-live="polite">
          {state === "listening" ? t("obListening") : t("obTapToSpeak")}
        </p>
        {state === "nomic" ? <p className="mt-2 max-w-xs text-center text-[0.95rem] text-alert">{t("obNoMic")}</p> : null}
        <Button variant="outline" size="md" className="mt-4" onClick={playExample} disabled={state === "typing" || state === "listening"}>
          {t("obPlayExample")}
        </Button>
      </div>

      {text ? (
        <div className="rounded-[1.3rem] border-2 border-ink/15 bg-white p-4">
          <p className="text-sm font-bold text-muted">{t("obHeard")}</p>
          <p className="mt-1 text-[1.15rem] leading-snug font-bold">
            “{text}
            {state === "typing" || state === "listening" ? <span className="animate-blink">▍</span> : null}”
          </p>
        </div>
      ) : null}

      {state === "heard" ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-[1.3rem] border-2 border-ink bg-marigold-soft p-4">
          <p className="text-sm font-bold text-muted">{t("obFound")}</p>
          {result.trade || result.years || result.naka ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {result.trade ? (
                <li className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white py-1 pr-3 pl-1 font-bold">
                  <TradeIcon trade={result.trade} className="size-7" />
                  {p(TRADES[result.trade].label)}
                </li>
              ) : null}
              {result.years ? (
                <li className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-bold">{t("yearsExp", { n: result.years })}</li>
              ) : null}
              {result.naka ? (
                <li className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-bold">{p(NAKAS[result.naka]?.name)}</li>
              ) : null}
            </ul>
          ) : (
            <p className="mt-1 font-bold text-alert">{t("notRecognised")}</p>
          )}
          <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
            <Button variant="outline" onClick={() => { setText(""); setState("idle"); }}>
              {t("obTryAgain")}
            </Button>
            <Button onClick={() => onDone(result)}>{t("obLooksRight")}</Button>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

/** A drawn naka at dawn: the scene every worker recognises. */
function NakaScene() {
  return (
    <svg viewBox="0 0 360 170" className="w-full rounded-[1.4rem] border-2 border-ink bg-[#fde9b8]" role="img" aria-label="Workers waiting at a naka at sunrise">
      <circle cx="285" cy="62" r="32" fill="#f5b014" />
      <path d="M0 120h360v50H0z" fill="#161a3d" />
      <path d="M0 116h360v8H0z" fill="#2b3166" />
      <g fill="#2b3166" opacity=".35">
        <rect x="18" y="40" width="46" height="76" />
        <rect x="70" y="22" width="34" height="94" />
        <rect x="112" y="54" width="54" height="62" />
        <rect x="320" y="34" width="34" height="82" />
      </g>
      {[
        { x: 150, c: "#c98200", tool: "roller" },
        { x: 190, c: "#137a3a", tool: "none" },
        { x: 228, c: "#b4232b", tool: "spade" },
        { x: 262, c: "#2456c9", tool: "none" },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} 0)`}>
          <circle cx="0" cy="64" r="9" fill="#161a3d" />
          <path d="M-11 112v-26a11 11 0 0 1 22 0v26z" fill={p.c} stroke="#161a3d" strokeWidth="3" />
          <path d="M-7 112v8M7 112v8" stroke="#161a3d" strokeWidth="5" strokeLinecap="round" />
          {p.tool === "roller" ? <path d="M12 82l10-16h10" stroke="#161a3d" strokeWidth="3" fill="none" /> : null}
          {p.tool === "spade" ? <path d="M13 70v44M8 112h10" stroke="#161a3d" strokeWidth="3" /> : null}
        </g>
      ))}
      <g transform="translate(40 66)">
        <rect x="0" y="0" width="70" height="30" rx="5" fill="#f5b014" stroke="#161a3d" strokeWidth="3" />
        <text x="35" y="21" textAnchor="middle" fontFamily="var(--font-baloo)" fontWeight="800" fontSize="16" fill="#161a3d">
          नाका
        </text>
        <path d="M35 30v24" stroke="#161a3d" strokeWidth="4" />
      </g>
    </svg>
  );
}
