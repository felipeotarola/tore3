import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },
  async rewrites() {
    return [
      {
        source: "/_next/_next/:path*",
        destination: "/_next/:path*",
      },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c1hxfnulg8jbz3wb.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
