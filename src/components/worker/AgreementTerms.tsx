"use client";

import { TRADES } from "@/lib/data/trades";
import { AREAS } from "@/lib/data/places";
import { hoursRange, money, PROVIDED_KEY, startsKey, TIMING_KEY, UNIT_KEY } from "@/lib/format";
import { durationText, jobTotalText } from "@/lib/jobText";
import { pick, translate, type TKey } from "@/lib/i18n";
import type { Job, Lang } from "@/lib/types";

export function agreementRows(job: Job, lang: Lang): { key: TKey; value: string }[] {
  const t = (k: TKey, v?: Record<string, string | number>) => translate(lang, k, v);
  const s = startsKey(job.startsIn);
  const total = jobTotalText(job, lang);
  const mode = { cash: t("modeCash"), upi: t("modeUpi"), bank: t("modeBank") }[job.payMode];
  return [
    { key: "termWork", value: pick(TRADES[job.trade].work, lang) },
    { key: "termPlace", value: `${pick(AREAS[job.area].name, lang)} — ${job.landmark}` },
    { key: "termStart", value: `${t(s.key, { n: s.n ?? 0 })} · ${durationText(job, lang)}` },
    { key: "termHours", value: hoursRange(job.startHour, job.endHour, lang) },
    { key: "termPay", value: `${money(job.pay)} ${t(UNIT_KEY[job.unit])}${total ? ` · ${total}` : ""}` },
    { key: "termPaid", value: `${t(TIMING_KEY[job.payTiming])} · ${mode}` },
    { key: "termGiven", value: job.provided.length ? job.provided.map((p) => t(PROVIDED_KEY[p])).join(", ") : t("notGiven") },
    { key: "termCancel", value: t("cancelRule") },
  ];
}

export function agreementSpeech(job: Job, lang: Lang): string {
  return agreementRows(job, lang)
    .map((r) => `${translate(lang, r.key)}: ${r.value}`)
    .join(". ");
}

/** The terms of a deal, laid out like a printed chit both sides keep. */
export function AgreementTerms({ job, lang }: { job: Job; lang: Lang }) {
  return (
    <dl className="divide-y-2 divide-dashed divide-line">
      {agreementRows(job, lang).map((r) => (
        <div key={r.key} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5">
          <dt className="font-mono text-[0.85rem] font-bold text-muted">{translate(lang, r.key)}</dt>
          <dd className="text-[1rem] leading-snug font-bold text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
