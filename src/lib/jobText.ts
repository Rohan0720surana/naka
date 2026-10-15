import { EMPLOYERS } from "@/lib/data/jobs";
import { AREAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { hoursRange, jobTotal, money, PROVIDED_KEY, startsKey, TIMING_KEY, UNIT_KEY } from "@/lib/format";
import { pick, translate, type TKey } from "@/lib/i18n";
import { assess } from "@/lib/risk";
import type { Job, Lang } from "@/lib/types";

const SHIELD_KEY: Record<"safe" | "careful" | "danger", TKey> = {
  safe: "shieldSafe",
  careful: "shieldCareful",
  danger: "shieldDanger",
};

export function durationText(job: Job, lang: Lang): string {
  if (job.unit === "month") return translate(lang, "filterLong");
  return job.days === 1 ? translate(lang, "oneDay") : translate(lang, "nDays", { n: job.days });
}

export function travelText(job: Job, lang: Lang): string {
  if (job.abroad) return translate(lang, "outsideIndia");
  return translate(lang, job.travel.mode, { n: job.travel.minutes });
}

/** A complete spoken summary of a job, built from structured fields. */
export function jobSpeech(job: Job, lang: Lang): string {
  const t = (k: TKey, v?: Record<string, string | number>) => translate(lang, k, v);
  const a = assess(job, EMPLOYERS[job.employerId]);
  const s = startsKey(job.startsIn);
  const provided = job.provided.length ? job.provided.map((p) => t(PROVIDED_KEY[p])).join(", ") : t("notGiven");
  const parts = [
    `${pick(TRADES[job.trade].work, lang)}, ${pick(AREAS[job.area].name, lang)}`,
    `${money(job.pay).replace("₹", "")} ${lang === "en" ? "rupees" : lang === "hi" ? "रुपये" : "रुपये"} ${t(UNIT_KEY[job.unit])}`,
    hoursRange(job.startHour, job.endHour, lang),
    `${t(s.key, { n: s.n ?? 0 })}, ${durationText(job, lang)}`,
    t(TIMING_KEY[job.payTiming]),
    provided,
    `${t("shieldTitle")}: ${t(SHIELD_KEY[a.level])}`,
  ];
  if (a.level === "danger") parts.push(t("dangerAdvice"));
  return parts.join(". ") + ".";
}

export function jobTotalText(job: Job, lang: Lang): string | null {
  if (job.unit !== "day" || job.days < 2) return null;
  return translate(lang, "jobTotal", { total: jobTotal(job).toLocaleString("en-IN") });
}

export { SHIELD_KEY };
