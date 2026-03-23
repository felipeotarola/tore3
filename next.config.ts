import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = "/Users/baltsar/Documents/Cursor/WHITERHINO-COLLAB/TORKEL";

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir === projectRoot ? configDir : projectRoot,
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c1hxfnulg8jbz3wb.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
