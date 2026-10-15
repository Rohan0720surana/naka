import type { Metadata } from "next";
import { AppShell } from "@/components/worker/AppShell";

export const metadata: Metadata = { title: "Naka Saathi" };

export default function SaathiLayout({ children }: LayoutProps<"/saathi">) {
  return <AppShell mode="saathi">{children}</AppShell>;
}
