"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquareText, RotateCcw, Smartphone, Users } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { BrowserFrame, DeviceTabs, PhoneFrame } from "@/components/demo/Frames";
import { FeaturePhone } from "@/components/demo/FeaturePhone";
import { Button } from "@/components/ui/primitives";
import { useHydrated } from "@/lib/hooks";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

type Device = "smart" | "feature" | "saathi";

const SCRIPT: { title: string; body: string; device?: Device }[] = [
  {
    title: "Post work as Priya",
    body: "In the employer window, open Post work and publish a painting job. Watch Ramesh's phone: the alert arrives in his language.",
    device: "smart",
  },
  {
    title: "Ramesh checks it",
    body: "Tap the alert. Pay, hours, place, the fair-pay meter and the safety check are all on one screen — tap Listen to hear it. Then “I want this work”.",
    device: "smart",
  },
  {
    title: "Make it pakka",
    body: "On Priya's dashboard, confirm the request. Both sides now hold the same Pakka agreement, with the same code.",
    device: "smart",
  },
  {
    title: "Pay, then log it",
    body: "Priya marks the work done and paid. Ramesh confirms, and the days land in his Kamai Khata — proof for the welfare board's 90 days.",
    device: "smart",
  },
  {
    title: "No smartphone? Still in",
    body: "Switch to Arjun's button phone. Post helper work as Priya — Arjun gets an SMS in Hindi. Press 1 to ask for it, then confirm on the dashboard.",
    device: "feature",
  },
];

export function DemoStage() {
  const hydrated = useHydrated();
  const reset = useDemo((s) => s.reset);
  const [device, setDevice] = useState<Device>("smart");
  const [frameKey, setFrameKey] = useState(0);
  const [empKey, setEmpKey] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  return (
    <div className="min-h-dvh bg-[#efe4cc] paper-grain">
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 rounded-xl">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <Logo />
          </Link>
          <div className="hidden min-w-0 md:block">
            <h1 className="font-display text-lg leading-tight font-extrabold">Live demo — both sides of Naka, at once</h1>
            <p className="text-sm text-muted">Everything you do in one window updates the others instantly.</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                setFrameKey((k) => k + 1);
                setEmpKey((k) => k + 1);
                setStepIdx(0);
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset demo
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
        <section aria-labelledby="guide-title" className="rounded-[1.4rem] border-2 border-ink bg-white p-2.5">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
            <h2 id="guide-title" className="sr-only">
              Try it in 5 steps
            </h2>
            <ol className="flex shrink-0 gap-1.5 overflow-x-auto no-scrollbar" aria-label="Demo steps">
              {SCRIPT.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIdx(i);
                      if (s.device) setDevice(s.device);
                    }}
                    aria-current={stepIdx === i ? "step" : undefined}
                    title={s.title}
                    className={cn(
                      "flex h-full items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-sm font-bold whitespace-nowrap transition-colors",
                      stepIdx === i ? "border-ink bg-marigold" : "border-line hover:border-ink/40",
                    )}
                  >
                    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs", stepIdx === i ? "bg-ink text-paper" : "bg-sand")}>
                      {i + 1}
                    </span>
                    <span className={stepIdx === i ? "" : "hidden 2xl:inline"}>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-paper on-dark" aria-live="polite">
              <p className="min-w-0 flex-1 text-[0.95rem] leading-snug">
                <span className="font-extrabold text-marigold">Step {stepIdx + 1} · {SCRIPT[stepIdx]!.title}.</span>{" "}
                <span className="text-paper/85">{SCRIPT[stepIdx]!.body}</span>
              </p>
              <button
                type="button"
                disabled={stepIdx === SCRIPT.length - 1}
                onClick={() => {
                  const n = Math.min(SCRIPT.length - 1, stepIdx + 1);
                  setStepIdx(n);
                  if (SCRIPT[n]!.device) setDevice(SCRIPT[n]!.device!);
                }}
                className="h-10 shrink-0 rounded-xl bg-marigold px-4 font-bold text-ink disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <div className="mt-4 grid items-start gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="space-y-3">
            <DeviceTabs<Device>
              value={device}
              onChange={setDevice}
              tabs={[
                { id: "smart", label: <><Smartphone className="size-4" aria-hidden="true" /> Ramesh</> },
                { id: "feature", label: <><MessageSquareText className="size-4" aria-hidden="true" /> Arjun (SMS)</> },
                { id: "saathi", label: <><Users className="size-4" aria-hidden="true" /> Saathi</> },
              ]}
            />
            <div className={device === "smart" ? "block" : "hidden"}>
              <PhoneFrame src="/worker" title="Ramesh's phone — Naka worker app" frameKey={frameKey} />
              <p className="mt-3 text-center text-sm text-muted">Ramesh Yadav · painter · Ghatkopar Naka</p>
            </div>
            <div className={device === "saathi" ? "block" : "hidden"}>
              <PhoneFrame src="/saathi" title="Naka Saathi app" frameKey={frameKey} />
              <p className="mt-3 text-center text-sm text-muted">Sunil Patil · helps workers without smartphones</p>
            </div>
            {device === "feature" ? hydrated ? <FeaturePhone /> : <div className="mx-auto h-[640px] w-[270px] animate-pulse rounded-[2.6rem] bg-ink/20" /> : null}
          </div>

          <div>
            <p className="mb-2 flex h-10 items-center justify-center text-sm font-bold text-muted xl:justify-start">Priya Nair · home owner in Powai · hiring</p>
            <BrowserFrame src="/employer" title="Employer website" url="naka.app/employer" frameKey={empKey} onReload={() => setEmpKey((k) => k + 1)} />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          A frontend prototype built for Artemis 2026 · Problem Statement 2 — “Beyond the Waiting Line”. All people, jobs and numbers are sample data.
        </p>
      </div>
    </div>
  );
}
