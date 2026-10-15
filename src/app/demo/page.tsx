import type { Metadata } from "next";
import { DemoStage } from "@/components/demo/DemoStage";

export const metadata: Metadata = { title: "Live demo" };

export default function DemoPage() {
  return <DemoStage />;
}
