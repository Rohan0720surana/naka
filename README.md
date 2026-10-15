# RozGhar — the labour naka, in your pocket

Frontend prototype for **Artemis 2026 (ACM KJSSE · Abhiyantriki), Problem Statement 2 — "Beyond the Waiting Line"**.

RozGhar helps daily-wage workers and hawkers find nearby work with clear pay, show their skills without a résumé,
trust every deal before they commit, and reach welfare schemes — by voice, in Hindi, Marathi and English, and even
on a button phone. It keeps the roadside naka at the centre instead of replacing it.

All people, jobs, employers and help centres are sample data. Helpline numbers are real public helplines; scheme
details are simplified.

## Run it

```bash
npm install
npm run dev          # on Windows PowerShell use: npm.cmd run dev
```

Open http://localhost:3000 (or the port shown). For the hackathon demo, open **/demo**.

Production build: `npm run build` then `npm start`.

## What to open

| Route | What it is |
| --- | --- |
| `/` | Landing page: product reel, scroll story of a morning at the naka, personas, features |
| `/demo` | **Live demo**: worker phone, button phone (SMS), Naka Saathi and employer site side by side, all in sync |
| `/worker/welcome` | Onboarding: choose language, then speak or tap pictures to make a Kaam Card |
| `/worker` | Worker home: "free today" switch, offers, work feed (list or map) |
| `/worker/job/[id]` | Job: pay, hours bar, map, what's given, fair-pay meter, safety check, Pakka agreement |
| `/worker/agreement/[id]` | Pakka agreement: status steps, terms, both sides' consent, payment check, dispute help |
| `/worker/card` | Kaam Card with QR, before/after work photos, vouches |
| `/worker/khata` | Kamai Khata: earnings, unpaid dues, 30-day calendar, 90-day welfare board progress |
| `/worker/haq` | Rights: 4-tap eligibility check, schemes, papers checklist, help centres, helplines |
| `/saathi` | Naka Saathi: one smartphone helping workers who have none |
| `/employer` | Employer dashboard: requests and agreements |
| `/employer/post` | Post work in 3 steps with a live preview in Hindi/Marathi/English and a safety check |
| `/employer/workers` | Find workers (list + map), scan a Kaam Card |

## 5-minute demo script (on /demo)

1. **Post work as Priya** — employer window → Post work → publish a painting job. Ramesh's phone gets an alert in his language.
2. **Ramesh checks it** — open the alert: pay, hours, place, fair-pay meter, safety check, Listen. Tap "I want this work".
3. **Make it pakka** — employer dashboard → Confirm. Both sides now hold agreement NK-24xx.
4. **Pay and log** — employer marks done & paid → Ramesh confirms → days land in his Kamai Khata.
5. **No smartphone** — switch to Arjun (SMS). Press **1** to ask for the helper job; the contractor says yes by SMS.

Also show: switch language to हिंदी / मराठी, open the "Painters needed in Dubai" listing (scam warning),
and the 4-tap rights check. Use **Reset demo** before presenting.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- Framer Motion for motion (respects reduced-motion)
- Framer Motion signature moments: rubber PAKKA stamp, scam hazard tape, naka scene that fills up, coins into the Khata, BEST bus on the skyline
- Magic UI components (Marquee, Number Ticker) — the same components 21st.dev lists, installed from
  Magic UI's public registry because 21st.dev now requires sign-in to install
- Zustand store persisted to localStorage and synced across tabs/frames
- Web Speech API for read-aloud and voice onboarding (example playback when no mic is available)
- Lucide icons + hand-drawn trade pictograms · Khand (signboard headings), Atkinson Hyperlegible + Hind (body), Yatra One, Kalam and Courier Prime

## Project layout

```
src/app/            routes (landing, demo, worker, saathi, employer)
src/components/     UI: worker/, employer/, landing/, demo/, ui/ (primitives + Magic UI)
src/lib/            store, i18n (en/hi/mr), scam & fair-pay checks, speech, formatting
src/lib/data/       sample jobs, workers, places, trades, schemes
```
