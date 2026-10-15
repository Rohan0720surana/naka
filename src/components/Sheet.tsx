"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const noSubscribe = () => () => {};

/**
 * Bottom sheet dialog: slides up from the thumb zone, Escape or backdrop closes it.
 * Rendered into <body> so a blurred or transformed parent (like a sticky
 * header) can never clip it.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  closeLabel = "Close",
  className,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  closeLabel?: string;
  className?: string;
  wide?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus], button")?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={cn("fixed inset-0 z-[60] flex items-end justify-center", wide && "sm:items-center sm:p-6")}>
          <motion.div
            className="absolute inset-0 bg-ink/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "relative z-10 flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border-2 border-b-0 border-ink bg-paper shadow-pop",
              wide && "sm:rounded-[1.75rem] sm:border-b-2",
              wide ? "max-w-2xl" : "max-w-[480px]",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.18, ease: "easeIn" } }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-ink/20" aria-hidden="true" />
            <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-3 pb-2">
              <h2 id={titleId} className="font-display text-xl leading-tight font-extrabold">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-ink/8"
                aria-label={closeLabel}
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
