import { ImageResponse } from "next/og";

export const alt = "RozGhar — the labour naka, in your pocket";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card shown when the site is shared on WhatsApp, LinkedIn or Slack. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf6ec",
          padding: 64,
          fontFamily: "sans-serif",
          color: "#161a3d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="88" height="88" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="11" fill="#161a3d" />
            <circle cx="20" cy="10.2" r="4" fill="#f5b014" />
            <path d="M7.6 23.6 20 13.4l12.4 10.2" fill="none" stroke="#f5b014" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.8 21.6v9.6h16.4v-9.6" fill="none" stroke="#f5b014" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 31.2v-5.4" stroke="#f5b014" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800 }}>Roz<span style={{ color: "#c98200" }}>Ghar</span></div>
          <div style={{ marginLeft: "auto", display: "flex", background: "#c8202f", color: "white", padding: "10px 22px", borderRadius: 10, fontSize: 28, fontWeight: 700 }}>
            Artemis 2026 · PS2
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, textShadow: "5px 5px 0 #f5b014" }}>
            Work shouldn&apos;t depend on who walks past the naka.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#545a7a" }}>
            Nearby work with clear pay · Kaam Card instead of a résumé · Rights in plain words · Works by SMS
          </div>
        </div>
        <div style={{ display: "flex", height: 18, background: "repeating-linear-gradient(-45deg, #f5b014 0 18px, #161a3d 18px 36px)" }} />
      </div>
    ),
    size,
  );
}
