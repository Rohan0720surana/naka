"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CirclePlus, House, LayoutDashboard, Search, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/brand/Logo";
import { EMPLOYERS, DEMO_EMPLOYER_ID } from "@/lib/data/jobs";
import { LangContext, useHydrated, useInFrame } from "@/lib/hooks";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/employer", label: "Dashboard", Icon: LayoutDashboard, match: (p: string) => p === "/employer" },
  { href: "/employer/post", label: "Post work", Icon: CirclePlus, match: (p: string) => p.startsWith("/employer/post") },
  { href: "/employer/workers", label: "Find workers", Icon: Search, match: (p: string) => p.startsWith("/employer/workers") },
];

export function EmployerShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const unread = useDemo((s) => s.notices.filter((n) => n.to === "employer" && !n.read).length);
  const me = EMPLOYERS[DEMO_EMPLOYER_ID]!;
  const inFrame = useInFrame();

  return (
    <LangContext.Provider value="en">
      <div className="min-h-dvh bg-[#f7f1e4]">
        <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
            {inFrame ? null : (
              <Link
                href="/"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 border-line bg-white px-3 text-sm font-bold hover:border-ink"
                title="Main site"
              >
                <House className="size-4" aria-hidden="true" />
                <span className="hidden lg:inline">Main site</span>
                <span className="sr-only lg:hidden">Main site</span>
              </Link>
            )}
            <Link href="/employer" className="rounded-xl">
              <Logo sub="for employers" />
            </Link>
            <nav aria-label="Employer" className="ml-2 hidden items-center gap-1 md:flex">
              {NAV.map(({ href, label, Icon, match }) => {
                const active = match(pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-full px-4 font-bold transition-colors",
                      active ? "bg-ink text-paper" : "text-ink hover:bg-sand",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <span className="relative inline-flex size-11 items-center justify-center rounded-full border-2 border-line bg-white" aria-label={`${unread} new updates`} role="img">
                <Bell className="size-5" aria-hidden="true" />
                {unread ? (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-danger text-[0.7rem] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                <Avatar name={me.name} hue={210} size="sm" />
                <span className="leading-tight">
                  <span className="block font-bold">{me.name}</span>
                  <span className="block text-xs text-muted">Home owner · Powai</span>
                </span>
              </span>
            </div>
          </div>
          <nav aria-label="Employer mobile" className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden no-scrollbar">
            {NAV.map(({ href, label, Icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold",
                    active ? "bg-ink text-paper" : "bg-white text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <EmployerToasts />
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {hydrated ? (
            <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {children}
            </motion.div>
          ) : (
            <div className="space-y-4" aria-busy="true">
              <div className="h-10 w-72 animate-pulse rounded-xl bg-sand" />
              <div className="h-40 animate-pulse rounded-[1.4rem] bg-sand" />
            </div>
          )}
        </main>
      </div>
    </LangContext.Provider>
  );
}

function EmployerToasts() {
  const router = useRouter();
  const all = useDemo((s) => s.notices);
  const notices = all.filter((n) => n.to === "employer" && !n.read).slice(0, 3);
  const markRead = useDemo((s) => s.markNoticeRead);
  const ids = notices.map((n) => n.id).join(",");

  useEffect(() => {
    if (!ids) return;
    const timers = ids.split(",").map((id) => setTimeout(() => markRead(id), 8000));
    return () => timers.forEach(clearTimeout);
  }, [ids, markRead]);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col-reverse gap-2" aria-live="polite">
      <AnimatePresence>
        {notices.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border-2 border-ink bg-ink p-3.5 text-paper shadow-pop on-dark"
            role="status"
          >
            <span className="mt-1 size-2.5 shrink-0 rounded-full bg-marigold" aria-hidden="true" />
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => {
                markRead(n.id);
                if (n.href) router.push(n.href);
              }}
            >
              <span className="block font-bold">{n.title.en}</span>
              <span className="block text-sm text-paper/75">{n.body.en}</span>
            </button>
            <button type="button" onClick={() => markRead(n.id)} className="-m-1 inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Dismiss">
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
