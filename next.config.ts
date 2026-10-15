import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Naka is a client-driven prototype on mock data: every screen reads the
  // shared demo store in the browser, so classic (non-cache-components)
  // rendering keeps routes simple.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
