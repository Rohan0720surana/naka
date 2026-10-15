import type { Job, Lang, PayTiming, PayUnit, Provided } from "@/lib/types";
import type { TKey } from "@/lib/i18n";

export function money(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

const PERIODS: Record<Exclude<Lang, "en">, [string, string, string, string]> = {
  hi: ["सुबह", "दोपहर", "शाम", "रात"],
  mr: ["सकाळी", "दुपारी", "संध्याकाळी", "रात्री"],
};

/** "9 AM" · "सुबह 9" · "सकाळी 9" */
export function hourLabel(h: number, lang: Lang): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (lang === "en") return `${h12} ${h < 12 ? "AM" : "PM"}`;
  const p = PERIODS[lang];
  const period = h >= 4 && h < 12 ? p[0] : h >= 12 && h < 16 ? p[1] : h >= 16 && h < 20 ? p[2] : p[3];
  return `${period} ${h12}`;
}

export function hoursRange(start: number, end: number, lang: Lang): string {
  return `${hourLabel(start, lang)} – ${hourLabel(end, lang)}`;
}

export const UNIT_KEY: Record<PayUnit, TKey> = { day: "perDay", job: "perJob", month: "perMonth" };

export const TIMING_KEY: Record<PayTiming, TKey> = {
  "same-day": "paySameDay",
  weekly: "payWeekly",
  monthly: "payMonthly",
  unclear: "payUnclear",
};

export const PROVIDED_KEY: Record<Provided, TKey> = {
  tools: "provTools",
  materials: "provMaterials",
  lunch: "provLunch",
  tea: "provTea",
  travel: "provTravel",
};

export const PROVIDED_ORDER: Provided[] = ["tools", "materials", "lunch", "tea", "travel"];

export function jobTotal(job: Job): number {
  if (job.unit === "day") return job.pay * job.days;
  return job.pay;
}

export function startsKey(startsIn: number): { key: TKey; n?: number } {
  if (startsIn === 0) return { key: "startsToday" };
  if (startsIn === 1) return { key: "startsTomorrow" };
  return { key: "startsIn", n: startsIn };
}

export function agoKey(minutes: number): { key: TKey; n?: number } {
  if (minutes < 2) return { key: "justNow" };
  if (minutes < 60) return { key: "minAgo", n: Math.round(minutes) };
  return { key: "hrAgo", n: Math.round(minutes / 60) };
}

function locale(lang: Lang): string {
  return lang === "en" ? "en-IN" : `${lang}-IN-u-nu-latn`;
}

export function dayLabel(iso: string, lang: Lang): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat(locale(lang), { weekday: "short", day: "numeric", month: "short" }).format(d);
}

export function monthLabel(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { month: "long" }).format(date);
}

export function isoDaysAgo(n: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function timeOfDay(ts: number, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { hour: "numeric", minute: "2-digit" }).format(new Date(ts));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
