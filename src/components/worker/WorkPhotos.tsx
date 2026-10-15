"use client";

import { useId, useState } from "react";
import { useT } from "@/lib/hooks";

/**
 * Before/after of a repainted room. A real range input drives the split, so
 * it works with touch, mouse and keyboard alike.
 */
export function BeforeAfter() {
  const { t } = useT();
  const [split, setSplit] = useState(55);
  const id = useId();
  return (
    <figure className="overflow-hidden rounded-[1.2rem] border-2 border-ink bg-white">
      <div className="relative aspect-[4/3] select-none">
        <Room variant="after" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Room variant="before" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_0_2px_var(--color-ink)]" style={{ left: `${split}%` }}>
          <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-marigold font-extrabold">
            ⇆
          </span>
        </div>
        <span className="absolute top-2 left-2 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">{t("before")}</span>
        <span className="absolute top-2 right-2 rounded-full bg-leaf px-2.5 py-1 text-xs font-bold text-white">{t("after")}</span>
        <label htmlFor={id} className="sr-only">
          {t("dragCompare")}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="flex items-center justify-between px-3 py-2 text-[0.85rem] font-bold text-muted">
        <span>Vidyavihar · 2BHK</span>
        <span>{t("dragCompare")}</span>
      </figcaption>
    </figure>
  );
}

function Room({ variant }: { variant: "before" | "after" }) {
  const before = variant === "before";
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="400" height="300" fill={before ? "#b9b2a3" : "#f6e7c4"} />
      <rect x="0" y="0" width="400" height="40" fill={before ? "#a39b8b" : "#fbf1d9"} />
      {before ? (
        <g opacity="0.55">
          <path d="M60 60c20 10 10 40 40 50s30 40 10 60" stroke="#6f6656" strokeWidth="5" fill="none" />
          <ellipse cx="300" cy="90" rx="46" ry="30" fill="#8e8574" />
          <ellipse cx="120" cy="200" rx="30" ry="18" fill="#8e8574" />
          <path d="M240 150l20 30-14 20" stroke="#6f6656" strokeWidth="4" fill="none" />
        </g>
      ) : (
        <rect x="0" y="40" width="400" height="12" fill="#e9c46a" />
      )}
      <rect x="230" y="70" width="110" height="110" rx="6" fill={before ? "#8fa3ad" : "#bfe3f2"} stroke="#161a3d" strokeWidth="6" />
      <path d="M285 70v110M230 125h110" stroke="#161a3d" strokeWidth="5" />
      <rect x="0" y="238" width="400" height="62" fill={before ? "#7c6f5c" : "#c98f5a"} />
      <rect x="40" y="190" width="150" height="60" rx="14" fill={before ? "#6b6a7a" : "#2b3166"} />
      <rect x="52" y="168" width="126" height="34" rx="12" fill={before ? "#7d7c8c" : "#4a5190"} />
      <rect x="150" y="176" width="22" height="22" rx="6" fill={before ? "#a39b8b" : "#f5b014"} />
    </svg>
  );
}

const TILES = [
  { title: "Texture wall · Ghatkopar", bg: "#2b3166", stripe: "#f5b014" },
  { title: "Grill enamel · Kurla", bg: "#137a3a", stripe: "#e2f3e7" },
];

export function WorkTiles() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TILES.map((tile, i) => (
        <figure key={tile.title} className="overflow-hidden rounded-[1.2rem] border-2 border-ink/15 bg-white">
          <svg viewBox="0 0 200 140" className="aspect-[10/7] w-full" aria-hidden="true">
            <rect width="200" height="140" fill={tile.bg} />
            {i === 0
              ? Array.from({ length: 9 }, (_, k) => (
                  <path
                    key={k}
                    d={`M${-20 + k * 28} 140 Q ${k * 28} ${70 + (k % 3) * 8} ${20 + k * 28} 0`}
                    stroke={tile.stripe}
                    strokeOpacity="0.5"
                    strokeWidth="7"
                    fill="none"
                  />
                ))
              : Array.from({ length: 8 }, (_, k) => (
                  <g key={k}>
                    <rect x={14 + k * 23} y="18" width="8" height="104" rx="3" fill={tile.stripe} />
                    <circle cx={18 + k * 23} cy="70" r="7" fill="none" stroke={tile.stripe} strokeWidth="3" />
                  </g>
                ))}
          </svg>
          <figcaption className="px-3 py-2 text-[0.82rem] font-bold text-muted">{tile.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
