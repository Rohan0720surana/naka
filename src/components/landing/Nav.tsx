"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Menu, Play } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/primitives";

const SECTIONS = [
  { href: "#problem", label: "The problem" },
  { href: "#how", label: "Who it's for" },
  { href: "#features", label: "What it does" },
  { href: "#inclusive", label: "Design" },
];

const APPS = [
  { href: "/worker/welcome", label: "Worker onboarding", sub: "Choose a language, speak your work" },
  { href: "/worker", label: "Worker app", sub: "Work feed, Kaam Card, Khata, rights" },
  { href: "/saathi", label: "Naka Saathi app", sub: "For the helper with the one smartphone" },
  { href: "/employer", label: "Employer site", sub: "Post work, find workers, agreements" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 40], ["0 0 0 0 rgba(22,26,61,0)", "0 10px 30px -18px rgba(22,26,61,0.45)"]);
  const { scrollYProgress } = useScroll();
  return (
    <motion.header style={{ boxShadow: shadow }} className="sticky top-0 z-40 border-b-2 border-ink/10 bg-paper/92 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <Link href="/" className="rounded-xl" aria-label="RozGhar home">
          <Logo />
        </Link>
        <nav aria-label="Sections" className="hidden items-center gap-0.5 lg:flex">
          {SECTIONS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 font-bold text-ink/75 transition-colors hover:bg-sand hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <details className="group relative">
            <summary className="flex h-10 list-none items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 font-bold sm:px-3.5 [&::-webkit-details-marker]:hidden">
              <Menu className="size-4 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">Open the apps</span>
              <span className="sr-only">Apps</span>
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border-2 border-ink bg-paper p-1.5 shadow-pop">
              {APPS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="block rounded-xl px-3 py-2.5 hover:bg-marigold-soft">
                    <span className="block font-bold">{a.label}</span>
                    <span className="block text-sm text-muted">{a.sub}</span>
                  </Link>
                </li>
              ))}
              <li className="lg:hidden">
                <div className="mt-1 border-t-2 border-ink/10 pt-1">
                  {SECTIONS.map((l) => (
                    <a key={l.href} href={l.href} className="block rounded-xl px-3 py-2 font-bold hover:bg-sand">
                      {l.label}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </details>
          <ButtonLink href="/demo" size="sm" className="px-3 sm:px-3.5">
            <Play className="size-4 fill-ink" aria-hidden="true" />
            <span className="hidden sm:inline">Live demo</span>
            <span className="sm:hidden">Demo</span>
          </ButtonLink>
        </div>
      </div>
      <motion.div className="absolute inset-x-0 -bottom-[2px] h-[3px] origin-left bg-bus" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </motion.header>
  );
}
