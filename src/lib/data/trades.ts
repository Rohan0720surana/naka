import type { L10n, TradeId } from "@/lib/types";

export interface Trade {
  id: TradeId;
  label: L10n;
  work: L10n;
  /** Usual day rate near the Ghatkopar–Powai belt (mock market data). */
  fairDay: [number, number];
  /** Words a worker might say for this trade, in any language. */
  says: string[];
}

export const TRADES: Record<TradeId, Trade> = {
  painter: {
    id: "painter",
    label: { en: "Painter", hi: "पेंटर", mr: "रंगारी" },
    work: { en: "Painting work", hi: "पेंटिंग का काम", mr: "रंगकाम" },
    fairDay: [750, 950],
    says: ["paint", "painter", "पेंट", "पेंटर", "रंग", "रंगारी", "पुताई", "rangari"],
  },
  plumber: {
    id: "plumber",
    label: { en: "Plumber", hi: "प्लंबर", mr: "प्लंबर" },
    work: { en: "Plumbing work", hi: "प्लंबिंग का काम", mr: "प्लंबिंगचे काम" },
    fairDay: [800, 1100],
    says: ["plumb", "plumber", "pipe", "प्लंबर", "नल", "पाइप", "नळ"],
  },
  electrician: {
    id: "electrician",
    label: { en: "Electrician", hi: "इलेक्ट्रीशियन", mr: "इलेक्ट्रिशियन" },
    work: { en: "Electrical work", hi: "बिजली का काम", mr: "वीजकाम" },
    fairDay: [850, 1150],
    says: ["electric", "wiring", "बिजली", "इलेक्ट्री", "वायरिंग", "वीज", "लाइट"],
  },
  carpenter: {
    id: "carpenter",
    label: { en: "Carpenter", hi: "बढ़ई", mr: "सुतार" },
    work: { en: "Carpentry work", hi: "बढ़ई का काम", mr: "सुतारकाम" },
    fairDay: [900, 1200],
    says: ["carpent", "wood", "furniture", "बढ़ई", "कारपेंटर", "लकड़ी", "सुतार", "फर्निचर", "फर्नीचर"],
  },
  mason: {
    id: "mason",
    label: { en: "Mason", hi: "राजमिस्त्री", mr: "गवंडी" },
    work: { en: "Masonry work", hi: "चिनाई का काम", mr: "बांधकाम" },
    fairDay: [850, 1100],
    says: ["mason", "brick", "plaster", "मिस्त्री", "चिनाई", "गवंडी", "प्लास्टर", "ईंट"],
  },
  labourer: {
    id: "labourer",
    label: { en: "Helper / Labourer", hi: "मज़दूर / हेल्पर", mr: "मजूर / हेल्पर" },
    work: { en: "Helper work", hi: "हेल्पर का काम", mr: "मजुरीचे काम" },
    fairDay: [600, 800],
    says: ["labour", "helper", "loading", "मज़दूर", "मजदूर", "हेल्पर", "मजूर", "लोडिंग", "हमाल"],
  },
  cleaner: {
    id: "cleaner",
    label: { en: "Cleaner / Sweeper", hi: "सफ़ाई कर्मचारी", mr: "सफाई कामगार" },
    work: { en: "Cleaning work", hi: "सफ़ाई का काम", mr: "सफाईचे काम" },
    fairDay: [500, 700],
    says: ["clean", "sweep", "housekeep", "सफ़ाई", "सफाई", "झाड़ू", "झाडू"],
  },
  tiler: {
    id: "tiler",
    label: { en: "Tile fitter", hi: "टाइल मिस्त्री", mr: "टाइल फिटर" },
    work: { en: "Tiling work", hi: "टाइल का काम", mr: "टाइलचे काम" },
    fairDay: [850, 1150],
    says: ["tile", "tiles", "टाइल", "फरशी"],
  },
};

export const TRADE_ORDER: TradeId[] = [
  "painter",
  "plumber",
  "electrician",
  "carpenter",
  "mason",
  "labourer",
  "cleaner",
  "tiler",
];
