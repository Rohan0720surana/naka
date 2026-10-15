import type { Metadata } from "next";
import { AppShell } from "@/components/worker/AppShell";

export const metadata: Metadata = { title: "Worker app" };

export default function WorkerLayout({ children }: LayoutProps<"/worker">) {
  return <AppShell mode="worker">{children}</AppShell>;
}
