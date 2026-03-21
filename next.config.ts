import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
