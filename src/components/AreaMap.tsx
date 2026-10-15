import { AREAS } from "@/lib/data/places";
import type { AreaId, Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface MapPin {
  id: string;
  x: number;
  y: number;
  kind: "job" | "naka" | "worker" | "help" | "me" | "danger";
  label?: string;
  active?: boolean;
  onClick?: () => void;
}

const LABELLED: AreaId[] = ["powai", "vikhroli", "ghatkopar", "vidyavihar", "kurla", "chembur", "sion", "mulund", "andheri"];

const RAIL = "M10,92 L22,72 L36,62 L48,52 L56,44 L64,36 L72,26 L80,18 L86,12 L94,4";

/**
 * An illustrated map of the Kurla–Ghatkopar–Powai belt. Pins are HTML so
 * they can be real, labelled buttons; the drawing is decorative.
 */
export function AreaMap({
  pins,
  lang = "en",
  className,
  showLabels = true,
  label,
}: {
  pins: MapPin[];
  lang?: Lang;
  className?: string;
  showLabels?: boolean;
  label: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[1.25rem] border-2 border-ink/15 bg-[#f1e7d2]", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <pattern id="map-dots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.35" fill="#161a3d" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#map-dots)" />
        {/* Thane creek */}
        <path d="M100,0 L100,100 L90,100 C94,80 86,64 92,48 C97,34 90,20 96,0 Z" fill="#cfe0f2" />
        {/* Powai and Vihar lakes */}
        <path d="M36,14 C42,8 52,10 54,16 C56,22 48,27 42,25 C36,23 31,19 36,14 Z" fill="#cfe0f2" />
        <path d="M20,30 C24,27 30,29 29,33 C28,37 21,37 19,34 Z" fill="#cfe0f2" />
        {/* Green belt */}
        <path d="M0,0 L30,0 C26,10 18,14 10,26 C6,32 2,34 0,36 Z" fill="#d9e8cf" />
        {/* Roads: LBS Marg, Eastern Express Highway, JVLR */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14,84 L30,64 L44,49 L60,31 L82,8" stroke="#fff" strokeWidth="3.2" />
          <path d="M30,100 L52,70 L70,44 L92,10" stroke="#fff" strokeWidth="3.6" />
          <path d="M4,18 C20,20 34,24 52,22 C58,24 62,30 64,36" stroke="#fff" strokeWidth="2.6" />
          <path d="M14,84 L30,64 L44,49 L60,31 L82,8" stroke="#f5b014" strokeOpacity="0.45" strokeWidth="1.2" />
          <path d="M30,100 L52,70 L70,44 L92,10" stroke="#f5b014" strokeOpacity="0.55" strokeWidth="1.4" />
        </g>
        {/* Central line railway */}
        <path d={RAIL} fill="none" stroke="#161a3d" strokeOpacity="0.55" strokeWidth="1.6" />
        <path d={RAIL} fill="none" stroke="#fff" strokeWidth="0.7" strokeDasharray="1.6 1.6" />
      </svg>

      {showLabels
        ? LABELLED.map((id) => {
            const a = AREAS[id];
            return (
              <span
                key={id}
                className="pointer-events-none absolute -translate-x-1/2 translate-y-2 text-[0.68rem] font-bold tracking-wide text-ink/55 uppercase"
                style={{ left: `${a.pin.x}%`, top: `${a.pin.y}%` }}
                aria-hidden="true"
              >
                {a.name[lang]}
              </span>
            );
          })
        : null}

      <ul aria-label={label} className="absolute inset-0">
        {pins.map((pin) => (
          <li key={pin.id} className="absolute" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
            <PinMark pin={pin} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PinMark({ pin }: { pin: MapPin }) {
  const tone = {
    job: "bg-marigold text-ink",
    naka: "bg-ink text-marigold",
    worker: "bg-white text-ink",
    help: "bg-sky text-white",
    me: "bg-leaf text-white",
    danger: "bg-danger text-white",
  }[pin.kind];
  const body = (
    <span
      className={cn(
        "relative flex -translate-x-1/2 -translate-y-full flex-col items-center",
        pin.active ? "z-20" : "z-10",
      )}
    >
      <span
        className={cn(
          "flex min-h-7 min-w-7 items-center justify-center rounded-full border-2 border-ink px-1.5 text-[0.7rem] font-extrabold whitespace-nowrap shadow-[0_2px_0_0_var(--color-ink)]",
          tone,
          pin.active && "scale-125 ring-4 ring-marigold/60",
        )}
      >
        {pin.label ?? ""}
      </span>
      <span className="h-2 w-0.5 bg-ink" />
    </span>
  );
  if (pin.onClick)
    return (
      <button type="button" onClick={pin.onClick} aria-label={pin.label} className="block">
        {body}
      </button>
    );
  return body;
}
