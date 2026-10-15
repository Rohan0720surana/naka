import { cn } from "@/lib/utils";

const INK = "#161a3d";

export type PersonaId = "ramesh" | "arjun" | "priya" | "sunil";

interface Look {
  bg: string;
  skin: string;
  shirt: string;
  hair: string;
}

const LOOKS: Record<PersonaId, Look> = {
  ramesh: { bg: "#fff2cf", skin: "#b9784f", shirt: "#5b7290", hair: "#1d1a1a" },
  arjun: { bg: "#e5edfd", skin: "#8d5a3b", shirt: "#ece3d0", hair: "#141212" },
  priya: { bg: "#e2f3e7", skin: "#c98b62", shirt: "#137a7a", hair: "#1b1414" },
  sunil: { bg: "#fde9de", skin: "#a8714f", shirt: "#b89b6a", hair: "#9a9a9a" },
};

/**
 * Flat, hand-drawn portraits of the four people in the RozGhar story. Drawn in
 * code so they stay crisp, light and in one consistent style.
 */
export function Portrait({ who, className, title }: { who: PersonaId; className?: string; title?: string }) {
  const l = LOOKS[who];
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id={`clip-${who}`}>
          <circle cx="60" cy="60" r="58" />
        </clipPath>
        <pattern id="gamchha" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <rect width="8" height="8" fill="#f4efe6" />
          <rect width="4" height="8" fill="#c8202f" />
          <rect width="8" height="2" fill="#c8202f" opacity=".55" />
        </pattern>
      </defs>
      <circle cx="60" cy="60" r="58" fill={l.bg} stroke={INK} strokeWidth="3" />
      <g clipPath={`url(#clip-${who})`}>
        {/* bun sits behind the head */}
        {who === "priya" ? <circle cx="60" cy="25" r="11" fill={l.hair} /> : null}
        {/* shoulders */}
        <path d="M14 124c2-28 20-40 46-40s44 12 46 40z" fill={l.shirt} stroke={INK} strokeWidth="3" />
        {who === "priya" ? <path d="M50 86l10 14 10-14" fill="none" stroke={INK} strokeWidth="2.5" /> : null}
        {who === "ramesh" ? (
          <g fill="#f5b014">
            <circle cx="34" cy="104" r="2.6" />
            <circle cx="84" cy="98" r="2" />
            <circle cx="90" cy="110" r="3" />
          </g>
        ) : null}
        {who === "arjun" ? <path d="M22 108 72 84l8 11-48 26z" fill="url(#gamchha)" stroke={INK} strokeWidth="2.5" /> : null}
        {who === "sunil" ? <path d="M48 86h24v8H48z" fill="#d9c79f" stroke={INK} strokeWidth="2" /> : null}
        {/* neck */}
        <rect x="51" y="68" width="18" height="18" rx="6" fill={l.skin} stroke={INK} strokeWidth="2.5" />
        {/* ears */}
        <ellipse cx="38" cy="54" rx="4.5" ry="6.5" fill={l.skin} stroke={INK} strokeWidth="2.5" />
        <ellipse cx="82" cy="54" rx="4.5" ry="6.5" fill={l.skin} stroke={INK} strokeWidth="2.5" />
        {who === "priya" ? (
          <>
            <circle cx="38" cy="62" r="2.6" fill="#f5b014" stroke={INK} strokeWidth="1.2" />
            <circle cx="82" cy="62" r="2.6" fill="#f5b014" stroke={INK} strokeWidth="1.2" />
          </>
        ) : null}
        {/* face */}
        <ellipse cx="60" cy="52" rx="22" ry="25" fill={l.skin} stroke={INK} strokeWidth="3" />
        {/* hair */}
        {who === "ramesh" ? (
          <path d="M38 49c-2-18 9-26 22-26s24 8 22 26c-3-9-10-13-22-13s-19 4-22 13z" fill={l.hair} />
        ) : null}
        {who === "arjun" ? (
          <path d="M38 50c-4-20 10-29 24-27 15 2 23 12 20 27-3-10-9-15-19-15-4 3-9 3-13 1-6 3-10 8-12 14z" fill={l.hair} />
        ) : null}
        {who === "priya" ? (
          <path d="M37 58c-3-24 9-33 23-33s26 9 23 33c-3-12-8-17-14-19-6 6-17 7-26 3-3 4-5 9-6 16z" fill={l.hair} />
        ) : null}
        {who === "sunil" ? (
          <path d="M38 55c-1-7 1-12 4-15 1 6 1 11-1 17zM82 55c1-7-1-12-4-15-1 6-1 11 1 17z" fill={l.hair} />
        ) : null}
        {/* painter's cap with paint marks */}
        {who === "ramesh" ? (
          <g>
            <path d="M37 39c1-17 45-17 46 0z" fill="#f7f3ea" stroke={INK} strokeWidth="2.5" />
            <path d="M33 39h54c-2 5-10 6-27 6s-25-1-27-6z" fill="#f7f3ea" stroke={INK} strokeWidth="2.5" />
            <circle cx="49" cy="32" r="2.4" fill="#f5b014" />
            <circle cx="66" cy="29" r="1.8" fill="#2456c9" />
          </g>
        ) : null}
        {/* Gandhi topi */}
        {who === "sunil" ? <path d="M37 37 40 23c12-6 28-6 40 0l3 14z" fill="#fbfaf6" stroke={INK} strokeWidth="2.5" /> : null}
        {/* brows */}
        <path d="M47 45q4-3 8 0M65 45q4-3 8 0" fill="none" stroke={who === "sunil" ? "#8a8a8a" : INK} strokeWidth="2.4" strokeLinecap="round" />
        {/* eyes */}
        <ellipse cx="51" cy="52" rx="2.3" ry="2.8" fill={INK} />
        <ellipse cx="69" cy="52" rx="2.3" ry="2.8" fill={INK} />
        {who === "sunil" ? (
          <g fill="none" stroke={INK} strokeWidth="2">
            <circle cx="51" cy="52" r="6.5" />
            <circle cx="69" cy="52" r="6.5" />
            <path d="M57.5 52h5" />
          </g>
        ) : null}
        {/* nose and mouth */}
        <path d="M60 55q-3 7 1 8" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        {who === "ramesh" || who === "sunil" ? (
          <path d="M49 65q11-7 22 0q-11 4-22 0z" fill={who === "sunil" ? "#b9b9b9" : "#1d1a1a"} stroke={INK} strokeWidth="1.2" />
        ) : (
          <path d="M53 67q7 5 14 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        )}
        {who === "priya" ? <circle cx="60" cy="42" r="2.1" fill="#c8202f" /> : null}
      </g>
    </svg>
  );
}
