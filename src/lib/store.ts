"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEMO_EMPLOYER_ID, EMPLOYERS, SEED_JOBS } from "@/lib/data/jobs";
import { AREAS, FROM_NAKA } from "@/lib/data/places";
import type { DocId } from "@/lib/data/schemes";
import { TRADES } from "@/lib/data/trades";
import { MAIN_WORKER_ID, SAATHI_NAME, SEED_WORKERS, SMS_WORKER_ID } from "@/lib/data/workers";
import { hoursRange, isoDaysAgo, money, TIMING_KEY } from "@/lib/format";
import { translate, type TKey, type TVars } from "@/lib/i18n";
import type {
  Agreement,
  EligibilityAnswers,
  Job,
  KhataEntry,
  L10n,
  Lang,
  Notice,
  Sms,
  TradeId,
  Worker,
} from "@/lib/types";

export const STORAGE_KEY = "naka-demo";
const STORE_VERSION = 5;

/** Days of work Ramesh logged before the entries shown in his Khata. */
export const BASE_LOGGED_DAYS = 56;

/** Builds an L10n string from one dictionary key, in every language. */
export function l10n(key: TKey, vars?: TVars): L10n {
  return { en: translate("en", key, vars), hi: translate("hi", key, vars), mr: translate("mr", key, vars) };
}

const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function seedKhata(): KhataEntry[] {
  const rows: [number, string, TradeId, number, boolean][] = [
    [1, "Shree Ganesh Contractors", "painter", 850, false],
    [2, "Shree Ganesh Contractors", "painter", 850, false],
    [3, "Anjali Rao", "painter", 900, true],
    [5, "Anjali Rao", "painter", 900, true],
    [6, "Shree Ganesh Contractors", "painter", 850, true],
    [7, "Shree Ganesh Contractors", "painter", 850, true],
    [9, "Shree Ganesh Contractors", "painter", 850, true],
    [10, "Mehta family, Vidyavihar", "painter", 800, true],
    [12, "Mehta family, Vidyavihar", "painter", 800, true],
    [13, "Greenleaf Housing Society", "labourer", 700, true],
    [16, "Shree Ganesh Contractors", "painter", 850, true],
    [17, "Shree Ganesh Contractors", "painter", 850, true],
    [19, "Sai Builders", "painter", 900, true],
    [20, "Sai Builders", "painter", 900, true],
    [23, "Kapoor Interiors", "painter", 950, true],
    [24, "Kapoor Interiors", "painter", 950, true],
    [26, "Greenleaf Housing Society", "labourer", 700, true],
    [27, "Shree Ganesh Contractors", "painter", 850, true],
  ];
  return rows.map(([ago, employer, trade, amount, paid], i) => ({
    id: `k${i}`,
    date: isoDaysAgo(ago),
    employer,
    trade,
    amount,
    paid,
  }));
}

/** The SMS a feature-phone worker gets for a job alert, in Hindi with an English gloss. */
function jobAlertSms(job: Job): Sms["text"] {
  const t = TRADES[job.trade];
  const area = AREAS[job.area];
  const unitHi = job.unit === "day" ? "रोज़" : job.unit === "month" ? "महीना" : "पूरा काम";
  const unitEn = job.unit === "day" ? "a day" : job.unit === "month" ? "a month" : "for the job";
  return {
    hi: `नाका: ${t.work.hi}, ${area.name.hi}। ${money(job.pay)} ${unitHi}, ${hoursRange(job.startHour, job.endHour, "hi")}। ${translate("hi", TIMING_KEY[job.payTiming])}। काम चाहिए तो 1 भेजें।`,
    en: `NAKA: ${t.work.en}, ${area.name.en}. ${money(job.pay)} ${unitEn}, ${hoursRange(job.startHour, job.endHour, "en")}. ${translate("en", TIMING_KEY[job.payTiming])}. Reply 1 to get this work.`,
  };
}

function seedSms(): Sms[] {
  const now = Date.now();
  const j8 = SEED_JOBS.find((j) => j.id === "j8")!;
  return [
    {
      id: "s0",
      from: "naka",
      at: now - 1000 * 60 * 60 * 20,
      text: {
        hi: `नाका: अर्जुन जी, ${SAATHI_NAME} (नाका साथी) ने आपका नाम जोड़ा है। काम आने पर SMS आएगा। मदद के लिए 0 भेजें।`,
        en: `NAKA: Arjun ji, ${SAATHI_NAME} (Naka Saathi) has added you. You will get work by SMS. Reply 0 for help.`,
      },
    },
    { id: "s1", from: "naka", at: now - 1000 * 60 * 6, text: jobAlertSms(j8), jobId: "j8" },
  ];
}

