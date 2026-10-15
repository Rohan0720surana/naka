"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, MessageSquareQuote, Printer, Quote, Share2, UserPlus } from "lucide-react";
import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { KaamCard } from "@/components/worker/KaamCard";
import { BeforeAfter, WorkTiles } from "@/components/worker/WorkPhotos";
import { Button, Card, SectionTitle } from "@/components/ui/primitives";
import { NAKAS } from "@/lib/data/places";
import { TRADES } from "@/lib/data/trades";
import { useT } from "@/lib/hooks";
import { pick, translate } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { khataDays, useDemo } from "@/lib/store";

export default function CardPage() {
  const { t, p, lang } = useT();
  const me = useDemo((s) => s.me);
  const days = useDemo((s) => khataDays(s));
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const naka = NAKAS[me.naka] ?? NAKAS["ghatkopar-naka"]!;
  const spoken = (l: Lang) =>
    [
      l !== "en" && me.nameDeva ? me.nameDeva : me.name,
      pick(TRADES[me.trade].label, l),
      translate(l, "yearsExp", { n: me.years }),
      translate(l, "standsAt", { naka: pick(naka.name, l) }),
      translate(l, "jobsDone", { n: me.jobsDone }),
    ].join(". ");

  const shareUrl = () => `${window.location.origin}/employer/workers/${me.id}`;

  return (
    <div className="space-y-6 pt-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.75rem] leading-tight font-extrabold">{t("cardTitle")}</h1>
          <p className="text-muted">{t("cardSub")}</p>
        </div>
        <SpeakButton say={spoken} compact />
      </header>

      <motion.div initial={{ rotate: -2, y: 20, opacity: 0 }} animate={{ rotate: 0, y: 0, opacity: 1 }} transition={{ type: "spring", damping: 16 }}>
        <KaamCard worker={me} lang={lang} daysLogged={days} />
      </motion.div>

      <div className="grid grid-cols-2 gap-2 no-print">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(`https://wa.me/?text=${encodeURIComponent(`${me.name} — ${p(TRADES[me.trade].label)}, ${t("yearsExp", { n: me.years })}. ${shareUrl()}`)}`, "_blank", "noopener");
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-[#25d366] font-bold btn-sign"
        >
          <Share2 className="size-5" aria-hidden="true" />
          {t("shareCard")}
        </a>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="size-5" aria-hidden="true" />
          {t("printCard")}
        </Button>
      </div>

      <p className="rounded-[1.2rem] bg-ink p-4 font-display text-[1.1rem] leading-snug font-bold text-paper">{t("noResume")}</p>

      {me.skills.length ? (
        <section className="space-y-3" aria-labelledby="skills">
          <SectionTitle id="skills">{t("skillsTitle")}</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {me.skills.map((s) => (
              <li key={s.en} className="rounded-full border-2 border-ink bg-marigold-soft px-3.5 py-2 font-bold">
                {p(s)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3" aria-labelledby="photos">
        <SectionTitle
          id="photos"
          action={
            <Button variant="ghost" size="sm" onClick={() => flash(t("photoDemo"))}>
              <Camera className="size-5" aria-hidden="true" />
              {t("addPhoto")}
            </Button>
          }
        >
          {t("photosTitle")}
        </SectionTitle>
        <BeforeAfter />
        <WorkTiles />
      </section>

      <section className="space-y-3" aria-labelledby="vouch">
        <SectionTitle id="vouch">{t("vouchTitle")}</SectionTitle>
        {me.vouches.length ? (
          <ul className="space-y-3">
            {me.vouches.map((v, i) => (
              <motion.li
                key={v.by}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="p-4">
                  <Quote className="size-6 text-marigold-deep" aria-hidden="true" />
                  <blockquote className="mt-1 text-[1.02rem] leading-snug">{p(v.quote)}</blockquote>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-extrabold">{v.by}</p>
                      <p className="text-[0.85rem] text-muted">{p(v.role)}</p>
                    </div>
                    <span className="rounded-full bg-sand px-2.5 py-1 text-[0.8rem] font-bold">{t("knownFor", { t: p(v.known) })}</span>
                  </div>
                </Card>
              </motion.li>
            ))}
          </ul>
        ) : (
          <Card className="flex items-center gap-3 p-4 text-muted">
            <MessageSquareQuote className="size-6" aria-hidden="true" />
            {t("askVouch")}
          </Card>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${t("askVouch")}: ${shareUrl()}`)}`, "_blank", "noopener");
          }}
        >
          <UserPlus className="size-5" aria-hidden="true" />
          {t("askVouch")}
        </Button>
      </section>

      <AnimatePresence>
        {toast ? (
          <motion.p
            role="status"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed inset-x-0 bottom-28 z-40 mx-auto w-fit max-w-[90%] rounded-2xl bg-ink px-4 py-3 text-center font-bold text-paper shadow-pop"
          >
            {toast}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
