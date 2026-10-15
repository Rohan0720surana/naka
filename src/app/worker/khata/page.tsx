"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CircleCheck, HardHat, Hourglass, Plus } from "lucide-react";
import { useState } from "react";
import { CoinDrop } from "@/components/art/Moments";
import { Sheet } from "@/components/Sheet";
import { SpeakButton } from "@/components/SpeakButton";
import { Button, Card, Chip, SectionTitle, Tag } from "@/components/ui/primitives";
import { TRADES } from "@/lib/data/trades";
import { dayLabel, isoDaysAgo, money, monthLabel } from "@/lib/format";
import { useT } from "@/lib/hooks";
import { translate } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { khataDays, useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function KhataPage() {
  const { t, lang } = useT();
  const khata = useDemo((s) => s.khata);
  const me = useDemo((s) => s.me);
  const markKhataPaid = useDemo((s) => s.markKhataPaid);
  const logged = useDemo((s) => khataDays(s));
  const [adding, setAdding] = useState(false);
  const [coinKey, setCoinKey] = useState(0);
  const markPaid = (id: string) => {
    markKhataPaid(id);
    setCoinKey((k) => k + 1);
  };

  const now = new Date();
  const monthKey = isoDaysAgo(0).slice(0, 7);
  const thisMonth = khata.filter((k) => k.date.startsWith(monthKey));
  const earned = thisMonth.filter((k) => k.paid).reduce((s, k) => s + k.amount, 0);
  const pending = khata.filter((k) => !k.paid);
  const pendingTotal = pending.reduce((s, k) => s + k.amount, 0);
  const duesBy = new Map<string, { amount: number; ids: string[] }>();
  for (const k of pending) {
    const d = duesBy.get(k.employer) ?? { amount: 0, ids: [] };
    d.amount += k.amount;
    d.ids.push(k.id);
    duesBy.set(k.employer, d);
  }
  const dues = [...duesBy.entries()];

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const iso = isoDaysAgo(29 - i);
    const rows = khata.filter((k) => k.date === iso);
    const status = rows.length === 0 ? "none" : rows.every((r) => r.paid) ? "paid" : "unpaid";
    return { iso, status };
  });

  const toGo = Math.max(0, 90 - logged);
  const pct = Math.min(1, logged / 90);
  const spoken = (l: Lang) =>
    [
      `${translate(l, "earnedMonth")}: ${money(earned)}`,
      `${translate(l, "pendingDues")}: ${money(pendingTotal)}`,
      translate(l, "bocwProgress", { n: logged }),
      toGo > 0 ? translate(l, "bocwHint", { n: toGo }) : translate(l, "bocwReady"),
    ].join(". ");

  return (
    <div className="space-y-6 pt-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.75rem] leading-tight font-extrabold">{t("khataTitle")}</h1>
          <p className="text-muted">{t("khataSub")}</p>
        </div>
        <SpeakButton say={spoken} compact />
      </header>

      <section className="relative overflow-hidden rounded-[1.6rem] border-2 border-ink bg-ink p-5 text-paper on-dark">
        <div className="absolute inset-0 ink-grain opacity-60" aria-hidden="true" />
        <div className="relative">
          <p className="text-[0.95rem] font-bold text-paper/75">
            {t("earnedMonth")} · {monthLabel(now, lang)}
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-display text-[2.8rem] leading-none font-extrabold text-marigold tabular">{money(earned)}</p>
            <CoinDrop count={5} replayKey={coinKey} className="mb-1" />
          </div>
          <p className="mt-2 font-bold">{t("daysWorked", { n: thisMonth.length })}</p>
          {pendingTotal > 0 ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 p-3">
              <span className="flex items-center gap-2 font-bold">
                <Hourglass className="size-5 text-marigold" aria-hidden="true" />
                {t("pendingDues")}
              </span>
              <span className="font-display text-xl font-extrabold">{money(pendingTotal)}</span>
            </div>
          ) : null}
        </div>
      </section>

      {dues.length ? (
        <section className="space-y-2" aria-label={t("pendingDues")}>
          {dues.map(([name, d]) => (
            <Card key={name} className="flex flex-col gap-3 border-alert/30 bg-alert-soft p-4">
              <p className="font-bold leading-snug">{t("dueFrom", { amount: d.amount.toLocaleString("en-IN"), name })}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="leaf" onClick={() => d.ids.forEach((id) => markPaid(id))}>
                  <CircleCheck className="size-4" aria-hidden="true" />
                  {t("markPaid")}
                </Button>
                <Link href="/worker/haq#problem" className="inline-flex h-10 items-center rounded-xl border-2 border-ink bg-white px-3 font-bold">
                  {t("getHelp")}
                </Link>
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="space-y-3" aria-labelledby="last30">
        <SectionTitle id="last30">{t("last30")}</SectionTitle>
        <Card className="p-4">
          <ol className="grid grid-cols-10 gap-1.5">
            {last30.map((d, i) => (
              <motion.li
                key={d.iso}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.012 }}
                title={`${dayLabel(d.iso, lang)} — ${t(d.status === "paid" ? "legendPaid" : d.status === "unpaid" ? "legendUnpaid" : "legendNone")}`}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-[0.65rem] font-extrabold",
                  d.status === "paid" && "bg-leaf text-white",
                  d.status === "unpaid" && "bg-marigold text-ink ring-2 ring-alert",
                  d.status === "none" && "bg-sand text-muted",
                )}
              >
                <span aria-hidden="true">{Number(d.iso.slice(8))}</span>
                <span className="sr-only">
                  {dayLabel(d.iso, lang)}: {t(d.status === "paid" ? "legendPaid" : d.status === "unpaid" ? "legendUnpaid" : "legendNone")}
                </span>
              </motion.li>
            ))}
          </ol>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.85rem] font-bold">
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-leaf" aria-hidden="true" /> {t("legendPaid")}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-marigold ring-2 ring-alert" aria-hidden="true" /> {t("legendUnpaid")}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-sand" aria-hidden="true" /> {t("legendNone")}
            </li>
          </ul>
        </Card>
      </section>

      <section aria-labelledby="bocw">
        <Card className="flex items-center gap-4 p-4">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-sand)" strokeWidth="12" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-leaf)"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: pct }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <HardHat className="size-5 text-leaf" aria-hidden="true" />
              <span className="font-display text-lg leading-none font-extrabold">{logged}</span>
              <span className="text-[0.65rem] font-bold text-muted">/ 90</span>
            </span>
          </div>
          <div className="min-w-0">
            <p id="bocw" className="font-display text-lg leading-tight font-extrabold">
              {t("bocwProgress", { n: logged })}
            </p>
            <p className="mt-1 text-[0.95rem] leading-snug text-muted">{toGo > 0 ? t("bocwHint", { n: toGo }) : t("bocwReady")}</p>
            <Link href="/worker/haq" className="mt-2 inline-flex items-center gap-1 font-bold text-leaf underline underline-offset-4">
              {t("navHaq")} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </section>

      <section className="space-y-3" aria-labelledby="entries">
        <SectionTitle
          id="entries"
          action={
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus className="size-5" aria-hidden="true" />
              {t("addDay")}
            </Button>
          }
        >
          {t("entries")}
        </SectionTitle>
        <ul className="divide-y-2 divide-line overflow-hidden rounded-[1.4rem] border-2 border-ink/10 bg-white shadow-card">
          {khata.slice(0, 14).map((k) => (
            <li key={k.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{dayLabel(k.date, lang)}</p>
                <p className="truncate text-[0.88rem] text-muted">{k.employer}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-extrabold tabular">{money(k.amount)}</p>
                {k.paid ? (
                  <Tag tone="leaf">{t("legendPaid")}</Tag>
                ) : (
                  <button
                    type="button"
                    onClick={() => markPaid(k.id)}
                    className="rounded-full bg-alert-soft px-2.5 py-1 text-[0.8rem] font-bold text-alert underline-offset-2 hover:underline"
                  >
                    {t("legendUnpaid")} · {t("markPaid")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AddDaySheet open={adding} onClose={() => setAdding(false)} trade={me.trade} employers={[...new Set(khata.map((k) => k.employer))].slice(0, 3)} />
    </div>
  );
}

function AddDaySheet({
  open,
  onClose,
  trade,
  employers,
}: {
  open: boolean;
  onClose: () => void;
  trade: keyof typeof TRADES;
  employers: string[];
}) {
  const { t } = useT();
  const addKhata = useDemo((s) => s.addKhata);
  const [min, max] = TRADES[trade].fairDay;
  const presets = [min, Math.round((min + max) / 2 / 50) * 50, max];
  const [day, setDay] = useState(0);
  const [who, setWho] = useState<string>(employers[0] ?? t("someoneAtNaka"));
  const [amount, setAmount] = useState(presets[1]!);
  const [paid, setPaid] = useState(true);

  return (
    <Sheet open={open} onClose={onClose} title={t("addDay")} closeLabel={t("close")}>
      <div className="space-y-5">
        <fieldset>
          <legend className="mb-2 font-bold">{t("whichDay")}</legend>
          <div className="flex gap-2">
            <Chip selected={day === 0} onClick={() => setDay(0)}>
              {t("today")}
            </Chip>
            <Chip selected={day === 1} onClick={() => setDay(1)}>
              {t("yesterday")}
            </Chip>
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-bold">{t("whoEmployer")}</legend>
          <div className="flex flex-wrap gap-2">
            {[...employers, t("someoneAtNaka")].map((e) => (
              <Chip key={e} selected={who === e} onClick={() => setWho(e)}>
                {e}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-bold">{t("howMuch")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={amount === p}
                onClick={() => setAmount(p)}
                className={cn(
                  "h-14 rounded-2xl border-2 font-display text-xl font-extrabold transition-colors",
                  amount === p ? "border-ink bg-marigold" : "border-line bg-white",
                )}
              >
                {money(p)}
              </button>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-3">
            <span className="font-display text-xl font-extrabold">₹</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="h-12 w-full bg-transparent text-lg font-bold outline-none"
              aria-label={t("howMuch")}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-bold">{t("paidAlready")}</legend>
          <div className="grid grid-cols-2 gap-2">
            <Chip selected={paid} onClick={() => setPaid(true)} className="h-14 justify-center text-lg">
              {t("yes")}
            </Chip>
            <Chip selected={!paid} onClick={() => setPaid(false)} className="h-14 justify-center text-lg">
              {t("no")}
            </Chip>
          </div>
        </fieldset>
        <Button
          size="xl"
          className="w-full"
          disabled={amount <= 0}
          onClick={() => {
            addKhata({ date: isoDaysAgo(day), employer: who, trade, amount, paid });
            onClose();
          }}
        >
          {t("saveDay")}
        </Button>
      </div>
    </Sheet>
  );
}
