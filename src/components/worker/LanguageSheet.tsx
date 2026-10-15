"use client";

import { Check } from "lucide-react";
import { Sheet } from "@/components/Sheet";
import { LANGS, translate } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const SAY: Record<string, string> = {
  hi: "हिंदी चुनी गई",
  mr: "मराठी निवडली",
  en: "English selected",
};

export function LanguageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useDemo((s) => s.lang);
  const setLang = useDemo((s) => s.setLang);
  return (
    <Sheet open={open} onClose={onClose} title={`${translate(lang, "language")} · भाषा`} closeLabel={translate(lang, "close")}>
      <ul className="grid gap-2.5">
        {LANGS.map((l) => {
          const on = l.id === lang;
          return (
            <li key={l.id}>
              <button
                type="button"
                lang={l.id}
                onClick={() => {
                  setLang(l.id);
                  speak(SAY[l.id]!, l.id);
                  onClose();
                }}
                aria-pressed={on}
                className={cn(
                  "flex min-h-16 w-full items-center justify-between rounded-2xl border-2 px-5 py-3 text-left transition-colors",
                  on ? "border-ink bg-marigold" : "border-line bg-white hover:border-ink/40",
                )}
              >
                <span>
                  <span className="block font-display text-2xl font-extrabold">{l.native}</span>
                  {l.english !== l.native ? <span className="text-sm text-muted">{l.english}</span> : null}
                </span>
                {on ? <Check className="size-7" strokeWidth={3} aria-hidden="true" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-center text-sm text-muted">বাংলা · தமிழ் · తెలుగు · ગુજરાતી — soon</p>
    </Sheet>
  );
}
