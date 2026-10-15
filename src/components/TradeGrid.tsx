"use client";

import { Check } from "lucide-react";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { TRADES, TRADE_ORDER } from "@/lib/data/trades";
import type { Lang, TradeId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Big picture tiles for choosing a trade — the picture does the reading. */
export function TradeGrid({
  value,
  onChange,
  lang,
  cols = 2,
}: {
  value?: TradeId;
  onChange: (t: TradeId) => void;
  lang: Lang;
  cols?: 2 | 4;
}) {
  return (
    <div role="radiogroup" className={cn("grid gap-2.5", cols === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2")}>
      {TRADE_ORDER.map((id) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-[1.3rem] border-2 px-2 pt-4 pb-3 text-center transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
              on ? "border-ink bg-marigold shadow-[0_4px_0_0_var(--color-ink)]" : "border-ink/12 bg-white hover:border-ink/40",
            )}
          >
            <TradeIcon trade={id} className="size-14" accent={on ? "#fff" : undefined} />
            <span className="text-[1rem] leading-tight font-extrabold">{TRADES[id].label[lang]}</span>
            {lang !== "en" ? <span className="text-[0.75rem] font-bold text-muted">{TRADES[id].label.en}</span> : null}
            {on ? (
              <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-ink text-marigold">
                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
