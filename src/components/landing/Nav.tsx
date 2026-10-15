"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/primitives";

const LINKS = [
  { href: "#problem", label: "The problem" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#inclusive", label: "Inclusive design" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 40], ["0 0 0 0 rgba(22,26,61,0)", "0 10px 30px -18px rgba(22,26,61,0.45)"]);
  return (
    <motion.header style={{ boxShadow: shadow }} className="sticky top-0 z-40 border-b-2 border-ink/10 bg-paper/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="rounded-xl" aria-label="Naka home">
          <Logo />
        </Link>
        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 font-bold text-ink/80 transition-colors hover:bg-sand hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/employer" className="hidden rounded-full px-3.5 py-2 font-bold hover:bg-sand sm:inline-flex">
            For employers
          </Link>
          <ButtonLink href="/demo" size="sm">
            <Play className="size-4 fill-ink" aria-hidden="true" />
            Live demo
          </ButtonLink>
        </div>
      </div>
    </motion.header>
  );
}
