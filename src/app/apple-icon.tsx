import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#161a3d" }}>
        <svg width="140" height="140" viewBox="0 0 40 40">
          <circle cx="20" cy="10.2" r="4" fill="#f5b014" />
          <path d="M7.6 23.6 20 13.4l12.4 10.2" fill="none" stroke="#f5b014" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.8 21.6v9.6h16.4v-9.6" fill="none" stroke="#f5b014" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 31.2v-5.4" stroke="#f5b014" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
