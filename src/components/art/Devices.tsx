import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A realistic Android phone: slim bezels, punch-hole camera, side keys. */
export function AndroidFrame({
  children,
  className,
  screenClassName,
  tilt,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  tilt?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[300px] rounded-[2.6rem] bg-[#0f1230] p-[9px] shadow-[0_50px_90px_-30px_rgba(22,26,61,0.7),inset_0_0_0_2px_#2b3166]",
        tilt && "rotate-[-3deg]",
        className,
      )}
    >
      <span className="absolute top-28 -right-[3px] h-14 w-[4px] rounded-r bg-[#0f1230]" aria-hidden="true" />
      <span className="absolute top-48 -right-[3px] h-9 w-[4px] rounded-r bg-[#0f1230]" aria-hidden="true" />
      <div className={cn("relative overflow-hidden rounded-[2.1rem] bg-paper", screenClassName)}>
        <div className="flex h-7 items-center justify-between bg-paper px-5 text-[0.65rem] font-bold text-ink/70" aria-hidden="true">
          <span>7:08</span>
          <span className="size-3 rounded-full bg-[#0f1230]" />
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-[2px]">
              {[3, 5, 7, 9].map((h) => (
                <span key={h} className="w-[3px] rounded-sm bg-ink/70" style={{ height: h }} />
              ))}
            </span>
            <span className="h-2.5 w-5 rounded-[3px] border border-ink/70 p-[1px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-ink/70" />
            </span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A laptop with a browser window, for showing the employer site. */
export function LaptopFrame({ children, url, className }: { children: ReactNode; url: string; className?: string }) {
  return (
    <div className={cn("mx-auto w-full", className)}>
      <div className="rounded-t-[1.2rem] border-[3px] border-b-0 border-[#0f1230] bg-[#0f1230] p-2.5 pb-0">
        <div className="overflow-hidden rounded-t-lg bg-white">
          <div className="flex items-center gap-2 border-b border-ink/10 bg-sand px-3 py-2" aria-hidden="true">
            <span className="flex gap-1">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
            </span>
            <span className="flex h-5 flex-1 items-center gap-1 rounded-full bg-white px-2 text-[0.6rem] font-bold text-muted">
              <Lock className="size-2.5" />
              {url}
            </span>
          </div>
          {children}
        </div>
      </div>
      <div className="relative h-4 rounded-b-[1rem] bg-gradient-to-b from-[#c7c9d6] to-[#9a9db0]" aria-hidden="true">
        <span className="absolute top-0 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-[#8a8da1]" />
      </div>
    </div>
  );
}
