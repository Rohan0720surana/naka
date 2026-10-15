"use client";

import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { LogoMark } from "@/components/brand/Logo";
import { TradeIcon } from "@/components/icons/TradeIcon";
import { AREAS, NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { useOrigin } from "@/lib/hooks";
import { pick, translate } from "@/lib/i18n";
import type { Lang, Worker } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The Kaam Card: a visiting card for people who never had one. Built to be
 * shown at the naka, printed for a toolbox, or scanned by an employer.
 */
export function KaamCard({
  worker,
  lang,
  daysLogged,
  className,
}: {
  worker: Worker;
  lang: Lang;
  daysLogged: number;
  className?: string;
}) {
  const t = (k: Parameters<typeof translate>[1], v?: Record<string, string | number>) => translate(lang, k, v);
  const origin = useOrigin();
  const naka = NAKAS[worker.naka] ?? NAKAS["ghatkopar-naka"]!;
  const profileUrl = `${origin}/employer/workers/${worker.id}`;

  return (
    <article
      className={cn("relative overflow-hidden rounded-[1.6rem] border-2 border-ink bg-white shadow-pop", className)}
      aria-label={`${t("cardTitle")} — ${worker.name}`}
    >
      <div className="relative flex items-center justify-between bg-marigold px-4 py-3">
        <div className="flex items-center gap-2">
          <LogoMark className="size-8" />
          <span className="font-display text-lg font-extrabold">{t("cardTitle")}</span>
        </div>
        {worker.phoneVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">
            <BadgeCheck className="size-3.5 text-marigold" aria-hidden="true" />
            {t("phoneVerified")}
          </span>
        ) : null}
        <div className="absolute inset-x-0 -bottom-1 h-2 hatch-marigold opacity-80" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 p-4 pt-5">
        <div className="min-w-0">
          <Avatar name={worker.name} hue={worker.hue} size="lg" />
          <h2 className="mt-3 font-display text-[1.6rem] leading-tight font-extrabold">{worker.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-bold">
            <TradeIcon trade={worker.trade} className="size-7" />
            {pick(TRADES[worker.trade].label, lang)}
          </p>
          <p className="mt-0.5 font-bold text-muted">{t("yearsExp", { n: worker.years })}</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="rounded-xl border-2 border-ink bg-white p-1.5">
            {origin ? (
              <QRCodeSVG value={profileUrl} size={104} fgColor="#161a3d" bgColor="#ffffff" level="M" />
            ) : (
              <div className="size-[104px] bg-sand" />
            )}
          </div>
          <span className="max-w-[7.5rem] text-center text-[0.72rem] leading-tight font-bold text-muted">{t("scanToHire")}</span>
        </div>
      </div>

      <dl className="grid grid-cols-3 border-y-2 border-dashed border-line text-center">
        <div className="p-3">
          <dt className="sr-only">{t("statRating")}</dt>
          <dd className="flex items-center justify-center gap-1 font-display text-xl font-extrabold">
            <Star className="size-5 fill-marigold text-marigold-deep" aria-hidden="true" />
            {worker.rating ? worker.rating.toFixed(1) : "—"}
          </dd>
        </div>
        <div className="border-x-2 border-dashed border-line p-3">
          <dt className="text-[0.75rem] font-bold text-muted">{t("statJobs")}</dt>
          <dd className="font-display text-xl font-extrabold">{worker.jobsDone}</dd>
        </div>
        <div className="p-3">
          <dt className="text-[0.75rem] font-bold text-muted">{t("statDays")}</dt>
          <dd className="font-display text-xl font-extrabold">{daysLogged}</dd>
        </div>
      </dl>

      <div className="space-y-2.5 p-4 text-[0.95rem]">
        <p className="flex items-center gap-2 font-bold">
          <MapPin className="size-5 shrink-0 text-marigold-deep" aria-hidden="true" />
          {t("standsAt", { naka: pick(naka.name, lang) })}
        </p>
        <div>
          <p className="text-[0.8rem] font-bold text-muted">{t("worksIn")}</p>
          <p className="font-bold">{worker.areas.map((a) => pick(AREAS[a].name, lang)).join(" · ")}</p>
        </div>
        <div>
          <p className="text-[0.8rem] font-bold text-muted">{t("speaks")}</p>
          <p className="font-bold">{worker.languages.join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}
