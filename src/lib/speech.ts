"use client";

import { NAKAS } from "@/lib/data/places";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import { speechCode } from "@/lib/i18n";
import type { Lang, TradeId } from "@/lib/types";

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

/* ----------------------------- voice catalogue ----------------------------- */

let voices: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (canSpeak()) voices = window.speechSynthesis.getVoices();
}

if (canSpeak()) {
  refreshVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
}

/** Browsers load voices lazily: the list is empty until `voiceschanged` fires. */
function voicesReady(): Promise<void> {
  refreshVoices();
  if (voices.length > 0 || !canSpeak()) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      refreshVoices();
      resolve();
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", done, { once: true });
    setTimeout(done, 1200);
  });
}

/** Which voice languages to try, in order. Marathi can be read by a Hindi voice: same script. */
const VOICE_ORDER: Record<Lang, string[]> = {
  hi: ["hi-in", "hi"],
  mr: ["mr-in", "mr", "hi-in", "hi"],
  en: ["en-in", "en-gb", "en-us", "en"],
};

/** Prefer natural-sounding voices (Edge "Natural", Google) over robotic ones. */
function quality(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  return (n.includes("natural") ? 4 : 0) + (n.includes("google") ? 3 : 0) + (n.includes("online") ? 1 : 0);
}

export function findVoice(lang: Lang): SpeechSynthesisVoice | null {
  for (const code of VOICE_ORDER[lang]) {
    const matches = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(code));
    if (matches.length) return matches.sort((a, b) => quality(b) - quality(a))[0]!;
  }
  return null;
}

/** True when the device can read this language aloud with a proper voice. */
export function hasVoiceFor(lang: Lang): boolean {
  return findVoice(lang) !== null;
}

/* ------------------------------ text clean-up ------------------------------ */

const WORDS: Record<Lang, { rupees: string; to: string; km: string }> = {
  en: { rupees: "rupees", to: " to ", km: " kilometres" },
  hi: { rupees: "रुपये", to: " से ", km: " किलोमीटर" },
  mr: { rupees: "रुपये", to: " ते ", km: " किलोमीटर" },
};

/** Turns screen text into something a voice reads naturally: no symbols, no dashes. */
export function toSpeakable(text: string, lang: Lang): string {
  const w = WORDS[lang];
  return text
    .replace(/₹\s?([\d,]+)/g, (_, n: string) => `${n} ${w.rupees}`)
    .replace(/₹/g, ` ${w.rupees} `)
    .replace(/\s*–\s*/g, w.to)
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s*·\s*/g, ", ")
    .replace(/[→↗★✓✗“”"]/g, "")
    .replace(/(\d)\s?km\b/g, `$1${w.km}`)
    .replace(/\s+([,.।?!])/g, "$1")
    .replace(/([?!।.])[.।]+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Long utterances get cut off in Chrome after ~15 seconds, so text is read
 * sentence by sentence.
 */
function chunk(text: string): string[] {
  const sentences = text.split(/(?<=[.!?।])\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (s.length > 220) {
      if (cur) out.push(cur);
      cur = "";
      out.push(...s.split(/(?<=,)\s+/));
      continue;
    }
    if ((cur + " " + s).trim().length > 160) {
      if (cur) out.push(cur);
      cur = s;
    } else cur = (cur + " " + s).trim();
  }
  if (cur) out.push(cur);
  return out;
}

/* ------------------------------- speaking -------------------------------- */

let activeId: string | null = null;
let session = 0;
const listeners = new Set<() => void>();

function setActive(id: string | null) {
  activeId = id;
  listeners.forEach((l) => l());
}

export function subscribeSpeech(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Which Listen button is currently speaking, if any. */
export function getActiveSpeech() {
  return activeId;
}

export interface SpeakResult {
  ok: boolean;
  /** The language actually spoken. */
  lang: Lang;
  /** True when the device had no voice for the requested language and English was used instead. */
  fellBack: boolean;
}

/**
 * Reads text aloud in the worker's language. `say` builds the text for a
 * language, so if the device has no Hindi or Marathi voice the same content
 * can be read in English instead of an English voice mangling Devanagari.
 */
export async function speakAs(id: string, say: (lang: Lang) => string, lang: Lang, onEnd?: () => void): Promise<SpeakResult> {
  if (!canSpeak()) return { ok: false, lang, fellBack: false };
  const synth = window.speechSynthesis;
  synth.cancel();
  const mine = ++session;
  setActive(id);
  await voicesReady();
  if (mine !== session) return { ok: true, lang, fellBack: false };

  let useLang = lang;
  let voice = findVoice(lang);
  let fellBack = false;
  if (!voice && lang !== "en" && voices.length > 0) {
    const en = findVoice("en");
    if (en) {
      voice = en;
      useLang = "en";
      fellBack = true;
    }
  }

  const parts = chunk(toSpeakable(say(useLang), useLang));
  if (parts.length === 0) {
    setActive(null);
    return { ok: false, lang: useLang, fellBack };
  }
  const finish = () => {
    if (mine !== session) return;
    setActive(null);
    onEnd?.();
  };
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else u.lang = speechCode(useLang);
    u.rate = useLang === "en" ? 0.95 : 0.9;
    if (i === parts.length - 1) u.onend = finish;
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") finish();
    };
    synth.speak(u);
  });
  // Chrome occasionally leaves the queue paused after a cancel.
  synth.resume();
  return { ok: true, lang: useLang, fellBack };
}

/** Fire-and-forget speech for small confirmations (language picked, trade tapped). */
export function speak(say: (lang: Lang) => string, lang: Lang, onEnd?: () => void): void {
  void speakAs("auto", say, lang, onEnd);
}

export function stopSpeaking() {
  session++;
  setActive(null);
  if (canSpeak()) window.speechSynthesis.cancel();
}

/* ------------------------- speech recognition ------------------------- */

export type RecognitionError = "denied" | "no-speech" | "network" | "unsupported" | "other";

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

export function getRecognition(lang: Lang): RecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = speechCode(lang);
  r.interimResults = true;
  r.continuous = false;
  r.maxAlternatives = 1;
  return r;
}

