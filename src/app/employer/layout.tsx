import type { Metadata } from "next";
import { EmployerShell } from "@/components/employer/EmployerShell";

export const metadata: Metadata = { title: "For employers" };

export default function EmployerLayout({ children }: LayoutProps<"/employer">) {
  return <EmployerShell>{children}</EmployerShell>;
}
