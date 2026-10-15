"use client";

import { Lock, RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A modern phone body around a live iframe of the worker app. */
export function PhoneFrame({
  src,
  title,
  className,
  frameKey,
}: {
  src: string;
  title: string;
  className?: string;
  frameKey?: number;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[380px] max-w-full rounded-[3rem] border-[3px] border-ink bg-ink p-3 shadow-[0_40px_80px_-30px_rgba(22,26,61,0.6)]",
        className,
      )}
    >
      <div className="absolute top-24 -left-[7px] h-14 w-1.5 rounded-l bg-ink" aria-hidden="true" />
      <div className="absolute top-44 -left-[7px] h-10 w-1.5 rounded-l bg-ink" aria-hidden="true" />
      <div className="absolute top-32 -right-[7px] h-16 w-1.5 rounded-r bg-ink" aria-hidden="true" />
      <div className="relative h-[min(780px,calc(100dvh-290px))] min-h-[520px] overflow-hidden rounded-[2.35rem] bg-paper">
        <div className="pointer-events-none absolute top-2 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
        <iframe key={frameKey} src={src} title={title} className="size-full border-0 pt-8" />
      </div>
    </div>
  );
}

/** A laptop-style browser window around the employer site. */
export function BrowserFrame({
  src,
  title,
  url,
  frameKey,
  onReload,
}: {
  src: string;
  title: string;
  url: string;
  frameKey?: number;
  onReload?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border-[3px] border-ink bg-white shadow-[0_40px_80px_-30px_rgba(22,26,61,0.5)]">
      <div className="flex items-center gap-3 border-b-2 border-ink/10 bg-sand px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <div className="flex h-8 flex-1 items-center gap-2 rounded-full bg-white px-3 text-sm text-muted">
          <Lock className="size-3.5" aria-hidden="true" />
          <span className="truncate font-bold">{url}</span>
        </div>
        {onReload ? (
          <button type="button" onClick={onReload} className="inline-flex size-8 items-center justify-center rounded-full hover:bg-white" aria-label="Reload employer view">
            <RotateCw className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <iframe key={frameKey} src={src} title={title} className="h-[min(780px,calc(100dvh-300px))] min-h-[520px] w-full border-0" />
    </div>
  );
}

export function DeviceTabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { id: T; label: ReactNode }[];
}) {
  return (
    <div role="tablist" aria-label="Device" className="mx-auto flex w-fit rounded-full border-2 border-ink bg-white p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors",
            value === t.id ? "bg-ink text-paper" : "text-ink hover:bg-sand",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
