import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Baloo_2, Mukta } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Naka — the labour naka, in your pocket",
    template: "%s · Naka",
  },
  description:
    "Naka helps daily-wage workers find nearby work, show their skills without a résumé, trust every deal, and reach their rights — by voice, in their own language.",
  applicationName: "Naka",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161a3d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${atkinson.variable} ${mukta.variable} ${baloo.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
