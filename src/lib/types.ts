export type Lang = "en" | "hi" | "mr";

/** A string in every language the worker app speaks. */
export type L10n = Record<Lang, string>;

export type TradeId =
  | "painter"
  | "plumber"
  | "electrician"
  | "carpenter"
  | "mason"
  | "labourer"
  | "cleaner"
  | "tiler";

export type AreaId =
  | "ghatkopar"
  | "vidyavihar"
  | "kurla"
  | "vikhroli"
  | "powai"
  | "chembur"
  | "sion"
  | "mulund"
  | "andheri"
  | "thane"
  | "abroad";

export type PayUnit = "day" | "job" | "month";
export type PayTiming = "same-day" | "weekly" | "monthly" | "unclear";
export type PayMode = "cash" | "upi" | "bank";
export type JobSpan = "today" | "few-days" | "long-term";
export type Provided = "tools" | "materials" | "lunch" | "tea" | "travel";
export type EmployerKind = "home" | "contractor" | "company" | "agent";

export interface Employer {
  id: string;
  name: string;
  kind: EmployerKind;
  area: AreaId;
  phoneVerified: boolean;
  hiredOnNaka: number;
  paidOnTime: number;
  rating: number | null;
  since: string;
}

export interface Job {
  id: string;
  trade: TradeId;
  employerId: string;
  area: AreaId;
  landmark: string;
  /** Position on the illustrated area map, 0–100 on both axes. */
  pin: { x: number; y: number };
  km: number;
  travel: { mode: "walk" | "bus" | "train" | "auto"; minutes: number };
  pay: number;
  unit: PayUnit;
  startHour: number;
  endHour: number;
  days: number;
  span: JobSpan;
  startsIn: 0 | 1 | 2 | 3;
  workers: number;
  provided: Provided[];
  payTiming: PayTiming;
  payMode: PayMode;
  note?: L10n;
  /** Scam signals the listing carries. */
  feeAsked?: number;
  keepsDocuments?: boolean;
  abroad?: boolean;
  vagueLocation?: boolean;
  postedMinutesAgo: number;
  /** Created live by the demo employer. */
  live?: boolean;
}

export type PhoneKind = "smart" | "feature" | "none";

export interface Vouch {
  by: string;
  role: L10n;
  quote: L10n;
  known: L10n;
}

export interface Worker {
  id: string;
  name: string;
  /** The name in Devanagari, for Hindi and Marathi screens. */
  nameDeva?: string;
  trade: TradeId;
  years: number;
  naka: string;
  areas: AreaId[];
  languages: string[];
  rating: number;
  jobsDone: number;
  daysLogged: number;
  expectedDay: number;
  phone: PhoneKind;
  phoneVerified: boolean;
  availableToday: boolean;
  pin: { x: number; y: number };
  km: number;
  hue: number;
  skills: L10n[];
  vouches: Vouch[];
  helpedBy?: string;
}

export type AgreementStatus =
  | "offered"
  | "requested"
  | "agreed"
  | "declined"
  | "done"
  | "paid"
  | "disputed";

export interface Agreement {
  id: string;
  code: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: AgreementStatus;
  initiatedBy: "worker" | "employer";
  createdAt: number;
  workerAgreedAt?: number;
  employerAgreedAt?: number;
  doneAt?: number;
  paidAt?: number;
  via: "app" | "sms";
}

export interface KhataEntry {
  id: string;
  date: string;
  employer: string;
  trade: TradeId;
  amount: number;
  paid: boolean;
  agreementId?: string;
}

export interface Notice {
  id: string;
  to: "worker" | "employer";
  kind: "new-job" | "offer" | "request" | "accepted" | "declined" | "paid" | "info";
  title: L10n;
  body: L10n;
  href?: string;
  createdAt: number;
  read: boolean;
}

export interface Sms {
  id: string;
  from: "naka" | "me";
  /** Hindi is what the phone shows; English is the gloss shown in the demo. */
  text: { hi: string; en: string };
  at: number;
  /** Replying 1 / 2 answers this agreement (offer or payment check). */
  agreementId?: string;
  /** Replying 1 asks for this job (job alert). */
  jobId?: string;
}

export interface EligibilityAnswers {
  age: "18-40" | "41-59" | "60+";
  work: "construction" | "vending" | "household" | "other";
  income: "under-15k" | "over-15k";
  bank: "yes" | "no";
}
