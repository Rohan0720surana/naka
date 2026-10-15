import { TRADES } from "@/lib/data/trades";
import type { TKey, TVars } from "@/lib/i18n";
import type { Employer, Job } from "@/lib/types";

export type RiskLevel = "safe" | "careful" | "danger";
export type FairStatus = "low" | "ok" | "above" | "suspicious";

export interface Flag {
  key: TKey;
  vars?: TVars;
  severity: "high" | "medium";
}

export interface Check {
  key: TKey;
  ok: boolean;
}

export interface Assessment {
  level: RiskLevel;
  flags: Flag[];
  checks: Check[];
  fair: FairInfo;
}

export interface FairInfo {
  range: [number, number];
  status: FairStatus;
  /** 0–1 position of this job's pay on the meter. */
  position: number;
  ratio: number;
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

/** The usual pay range for a job's trade, in the job's own pay unit. */
export function fairRange(job: Pick<Job, "trade" | "unit" | "startHour" | "endHour">): [number, number] {
  const [min, max] = TRADES[job.trade].fairDay;
  if (job.unit === "month") return [roundTo(min * 19.5, 500), roundTo(max * 19.5, 500)];
  if (job.unit === "job") {
    const hours = Math.max(2, job.endHour - job.startHour);
    return [roundTo((min * hours * 1.5) / 8, 50), roundTo((max * hours * 2.2) / 8, 50)];
  }
  return [min, max];
}

export function fairInfo(job: Pick<Job, "trade" | "unit" | "startHour" | "endHour" | "pay">): FairInfo {
  const range = fairRange(job);
  const [min, max] = range;
  const ratio = job.pay / max;
  let status: FairStatus = "ok";
  if (job.pay < min * 0.85) status = "low";
  else if (job.pay <= max) status = "ok";
  else if (job.pay <= max * 1.6) status = "above";
  else status = "suspicious";

  // Meter runs from half the usual minimum to double the usual maximum.
  const lo = min * 0.5;
  const hi = max * 2;
  const position = Math.min(1, Math.max(0, (job.pay - lo) / (hi - lo)));
  return { range, status, position, ratio };
}

export function assess(job: Job, employer: Employer | undefined): Assessment {
  const fair = fairInfo(job);
  const flags: Flag[] = [];

  if (job.feeAsked) flags.push({ key: "flagFee", vars: { amount: job.feeAsked.toLocaleString("en-IN") }, severity: "high" });
  if (job.keepsDocuments) flags.push({ key: "flagDocs", severity: "high" });
  if (fair.status === "suspicious")
    flags.push({ key: "flagTooHigh", vars: { x: Math.round(fair.ratio * 10) / 10 }, severity: "high" });
  if (job.abroad) flags.push({ key: "flagAbroad", severity: "medium" });
  if (fair.status === "low") flags.push({ key: "flagTooLow", severity: "medium" });
  if (job.payTiming === "unclear") flags.push({ key: "flagPayDay", severity: "medium" });
  if (!employer?.phoneVerified) flags.push({ key: "flagUnverified", severity: "medium" });
  if (job.vagueLocation) flags.push({ key: "flagVague", severity: "medium" });

  const level: RiskLevel = flags.some((f) => f.severity === "high")
    ? "danger"
    : flags.length > 0
      ? "careful"
      : "safe";

  const checks: Check[] = [
    { key: "chkNoFee", ok: !job.feeAsked },
    { key: "chkDocs", ok: !job.keepsDocuments },
    { key: "chkPay", ok: fair.status === "ok" || fair.status === "above" },
    { key: "chkPayDay", ok: job.payTiming !== "unclear" },
    { key: "chkPhone", ok: !!employer?.phoneVerified },
    { key: "chkPlace", ok: !job.vagueLocation },
  ];

  return { level, flags, checks, fair };
}
