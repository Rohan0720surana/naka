"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, MessageSquareText, PhoneOff, QrCode, ScanLine, Smartphone, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AreaMap } from "@/components/AreaMap";
import { Avatar } from "@/components/Avatar";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { Sheet } from "@/components/Sheet";
import { Button, Chip, Tag } from "@/components/ui/primitives";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import { MAIN_WORKER_ID } from "@/lib/data/workers";
import { money } from "@/lib/format";
import { allWorkers, useDemo } from "@/lib/store";
import type { TradeId, Worker } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FindWorkers({ initialTrade }: { initialTrade?: TradeId }) {
  const state = useDemo();
  const [trade, setTrade] = useState<TradeId | "all">(initialTrade ?? "all");
  const [freeOnly, setFreeOnly] = useState(true);
  const [sort, setSort] = useState<"near" | "rating">("near");
  const [active, setActive] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const closeScan = useCallback(() => setScanOpen(false), []);

  const workers = useMemo(
    () =>
      allWorkers(state)
        .filter((w) => (trade === "all" ? true : w.trade === trade))
        .filter((w) => (freeOnly ? w.availableToday : true))
        .sort((a, b) => (sort === "near" ? a.km - b.km : b.rating - a.rating)),
    [state, trade, freeOnly, sort],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.2rem] leading-tight font-extrabold">Workers near Powai</h1>
          <p className="text-muted">Real skills, real people who vouch for them, and their days of work — no résumés needed.</p>
        </div>
        <Button variant="ink" size="lg" onClick={() => setScanOpen(true)}>
          <QrCode className="size-5" aria-hidden="true" />
          Scan a Kaam Card
        </Button>
      </div>

      <div className="space-y-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip selected={trade === "all"} onClick={() => setTrade("all")}>
            All trades
          </Chip>
          {TRADE_ORDER.map((id) => (
            <Chip key={id} selected={trade === id} onClick={() => setTrade(id)}>
              <span className="-ml-2 flex size-8 items-center justify-center rounded-full bg-white">
                <TradeIcon trade={id} className="size-6" />
              </span>
              {TRADES[id].label.en}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip selected={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>
            <span className={cn("size-2.5 rounded-full", freeOnly ? "bg-[#3ddc84]" : "bg-muted/40")} aria-hidden="true" />
            Free today
          </Chip>
          <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
          <Chip selected={sort === "near"} onClick={() => setSort("near")}>Nearest</Chip>
          <Chip selected={sort === "rating"} onClick={() => setSort("rating")}>Best rated</Chip>
          <span className="ml-auto text-sm font-bold text-muted" aria-live="polite">
            {workers.length} workers
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <ul className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {workers.map((w, i) => (
              <motion.li
                key={w.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(i, 8) * 0.035 }}
                onMouseEnter={() => setActive(w.id)}
                onMouseLeave={() => setActive(null)}
              >
                <WorkerCard w={w} />
              </motion.li>
            ))}
          </AnimatePresence>
          {workers.length === 0 ? (
            <li className="rounded-[1.4rem] border-2 border-dashed border-line bg-white p-6 text-center sm:col-span-2">
              <p className="font-display text-lg font-extrabold">Nobody free in this trade right now</p>
              <p className="mt-1 text-muted">Turn off “Free today”, or post the work — workers get an alert, even by SMS.</p>
            </li>
          ) : null}
        </ul>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AreaMap
            label="Workers on the map"
            className="aspect-square"
            pins={[
              { id: "you", x: 52, y: 20, kind: "me", label: "You" },
              ...workers.map((w) => ({
                id: w.id,
                x: w.pin.x,
                y: w.pin.y,
                kind: "worker" as const,
                label: w.name.split(" ")[0],
                active: active === w.id,
              })),
            ]}
          />
          <p className="mt-2 text-sm text-muted">Pins show each worker&apos;s naka, not their home.</p>
        </div>
      </div>

      <ScanSheet open={scanOpen} onClose={closeScan} />
    </div>
  );
}

function WorkerCard({ w }: { w: Worker }) {
  const phone =
    w.phone === "smart"
      ? { label: "On the app", tone: "sand" as const, Icon: Smartphone }
      : w.phone === "feature"
        ? { label: "SMS only", tone: "sky" as const, Icon: MessageSquareText }
        : { label: "Via Naka Saathi", tone: "sky" as const, Icon: PhoneOff };
  return (
    <article className="relative h-full rounded-[1.4rem] border-2 border-ink/10 bg-white p-4 shadow-card transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-pop">
      <div className="flex items-start gap-3">
        <Avatar name={w.name} hue={w.hue} trade={w.trade} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg leading-tight font-extrabold">
            <Link href={`/employer/workers/${w.id}`} className="after:absolute after:inset-0 after:content-['']">
              {w.name}
            </Link>
          </h2>
          <p className="text-sm text-muted">
            {TRADES[w.trade].label.en} · {w.years} yrs
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm font-bold">
            <Star className="size-4 fill-marigold text-marigold-deep" aria-hidden="true" />
            {w.rating ? w.rating.toFixed(1) : "New"}
            <span className="font-normal text-muted">· {w.jobsDone} jobs · {w.km} km</span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag tone={w.availableToday ? "leaf" : "sand"}>{w.availableToday ? "Free today" : "Not today"}</Tag>
        <Tag tone={phone.tone} icon={<phone.Icon className="size-3.5" aria-hidden="true" />}>
          {phone.label}
        </Tag>
        {w.phoneVerified ? (
          <Tag tone="leaf" icon={<BadgeCheck className="size-3.5" aria-hidden="true" />}>
            Verified
          </Tag>
        ) : null}
        <Tag tone="marigold">~{money(w.expectedDay)}/day</Tag>
      </div>
    </article>
  );
}

function ScanSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Scan a Kaam Card" wide>
      <ScanBody onClose={onClose} />
    </Sheet>
  );
}

/** Mounted only while the sheet is open, so every scan starts fresh. */
function ScanBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [found, setFound] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setFound(true), 1700);
    const b = setTimeout(() => {
      onClose();
      router.push(`/employer/workers/${MAIN_WORKER_ID}`);
    }, 2900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onClose, router]);

  return (
    <>
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[1.4rem] border-2 border-ink bg-ink">
        <div className="absolute inset-0 ink-grain opacity-70" aria-hidden="true" />
        <div className="absolute inset-10 rounded-2xl border-4 border-dashed border-marigold/70" aria-hidden="true" />
        <motion.div
          className="absolute inset-x-10 h-1 rounded-full bg-marigold shadow-[0_0_24px_6px_rgba(245,176,20,0.6)]"
          initial={{ top: "14%" }}
          animate={{ top: ["14%", "84%", "14%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {found ? (
              <motion.div
                key="found"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl border-2 border-ink bg-marigold px-5 py-4 text-center"
              >
                <BadgeCheck className="mx-auto size-8" aria-hidden="true" />
                <p className="mt-1 font-display text-lg font-extrabold">Ramesh Yadav</p>
                <p className="text-sm font-bold">Painter · 12 yrs · Opening card…</p>
              </motion.div>
            ) : (
              <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 text-paper/80">
                <ScanLine className="size-10" aria-hidden="true" />
                <p className="font-bold">Point the camera at the card</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-muted" role="status">
        {found ? "Kaam Card found" : "Demo: the camera is simulated and finds Ramesh's card."}
      </p>
    </>
  );
}