interface DemoData {
  lang: Lang;
  largeText: boolean;
  onboarded: boolean;
  me: Worker;
  available: boolean;
  extraWorkers: Worker[];
  saathiPresent: Record<string, boolean>;
  postedJobs: Job[];
  agreements: Agreement[];
  khata: KhataEntry[];
  reported: string[];
  savedSchemes: string[];
  docsHave: DocId[];
  eligibility: EligibilityAnswers | null;
  notices: Notice[];
  sms: Sms[];
  smsSentJobs: Record<string, string[]>;
  counter: number;
}

export interface PostJobInput {
  trade: TradeId;
  area: Job["area"];
  landmark: string;
  pay: number;
  unit: Job["unit"];
  startHour: number;
  endHour: number;
  days: number;
  span: Job["span"];
  startsIn: Job["startsIn"];
  workers: number;
  provided: Job["provided"];
  payTiming: Job["payTiming"];
  payMode: Job["payMode"];
  note?: string;
}

interface DemoActions {
  setLang: (lang: Lang) => void;
  toggleLargeText: () => void;
  setAvailable: (v: boolean) => void;
  completeOnboarding: (profile: Pick<Worker, "name" | "trade" | "years" | "naka">) => void;
  registerAssisted: (profile: Pick<Worker, "name" | "trade" | "years" | "naka" | "phone">) => void;
  postJob: (input: PostJobInput) => Job;
  requestJob: (jobId: string, workerId?: string, via?: "app" | "sms") => Agreement | null;
  offerJob: (jobId: string, workerId: string) => Agreement | null;
  respond: (agreementId: string, accept: boolean, by: "worker" | "employer") => void;
  markDone: (agreementId: string) => void;
  confirmPaid: (agreementId: string, paid: boolean) => void;
  addKhata: (entry: Omit<KhataEntry, "id">) => void;
  markKhataPaid: (id: string) => void;
  reportJob: (jobId: string) => void;
  toggleScheme: (id: string) => void;
  toggleDoc: (id: DocId) => void;
  setEligibility: (a: EligibilityAnswers | null) => void;
  markNoticeRead: (id: string) => void;
  smsReply: (digit: string) => void;
  saathiToggle: (workerId: string) => void;
  saathiSendJob: (workerId: string, jobId: string) => void;
  reset: () => void;
}

export type DemoState = DemoData & DemoActions;

function initialData(): DemoData {
  const ramesh = SEED_WORKERS.find((w) => w.id === MAIN_WORKER_ID)!;
  return {
    lang: "en",
    largeText: false,
    onboarded: true,
    me: ramesh,
    available: true,
    extraWorkers: [],
    saathiPresent: { arjun: true, sunita: true, mohan: false },
    postedJobs: [],
    agreements: [],
    khata: seedKhata(),
    reported: [],
    savedSchemes: [],
    docsHave: ["aadhaar", "bank", "mobile"],
    eligibility: null,
    notices: [],
    sms: seedSms(),
    smsSentJobs: {},
    counter: 0,
  };
}

/* ----------------------------- selectors ----------------------------- */

export function allJobs(s: Pick<DemoData, "postedJobs">): Job[] {
  return [...s.postedJobs, ...SEED_JOBS];
}

export function findJob(s: Pick<DemoData, "postedJobs">, id: string): Job | undefined {
  return allJobs(s).find((j) => j.id === id);
}

export function allWorkers(s: Pick<DemoData, "me" | "available" | "extraWorkers" | "saathiPresent">): Worker[] {
  const seeded = SEED_WORKERS.map((w) => {
    if (w.id === s.me.id) return { ...s.me, availableToday: s.available };
    if (w.id in s.saathiPresent) return { ...w, availableToday: !!s.saathiPresent[w.id] };
    return w;
  });
  const extras = s.extraWorkers.map((w) => ({ ...w, availableToday: s.saathiPresent[w.id] ?? w.availableToday }));
  const meIsNew = !SEED_WORKERS.some((w) => w.id === s.me.id);
  return [...(meIsNew ? [{ ...s.me, availableToday: s.available }] : []), ...seeded, ...extras];
}

export function findWorker(s: Parameters<typeof allWorkers>[0], id: string): Worker | undefined {
  return allWorkers(s).find((w) => w.id === id);
}

