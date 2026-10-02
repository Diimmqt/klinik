import type { NextConfig } from "next";

// Fix Node 22+ experimental localStorage breaking Next.js SSR
if (
  typeof globalThis.localStorage !== "undefined" &&
  typeof (globalThis.localStorage as any).getItem !== "function"
) {
  delete (globalThis as any).localStorage;
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2"],
};

export default nextConfig;
