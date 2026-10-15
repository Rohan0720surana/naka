"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useT } from "@/lib/hooks";
import { LANGS } from "@/lib/i18n";
import { getActiveSpeech, speakAs, stopSpeaking, subscribeSpeech } from "@/lib/speech";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * "Listen" button: reads a job, a scheme or an agreement aloud in the
 * worker's language. `say` builds the text for any language, so the button
 * can fall back to English on devices without a Hindi or Marathi voice.
 */
export function SpeakButton({
  say,
  className,
  compact,
  label,
}: {
  say: (lang: Lang) => string;
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  const { t, lang } = useT();
  const id = useId();
  const active = useSyncExternalStore(subscribeSpeech, getActiveSpeech, () => null);
  const speaking = active === id;
  const [note, setNote] = useState<string | null>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (getActiveSpeech() === id) stopSpeaking();
      if (noteTimer.current) clearTimeout(noteTimer.current);
    },
    [id],
  );

  const flash = (msg: string) => {
    setNote(msg);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(null), 5000);
  };

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      return;
    }
    const result = await speakAs(id, say, lang);
    if (!result.ok) flash(t("voiceUnsupported"));
    else if (result.fellBack) flash(t("voiceFallback", { lang: LANGS.find((l) => l.id === lang)?.native ?? "" }));
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={speaking}
        aria-label={compact ? `${speaking ? t("stop") : label ?? t("listen")}` : undefined}
        className={cn(
          "relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-ink font-bold transition-colors",
          speaking ? "bg-ink text-marigold" : "bg-marigold-soft text-ink hover:bg-marigold",
          compact ? "size-11" : "h-11 px-4",
          className,
        )}
      >
        {speaking ? <Bars /> : <Volume2 className="size-5" aria-hidden="true" />}
        {compact ? null : <span>{speaking ? t("stop") : label ?? t("listen")}</span>}
      </button>
      <AnimatePresence>
        {note ? (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-28 z-[70] mx-auto max-w-sm rounded-xl border-2 border-ink bg-ink px-4 py-3 text-center text-[0.9rem] leading-snug font-bold text-paper shadow-pop"
          >
            {note}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function Bars() {
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current motion-safe:animate-[speak_0.9s_ease-in-out_infinite]"
          style={{ height: `${40 + ((i * 23) % 50)}%`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <style>{`@keyframes speak{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}`}</style>
    </span>
  );
}