export function khataDays(s: Pick<DemoData, "khata">): number {
  return BASE_LOGGED_DAYS + s.khata.length;
}

/* ------------------------------- store ------------------------------- */

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => {
      const notify = (n: Omit<Notice, "id" | "createdAt" | "read">) =>
        set((s) => ({ notices: [{ ...n, id: uid("n"), createdAt: Date.now(), read: false }, ...s.notices].slice(0, 30) }));

      const pushSms = (text: Sms["text"], extra: Partial<Sms> = {}, from: Sms["from"] = "naka") =>
        set((s) => ({ sms: [...s.sms, { id: uid("s"), from, text, at: Date.now(), ...extra }] }));

      const patchAgreement = (id: string, patch: Partial<Agreement>) =>
        set((s) => ({ agreements: s.agreements.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));

      const workerName = (id: string) => findWorker(get(), id)?.name ?? "Worker";
      const employerName = (id: string) => EMPLOYERS[id]?.name ?? "Employer";
      const firstName = (n: string) => n.split(" ")[0];

      const newAgreement = (job: Job, workerId: string, initiatedBy: Agreement["initiatedBy"], via: Agreement["via"]): Agreement => {
        const counter = get().counter + 1;
        const a: Agreement = {
          id: uid("a"),
          code: `NK-${2400 + counter}`,
          jobId: job.id,
          workerId,
          employerId: job.employerId,
          status: initiatedBy === "worker" ? "requested" : "offered",
          initiatedBy,
          createdAt: Date.now(),
          workerAgreedAt: initiatedBy === "worker" ? Date.now() : undefined,
          employerAgreedAt: initiatedBy === "employer" ? Date.now() : undefined,
          via,
        };
        set((s) => ({ counter, agreements: [a, ...s.agreements] }));
        return a;
      };

      const confirmedSms = (a: Agreement) => {
        const job = findJob(get(), a.jobId);
        if (!job) return;
        const emp = employerName(a.employerId);
        pushSms({
          hi: `पक्का! ${emp} ने हाँ कहा। ${translate("hi", job.startsIn === 0 ? "startsToday" : "startsTomorrow")} ${hoursRange(job.startHour, job.endHour, "hi")}, ${AREAS[job.area].name.hi}। करार नं. ${a.code}।`,
          en: `Pakka! ${emp} said yes. ${translate("en", job.startsIn === 0 ? "startsToday" : "startsTomorrow")}, ${hoursRange(job.startHour, job.endHour, "en")}, ${AREAS[job.area].name.en}. Agreement ${a.code}.`,
        });
      };

      const employerSaysYes = (a: Agreement) => {
        patchAgreement(a.id, { status: "agreed", employerAgreedAt: Date.now() });
        if (a.workerId === get().me.id) {
          notify({
            to: "worker",
            kind: "accepted",
            title: l10n("statusAgreed"),
            body: l10n("agreedBy", { name: employerName(a.employerId) }),
            href: `/worker/agreement/${a.id}`,
          });
        } else if (a.via === "sms") {
          confirmedSms(a);
        }
      };

      return {
        ...initialData(),

        setLang: (lang) => set({ lang }),
        toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
        setAvailable: (available) => set({ available }),

        completeOnboarding: (profile) =>
          set((s) => ({
            onboarded: true,
            me: {
              ...s.me,
              ...profile,
              nameDeva: profile.name.trim().toLowerCase() === "ramesh yadav" ? s.me.nameDeva : undefined,
              id: profile.name.trim().toLowerCase() === "ramesh yadav" ? MAIN_WORKER_ID : "me",
              jobsDone: profile.name.trim().toLowerCase() === "ramesh yadav" ? s.me.jobsDone : 0,
              vouches: profile.name.trim().toLowerCase() === "ramesh yadav" ? s.me.vouches : [],
              skills: profile.trade === s.me.trade ? s.me.skills : [],
              rating: profile.name.trim().toLowerCase() === "ramesh yadav" ? s.me.rating : 0,
            },
            available: true,
          })),

        registerAssisted: (profile) =>
          set((s) => {
            const id = uid("w");
            const worker: Worker = {
              ...SEED_WORKERS.find((w) => w.id === SMS_WORKER_ID)!,
              ...profile,
              id,
              rating: 0,
              jobsDone: 0,
              daysLogged: 0,
              phoneVerified: profile.phone !== "none",
              availableToday: true,
              hue: Math.floor(Math.random() * 360),
              helpedBy: SAATHI_NAME,
              skills: [],
              vouches: [],
              expectedDay: TRADES[profile.trade].fairDay[0],
            };
            return { extraWorkers: [...s.extraWorkers, worker], saathiPresent: { ...s.saathiPresent, [id]: true } };
          }),

        postJob: (input) => {
          const travel = FROM_NAKA[input.area] ?? { km: 5, mode: "bus" as const, minutes: 25 };
          const base = AREAS[input.area].pin;
          const job: Job = {
            id: uid("p"),
            trade: input.trade,
            employerId: DEMO_EMPLOYER_ID,
            area: input.area,
            landmark: input.landmark || AREAS[input.area].name.en,
            pin: { x: Math.min(96, base.x + 2), y: Math.min(96, base.y + 1) },
            km: travel.km,
            travel: { mode: travel.mode, minutes: travel.minutes },
            pay: input.pay,
            unit: input.unit,
            startHour: input.startHour,
            endHour: input.endHour,
            days: input.days,
            span: input.span,
            startsIn: input.startsIn,
            workers: input.workers,
            provided: input.provided,
            payTiming: input.payTiming,
            payMode: input.payMode,
            note: input.note ? { en: input.note, hi: input.note, mr: input.note } : undefined,
            postedMinutesAgo: 0,
            live: true,
          };
          set((s) => ({ postedJobs: [job, ...s.postedJobs] }));

          const s = get();
          if (job.trade === s.me.trade) {
            const work = TRADES[job.trade].work;
            notify({
              to: "worker",
              kind: "new-job",
              title: {
                en: `New work near you: ${work.en}`,
                hi: `पास में नया काम: ${work.hi}`,
                mr: `जवळ नवीन काम: ${work.mr}`,
              },
              body: {
                en: `${AREAS[job.area].name.en} · ${money(job.pay)} ${translate("en", job.unit === "day" ? "perDay" : job.unit === "month" ? "perMonth" : "perJob")}`,
                hi: `${AREAS[job.area].name.hi} · ${money(job.pay)} ${translate("hi", job.unit === "day" ? "perDay" : job.unit === "month" ? "perMonth" : "perJob")}`,
                mr: `${AREAS[job.area].name.mr} · ${money(job.pay)} ${translate("mr", job.unit === "day" ? "perDay" : job.unit === "month" ? "perMonth" : "perJob")}`,
              },
              href: `/worker/job/${job.id}`,
            });
          }
          const arjun = findWorker(s, SMS_WORKER_ID);
          if (arjun && arjun.availableToday && job.trade === arjun.trade) {
            pushSms(jobAlertSms(job), { jobId: job.id });
          }
          return job;
        },

        requestJob: (jobId, workerId, via = "app") => {
          const s = get();
          const job = findJob(s, jobId);
          const wid = workerId ?? s.me.id;
          if (!job) return null;
          const existing = s.agreements.find((a) => a.jobId === jobId && a.workerId === wid && a.status !== "declined");
          if (existing) return existing;
          const a = newAgreement(job, wid, "worker", via);
          if (job.employerId === DEMO_EMPLOYER_ID) {
            notify({
              to: "employer",
              kind: "request",
              title: { en: `${workerName(wid)} wants your ${TRADES[job.trade].work.en.toLowerCase()}`, hi: "", mr: "" },
              body: { en: `Agreement ${a.code} · confirm to make it pakka`, hi: "", mr: "" },
              href: "/employer",
            });
          } else {
            // Other employers on the demo answer by themselves after a moment.
            setTimeout(() => {
              const cur = get().agreements.find((x) => x.id === a.id);
              if (cur?.status === "requested") employerSaysYes(cur);
            }, 2600);
          }
          if (via === "sms") {
            pushSms({
              hi: `${employerName(job.employerId)} को आपकी माँग भेज दी। हाँ होते ही SMS आएगा।`,
              en: `Your request was sent to ${employerName(job.employerId)}. You will get an SMS when they say yes.`,
            });
          }
          return a;
        },

        offerJob: (jobId, workerId) => {
          const s = get();
          const job = findJob(s, jobId);
          if (!job) return null;
          const existing = s.agreements.find(
            (a) => a.jobId === jobId && a.workerId === workerId && !["declined", "paid"].includes(a.status),
          );
          if (existing) return existing;
          const a = newAgreement(job, workerId, "employer", workerId === SMS_WORKER_ID ? "sms" : "app");
          const emp = employerName(job.employerId);
          if (workerId === s.me.id) {
            notify({
              to: "worker",
              kind: "offer",
              title: l10n("offerFor", { employer: emp }),
              body: {
                en: `${TRADES[job.trade].work.en} · ${AREAS[job.area].name.en} · ${money(job.pay)}`,
                hi: `${TRADES[job.trade].work.hi} · ${AREAS[job.area].name.hi} · ${money(job.pay)}`,
                mr: `${TRADES[job.trade].work.mr} · ${AREAS[job.area].name.mr} · ${money(job.pay)}`,
              },
              href: `/worker/agreement/${a.id}`,
            });
          } else if (workerId === SMS_WORKER_ID) {
            const alert = jobAlertSms(job);
            pushSms(
              {
                hi: `${emp} आपको काम देना चाहते हैं। ${alert.hi.replace("नाका: ", "").replace("काम चाहिए तो 1 भेजें।", "")}हाँ = 1, ना = 2`,
                en: `${emp} wants to hire you. ${alert.en.replace("NAKA: ", "").replace("Reply 1 to get this work.", "")}Yes = 1, No = 2`,
              },
              { agreementId: a.id },
            );
          }
          return a;
        },

        respond: (agreementId, accept, by) => {
          const a = get().agreements.find((x) => x.id === agreementId);
          if (!a) return;
          if (by === "employer") {
            if (accept) employerSaysYes(a);
            else {
              patchAgreement(a.id, { status: "declined" });
              if (a.workerId === get().me.id)
                notify({ to: "worker", kind: "declined", title: l10n("statusDeclined"), body: l10n("noJobsHint"), href: `/worker/agreement/${a.id}` });
            }
            return;
          }
          patchAgreement(a.id, accept ? { status: "agreed", workerAgreedAt: Date.now() } : { status: "declined" });
          if (a.employerId === DEMO_EMPLOYER_ID) {
            const w = workerName(a.workerId);
            notify({
              to: "employer",
              kind: accept ? "accepted" : "declined",
              title: { en: accept ? `${w} accepted — it's pakka` : `${w} said no this time`, hi: "", mr: "" },
              body: { en: `Agreement ${a.code}`, hi: "", mr: "" },
              href: "/employer",
            });
          }
        },

        markDone: (agreementId) => {
          const a = get().agreements.find((x) => x.id === agreementId);
          if (!a) return;
          const job = findJob(get(), a.jobId);
          patchAgreement(a.id, { status: "done", doneAt: Date.now() });
          const amount = job ? (job.unit === "day" ? job.pay * job.days : job.pay) : 0;
          const emp = employerName(a.employerId);
          if (a.workerId === get().me.id) {
            notify({
              to: "worker",
              kind: "paid",
              title: l10n("gotPaidQ", { amount: amount.toLocaleString("en-IN") }),
              body: { en: `${emp} marked the work done and paid`, hi: `${emp} ने काम पूरा और पैसा भेजा बताया`, mr: `${emp} यांनी काम पूर्ण आणि पैसे दिल्याचे सांगितले` },
              href: `/worker/agreement/${a.id}`,
            });
          } else if (a.workerId === SMS_WORKER_ID) {
            pushSms(
              {
                hi: `${emp} ने बताया ${money(amount)} दे दिए। क्या आपको मिले? हाँ = 1, नहीं = 2`,
                en: `${emp} says ${money(amount)} was paid. Did you get it? Yes = 1, No = 2`,
              },
              { agreementId: a.id },
            );
          }
        },

        confirmPaid: (agreementId, paid) => {
          const s = get();
          const a = s.agreements.find((x) => x.id === agreementId);
          if (!a) return;
          const job = findJob(s, a.jobId);
          patchAgreement(a.id, paid ? { status: "paid", paidAt: Date.now() } : { status: "disputed" });
          if (job && a.workerId === s.me.id) {
            const days = job.unit === "day" ? Math.min(job.days, 5) : 1;
            const entries: KhataEntry[] = Array.from({ length: days }, (_, i) => ({
              id: uid("k"),
              date: isoDaysAgo(i),
              employer: employerName(a.employerId),
              trade: job.trade,
              amount: job.unit === "day" ? job.pay : job.pay,
              paid,
              agreementId: a.id,
            }));
            set((st) => ({ khata: [...entries, ...st.khata], me: { ...st.me, jobsDone: st.me.jobsDone + (paid ? 1 : 0) } }));
          }
          if (a.employerId === DEMO_EMPLOYER_ID) {
            const w = workerName(a.workerId);
            notify({
              to: "employer",
              kind: paid ? "paid" : "info",
              title: { en: paid ? `${w} confirmed the payment` : `${w} says the payment didn't arrive`, hi: "", mr: "" },
              body: { en: paid ? `Agreement ${a.code} is closed. Rate ${firstName(w)} to help others hire.` : `Agreement ${a.code} — please check your UPI or cash payment.`, hi: "", mr: "" },
              href: "/employer",
            });
          }
          if (a.workerId === SMS_WORKER_ID) {
            pushSms(
              paid
                ? { hi: "धन्यवाद! पैसा आपके नाका खाते में दर्ज हो गया।", en: "Thank you! The payment is recorded in your Naka Khata." }
                : { hi: "शिकायत दर्ज। सुनील पाटिल (नाका साथी) आपसे बात करेंगे। मुफ़्त कानूनी मदद: 15100", en: "Complaint recorded. Sunil Patil (Naka Saathi) will talk to you. Free legal aid: 15100" },
            );
          }
        },

        addKhata: (entry) => set((s) => ({ khata: [{ ...entry, id: uid("k") }, ...s.khata] })),
        markKhataPaid: (id) => set((s) => ({ khata: s.khata.map((k) => (k.id === id ? { ...k, paid: true } : k)) })),
        reportJob: (jobId) => set((s) => ({ reported: s.reported.includes(jobId) ? s.reported : [...s.reported, jobId] })),
        toggleScheme: (id) =>
          set((s) => ({ savedSchemes: s.savedSchemes.includes(id) ? s.savedSchemes.filter((x) => x !== id) : [...s.savedSchemes, id] })),
        toggleDoc: (id) => set((s) => ({ docsHave: s.docsHave.includes(id) ? s.docsHave.filter((x) => x !== id) : [...s.docsHave, id] })),
        setEligibility: (eligibility) => set({ eligibility }),
        markNoticeRead: (id) => set((s) => ({ notices: s.notices.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

        smsReply: (digit) => {
          const s = get();
          pushSms({ hi: digit, en: digit }, {}, "me");
          // Answer the latest message that is waiting for a reply.
          const pending = [...s.sms].reverse().find((m) => m.from === "naka" && (m.agreementId || m.jobId));
          if (digit === "0") {
            pushSms({ hi: `मदद: अपने नाका साथी ${SAATHI_NAME} से बात करें, या मुफ़्त कानूनी मदद 15100 पर कॉल करें।`, en: `Help: talk to your Naka Saathi ${SAATHI_NAME}, or call free legal aid on 15100.` });
            return;
          }
          if (!pending) {
            pushSms({ hi: "अभी कोई सवाल बाकी नहीं है। काम आने पर SMS आएगा।", en: "Nothing to answer right now. You will get an SMS when work comes." });
            return;
          }
          // Mark this message as answered so the next reply goes to a newer one.
          set((st) => ({ sms: st.sms.map((m) => (m.id === pending.id ? { ...m, agreementId: undefined, jobId: undefined } : m)) }));
          if (pending.jobId) {
            if (digit === "1") get().requestJob(pending.jobId, SMS_WORKER_ID, "sms");
            else pushSms({ hi: "ठीक है। अगला काम आने पर बताएँगे।", en: "Okay. We will tell you about the next work." });
            return;
          }
          const a = s.agreements.find((x) => x.id === pending.agreementId);
          if (!a) return;
          if (a.status === "offered") {
            get().respond(a.id, digit === "1", "worker");
            const job = findJob(get(), a.jobId);
            if (digit === "1" && job) confirmedSms({ ...a, status: "agreed" });
            else pushSms({ hi: "ठीक है, मालिक को बता दिया।", en: "Okay, the employer has been told." });
          } else if (a.status === "done") {
            get().confirmPaid(a.id, digit === "1");
          }
        },

        saathiToggle: (workerId) =>
          set((s) => ({ saathiPresent: { ...s.saathiPresent, [workerId]: !s.saathiPresent[workerId] } })),
        saathiSendJob: (workerId, jobId) => {
          const s = get();
          const job = findJob(s, jobId);
          set((st) => ({ smsSentJobs: { ...st.smsSentJobs, [workerId]: [...(st.smsSentJobs[workerId] ?? []), jobId] } }));
          if (job && workerId === SMS_WORKER_ID) pushSms(jobAlertSms(job), { jobId });
        },

        reset: () => set(initialData()),
      };
    },
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: () => initialData() as DemoState,
    },
  ),
);
