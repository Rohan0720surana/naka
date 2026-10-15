"use client";

import { NAKAS } from "@/lib/data/places";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import { speechCode } from "@/lib/i18n";
import type { Lang, TradeId } from "@/lib/types";

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Reads text aloud in the worker's language. Marathi falls back to a Hindi voice. */
export function speak(text: string, lang: Lang, onEnd?: () => void): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const code = speechCode(lang);
  u.lang = code;
  const voices = synth.getVoices();
  const voice =
    voices.find((v) => v.lang === code) ??
    voices.find((v) => v.lang.startsWith(code.slice(0, 2))) ??
    (lang === "mr" ? voices.find((v) => v.lang.startsWith("hi")) : undefined);
  if (voice) u.voice = voice;
  u.rate = 0.92;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/* ------------------------- speech recognition ------------------------- */

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
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
  return r;
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
