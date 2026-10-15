import type { AreaId, L10n } from "@/lib/types";

export interface Area {
  id: AreaId;
  name: L10n;
  pin: { x: number; y: number };
}

export const AREAS: Record<AreaId, Area> = {
  ghatkopar: { id: "ghatkopar", name: { en: "Ghatkopar", hi: "घाटकोपर", mr: "घाटकोपर" }, pin: { x: 48, y: 52 } },
  vidyavihar: { id: "vidyavihar", name: { en: "Vidyavihar", hi: "विद्याविहार", mr: "विद्याविहार" }, pin: { x: 36, y: 62 } },
  kurla: { id: "kurla", name: { en: "Kurla", hi: "कुर्ला", mr: "कुर्ला" }, pin: { x: 22, y: 72 } },
  vikhroli: { id: "vikhroli", name: { en: "Vikhroli", hi: "विक्रोली", mr: "विक्रोळी" }, pin: { x: 64, y: 36 } },
  powai: { id: "powai", name: { en: "Powai", hi: "पवई", mr: "पवई" }, pin: { x: 52, y: 20 } },
  chembur: { id: "chembur", name: { en: "Chembur", hi: "चेंबूर", mr: "चेंबूर" }, pin: { x: 44, y: 86 } },
  sion: { id: "sion", name: { en: "Sion", hi: "सायन", mr: "सायन" }, pin: { x: 12, y: 88 } },
  mulund: { id: "mulund", name: { en: "Mulund", hi: "मुलुंड", mr: "मुलुंड" }, pin: { x: 86, y: 12 } },
  andheri: { id: "andheri", name: { en: "Andheri", hi: "अंधेरी", mr: "अंधेरी" }, pin: { x: 8, y: 16 } },
  thane: { id: "thane", name: { en: "Thane", hi: "ठाणे", mr: "ठाणे" }, pin: { x: 94, y: 5 } },
  abroad: { id: "abroad", name: { en: "Abroad (Dubai)", hi: "विदेश (दुबई)", mr: "परदेश (दुबई)" }, pin: { x: 98, y: 98 } },
};

/** Distance and usual travel from Ghatkopar Naka, used for newly posted work. */
export const FROM_NAKA: Partial<Record<AreaId, { km: number; mode: "walk" | "bus" | "train" | "auto"; minutes: number }>> = {
  ghatkopar: { km: 0.8, mode: "walk", minutes: 10 },
  vidyavihar: { km: 1.9, mode: "walk", minutes: 22 },
  vikhroli: { km: 3.4, mode: "auto", minutes: 12 },
  kurla: { km: 4, mode: "bus", minutes: 20 },
  powai: { km: 5.2, mode: "bus", minutes: 25 },
  chembur: { km: 6.5, mode: "bus", minutes: 30 },
  sion: { km: 7, mode: "train", minutes: 20 },
  mulund: { km: 9, mode: "train", minutes: 25 },
};

/** Areas an employer can pick when posting work. */
export const POSTABLE_AREAS: AreaId[] = [
  "powai",
  "ghatkopar",
  "vidyavihar",
  "vikhroli",
  "kurla",
  "chembur",
  "sion",
  "mulund",
];

export interface Naka {
  id: string;
  name: L10n;
  spot: L10n;
  area: AreaId;
  workersMorning: number;
}

export const NAKAS: Record<string, Naka> = {
  "ghatkopar-naka": {
    id: "ghatkopar-naka",
    name: { en: "Ghatkopar Naka", hi: "घाटकोपर नाका", mr: "घाटकोपर नाका" },
    spot: { en: "LBS Marg, near the flyover", hi: "एलबीएस मार्ग, फ्लाईओवर के पास", mr: "एलबीएस मार्ग, उड्डाणपुलाजवळ" },
    area: "ghatkopar",
    workersMorning: 140,
  },
  "kurla-naka": {
    id: "kurla-naka",
    name: { en: "Kurla Naka", hi: "कुर्ला नाका", mr: "कुर्ला नाका" },
    spot: { en: "Outside Kurla depot", hi: "कुर्ला डिपो के बाहर", mr: "कुर्ला डेपोबाहेर" },
    area: "kurla",
    workersMorning: 95,
  },
  "vikhroli-naka": {
    id: "vikhroli-naka",
    name: { en: "Vikhroli Naka", hi: "विक्रोली नाका", mr: "विक्रोळी नाका" },
    spot: { en: "Kannamwar Nagar bus stop", hi: "कन्नमवार नगर बस स्टॉप", mr: "कन्नमवार नगर बस थांबा" },
    area: "vikhroli",
    workersMorning: 80,
  },
  "chembur-naka": {
    id: "chembur-naka",
    name: { en: "Chembur Naka", hi: "चेंबूर नाका", mr: "चेंबूर नाका" },
    spot: { en: "Near Chembur station", hi: "चेंबूर स्टेशन के पास", mr: "चेंबूर स्टेशनजवळ" },
    area: "chembur",
    workersMorning: 70,
  },
};
