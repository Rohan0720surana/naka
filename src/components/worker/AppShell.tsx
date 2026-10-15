"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, BookOpen, BriefcaseBusiness, IdCard, Landmark, Languages, WifiOff, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { LanguageSheet } from "@/components/worker/LanguageSheet";
import { NAKAS } from "@/lib/data/places";
import { useHydrated, useOnline, useT } from "@/lib/hooks";
import { LANGS, type TKey } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV: { href: string; key: TKey; Icon: typeof IdCard; match: (p: string) => boolean }[] = [
  { href: "/worker", key: "navWork", Icon: BriefcaseBusiness, match: (p) => p === "/worker" || p.startsWith("/worker/job") || p.startsWith("/worker/agreement") },
  { href: "/worker/card", key: "navCard", Icon: IdCard, match: (p) => p.startsWith("/worker/card") },
  { href: "/worker/khata", key: "navKhata", Icon: BookOpen, match: (p) => p.startsWith("/worker/khata") },
  { href: "/worker/haq", key: "navHaq", Icon: Landmark, match: (p) => p.startsWith("/worker/haq") },
];

/** Applies the worker's language and text size to the whole document. */
function useDocumentPrefs(enabled: boolean) {
  const lang = useDemo((s) => s.lang);
  const largeText = useDemo((s) => s.largeText);
  useEffect(() => {
    if (!enabled) return;
    const el = document.documentElement;
    el.lang = lang;
    el.style.fontSize = largeText ? "112.5%" : "";
    return () => {
      el.lang = "en";
      el.style.fontSize = "";
    };
  }, [enabled, lang, largeText]);
}

export function AppShell({
  children,
  mode = "worker",
}: {
  children: ReactNode;
  mode?: "worker" | "saathi";
}) {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const onboarding = pathname.startsWith("/worker/welcome");
  useDocumentPrefs(hydrated);

  return (
    <div className="min-h-dvh bg-[#efe4cc] paper-grain">
      <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col bg-paper sm:border-x-2 sm:border-ink/10 sm:shadow-pop">
        {!hydrated ? (
          <Splash />
        ) : (
          <>
            {onboarding ? null : <Header mode={mode} />}
            <OfflineBanner />
            {mode === "worker" && !onboarding ? <NoticeBanner /> : null}
            <main id="main" className={cn("flex-1 px-4", onboarding ? "pb-8" : mode === "worker" ? "pb-32" : "pb-10")}>
              {children}
            </main>
            {mode === "worker" && !onboarding ? <BottomNav pathname={pathname} /> : null}
          </>
        )}
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10" aria-busy="true" aria-live="polite">
      <LogoMark className="size-16" />
      <div className="h-2 w-32 overflow-hidden rounded-full bg-sand">
        <motion.div
          className="h-full w-1/2 rounded-full bg-marigold"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

function Header({ mode }: { mode: "worker" | "saathi" }) {
  const { t, p, lang } = useT();
  const me = useDemo((s) => s.me);
  const largeText = useDemo((s) => s.largeText);
  const toggleLargeText = useDemo((s) => s.toggleLargeText);
  const [langOpen, setLangOpen] = useState(false);
  const naka = NAKAS[me.naka] ?? NAKAS["ghatkopar-naka"]!;
  const native = LANGS.find((l) => l.id === lang)?.native;

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink/8 bg-paper/95 px-4 py-2.5 backdrop-blur no-print">
      <div className="flex items-center gap-2.5">
        <Link href={mode === "worker" ? "/worker" : "/saathi"} className="flex min-w-0 items-center gap-2.5 rounded-xl">
          <LogoMark className="size-10" />
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-lg font-extrabold">
              {mode === "saathi" ? t("saathiTitle") : t("appName")}
            </span>
            <span className="block truncate text-[0.8rem] font-bold text-muted">{p(naka.name)}</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLargeText}
            aria-pressed={largeText}
            aria-label={t("biggerText")}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-2 font-display font-extrabold",
              largeText ? "border-ink bg-ink text-paper" : "border-line bg-white",
            )}
          >
            <span className="text-sm">A</span>
            <span className="text-lg">A</span>
          </button>
          <button
            type="button"
            onClick={() => setLangOpen(true)}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-ink bg-marigold px-3 font-bold"
            aria-label={`${t("language")}: ${native}`}
          >
            <Languages className="size-5" aria-hidden="true" />
            <span>{native}</span>
          </button>
        </div>
      </div>
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />
    </header>
  );
}

function OfflineBanner() {
  const { t } = useT();
  const online = useOnline();
  if (online) return null;
  return (
    <div className="flex items-center gap-2 bg-ink px-4 py-2 text-sm font-bold text-paper" role="status">
      <WifiOff className="size-4" aria-hidden="true" />
      {t("offline")}
    </div>
  );
}

function NoticeBanner() {
  const { p, t } = useT();
  const router = useRouter();
  const notice = useDemo((s) => s.notices.find((n) => n.to === "worker" && !n.read));
  const markRead = useDemo((s) => s.markNoticeRead);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => markRead(notice.id), 9000);
    return () => clearTimeout(timer);
  }, [notice, markRead]);

  return (
    <div className="pointer-events-none sticky top-[66px] z-40 h-0 px-3" aria-live="polite">
      <AnimatePresence>
        {notice ? (
          <motion.div
            key={notice.id}
            initial={{ y: -24, opacity: 0, scale: 0.96 }}
            animate={{ y: 8, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border-2 border-ink bg-ink p-3.5 text-paper shadow-pop on-dark"
            role="status"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-marigold text-ink">
              <BellRing className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[1.05rem] leading-tight font-extrabold">{p(notice.title)}</p>
              <p className="mt-0.5 text-[0.9rem] text-paper/80">{p(notice.body)}</p>
              {notice.href ? (
                <button
                  type="button"
                  onClick={() => {
                    markRead(notice.id);
                    router.push(notice.href!);
                  }}
                  className="mt-2 inline-flex h-10 items-center rounded-xl bg-marigold px-3.5 font-bold text-ink"
                >
                  {notice.kind === "offer" ? t("seeOffer") : notice.kind === "new-job" ? t("seeWork") : t("viewDeal")}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => markRead(notice.id)}
              className="-m-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
              aria-label={t("close")}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const { t } = useT();
  const pendingOffers = useDemo(
    (s) => s.agreements.filter((a) => a.workerId === s.me.id && (a.status === "offered" || a.status === "done")).length,
  );
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t-2 border-ink/10 bg-paper/95 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur no-print"
    >
      <ul className="grid grid-cols-4">
        {NAV.map(({ href, key, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[0.8rem] font-bold"
              >
                <span
                  className={cn(
                    "relative flex h-9 w-14 items-center justify-center rounded-full transition-colors",
                    active ? "bg-marigold text-ink" : "text-muted group-hover:bg-sand",
                  )}
                >
                  <Icon className="size-6" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                  {key === "navWork" && pendingOffers > 0 ? (
                    <span className="absolute -top-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-paper bg-danger text-[0.7rem] text-white">
                      {pendingOffers}
                    </span>
                  ) : null}
                </span>
                <span className={active ? "text-ink" : "text-muted"}>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
