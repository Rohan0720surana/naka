"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/lib/hooks";
import { speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

/** "Listen" button: reads a job, a scheme or an agreement aloud in the worker's language. */
export function SpeakButton({
  text,
  className,
  compact,
  label,
}: {
  text: string;
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  const { t, lang } = useT();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ok = speak(text, lang, () => setSpeaking(false));
    setSpeaking(ok);
  };

  return (
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
