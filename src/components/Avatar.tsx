import { TradeIcon } from "@/components/icons/TradeIcon";
import { initials } from "@/lib/format";
import type { TradeId } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-10 text-sm",
  md: "size-14 text-lg",
  lg: "size-20 text-2xl",
  xl: "size-24 text-3xl",
};

export function Avatar({
  name,
  hue,
  size = "md",
  trade,
  className,
  ring,
}: {
  name: string;
  hue: number;
  size?: keyof typeof SIZES;
  trade?: TradeId;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border-2 border-ink font-display font-extrabold text-ink",
          SIZES[size],
          ring && "ring-4 ring-marigold",
        )}
        style={{ background: `hsl(${hue} 70% 86%)` }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      {trade ? (
        <span className="absolute -right-1.5 -bottom-1.5 rounded-full border-2 border-ink bg-white p-0.5">
          <TradeIcon trade={trade} className={size === "sm" ? "size-4" : size === "md" ? "size-5" : "size-7"} />
        </span>
      ) : null}
    </span>
  );
}
