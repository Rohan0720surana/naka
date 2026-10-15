import Link from "next/link";
import { CircleAlert, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import type { RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ink" | "outline" | "ghost" | "danger" | "leaf";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-sign bg-marigold text-ink border-2 border-ink hover:bg-[#ffbf2e]",
  ink: "bg-ink text-paper border-2 border-ink hover:bg-ink-2 transition-colors",
  outline: "btn-sign bg-white text-ink border-2 border-ink hover:bg-sand",
  ghost: "text-ink hover:bg-ink/6 border-2 border-transparent transition-colors",
  danger: "btn-sign bg-danger text-white border-2 border-ink hover:bg-[#c32a33]",
  leaf: "btn-sign bg-leaf text-white border-2 border-ink hover:bg-[#178a43]",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-3.5 text-[0.95rem] gap-1.5 rounded-xl",
  md: "h-12 px-5 text-base gap-2 rounded-2xl",
  lg: "h-14 px-6 text-lg gap-2.5 rounded-2xl",
  xl: "h-16 px-7 text-xl gap-3 rounded-[1.25rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center font-bold leading-none whitespace-nowrap disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Chip({
  selected,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-[0.95rem] font-bold transition-colors",
        selected ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink hover:border-ink/40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-[1.4rem] border-2 border-ink/10 bg-white shadow-card", className)} {...props} />;
}

export function Tag({
  tone = "sand",
  className,
  children,
  icon,
}: {
  tone?: "sand" | "leaf" | "alert" | "danger" | "sky" | "ink" | "marigold";
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const tones = {
    sand: "bg-sand text-ink",
    leaf: "bg-leaf-soft text-leaf",
    alert: "bg-alert-soft text-alert",
    danger: "bg-danger-soft text-danger",
    sky: "bg-sky-soft text-sky",
    ink: "bg-ink text-paper",
    marigold: "bg-marigold-soft text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.8rem] leading-none font-bold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export const SHIELD_STYLE: Record<RiskLevel, { tone: "leaf" | "alert" | "danger"; Icon: typeof ShieldCheck }> = {
  safe: { tone: "leaf", Icon: ShieldCheck },
  careful: { tone: "alert", Icon: ShieldAlert },
  danger: { tone: "danger", Icon: ShieldX },
};

export function ShieldBadge({ level, label, className }: { level: RiskLevel; label: string; className?: string }) {
  const { tone, Icon } = SHIELD_STYLE[level];
  return (
    <Tag tone={tone} className={className} icon={<Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />}>
      {label}
    </Tag>
  );
}

export function SectionTitle({
  children,
  action,
  className,
  id,
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <h2 id={id} className="font-display text-[1.35rem] leading-tight font-extrabold text-ink">
        {children}
      </h2>
      {action}
    </div>
  );
}

export function Notice({ tone = "sky", children, className }: { tone?: "sky" | "alert" | "leaf"; children: ReactNode; className?: string }) {
  const tones = { sky: "bg-sky-soft text-ink", alert: "bg-alert-soft text-ink", leaf: "bg-leaf-soft text-ink" };
  return (
    <div className={cn("flex gap-2.5 rounded-2xl p-3.5 text-[0.95rem] leading-snug", tones[tone], className)}>
      <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
