import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Courier_Prime, Hind, Kalam, Khand, Yatra_One } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Body: Atkinson Hyperlegible (made for low-vision readers) with Hind for Devanagari.
const atkinson = Atkinson_Hyperlegible({ variable: "--font-atkinson", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const hind = Hind({ variable: "--font-hind", subsets: ["devanagari", "latin"], weight: ["400", "500", "600", "700"], display: "swap" });
// Display: Khand, a condensed face that reads like painted shop and truck signboards, in both scripts.
const khand = Khand({ variable: "--font-khand", subsets: ["devanagari", "latin"], weight: ["500", "600", "700"], display: "swap" });
// Accents: a hand-lettered Hindi poster face, handwriting for people's own words, a typewriter for agreements.
const yatra = Yatra_One({ variable: "--font-yatra", subsets: ["devanagari", "latin"], weight: "400", display: "swap" });
const kalam = Kalam({ variable: "--font-kalam", subsets: ["devanagari", "latin"], weight: ["400", "700"], display: "swap" });
const courier = Courier_Prime({ variable: "--font-courier", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "RozGhar — the labour naka, in your pocket",
    template: "%s · RozGhar",
  },
  description:
    "RozGhar helps daily-wage workers find nearby work, show their skills without a résumé, trust every deal, and reach their rights — by voice, in their own language.",
  applicationName: "RozGhar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161a3d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${atkinson.variable} ${hind.variable} ${khand.variable} ${yatra.variable} ${kalam.variable} ${courier.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