/** Maps the browser's recognition error codes to what we tell the worker. */
export function recognitionError(code: string | undefined): RecognitionError {
  if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture") return "denied";
  if (code === "no-speech" || code === "aborted") return "no-speech";
  if (code === "network") return "network";
  return "other";
}

/** What a worker might say, used when no microphone is available. */
export const EXAMPLE_SAYING: Record<Lang, string> = {
  en: "I am a painter, I have 12 years of experience, I stand at Ghatkopar naka",
  hi: "मैं पेंटर हूँ, बारह साल का अनुभव है, घाटकोपर नाके पर खड़ा होता हूँ",
  mr: "मी रंगारी आहे, बारा वर्षांचा अनुभव आहे, घाटकोपर नाक्यावर उभा असतो",
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "पाँच": 5, "छह": 6, "छः": 6, "सात": 7, "आठ": 8,
  "नौ": 9, "दस": 10, "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15, "सोलह": 16,
  "सत्रह": 17, "अठारह": 18, "उन्नीस": 19, "बीस": 20, "तीस": 30,
  "दोन": 2, "पाच": 5, "सहा": 6, "नऊ": 9, "दहा": 10, "अकरा": 11, "बारा": 12, "तेरा": 13,
  "चौदा": 14, "पंधरा": 15, "सोळा": 16, "सतरा": 17, "अठरा": 18, "एकोणीस": 19, "वीस": 20,
};

export interface ParsedProfile {
  trade?: TradeId;
  years?: number;
  naka?: string;
}

/** Pulls trade, years and naka out of free speech in English, Hindi or Marathi. */
export function parseSaying(text: string): ParsedProfile {
  const lower = text.toLowerCase();
  const out: ParsedProfile = {};

  for (const id of TRADE_ORDER) {
    if (TRADES[id].says.some((w) => lower.includes(w.toLowerCase()))) {
      out.trade = id;
      break;
    }
  }

  const digits = lower.match(/(\d{1,2})\s*(years?|yrs?|saal|साल|वर्ष|वर्षे|वर्षां)/);
  if (digits) out.years = Number(digits[1]);
  else {
    const anyDigits = lower.match(/\b(\d{1,2})\b/);
    if (anyDigits) out.years = Number(anyDigits[1]);
    else {
      const tokens = lower.split(/[\s,.।]+/);
      for (const tok of tokens) {
        if (NUMBER_WORDS[tok] !== undefined) {
          out.years = NUMBER_WORDS[tok];
          break;
        }
      }
    }
  }

  for (const naka of Object.values(NAKAS)) {
    const names = [naka.name.en, naka.name.hi, naka.name.mr].map((n) => n.split(" ")[0]!.toLowerCase());
    if (names.some((n) => lower.includes(n))) {
      out.naka = naka.id;
      break;
    }
  }
  return out;
}
