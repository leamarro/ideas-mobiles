import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client", "libsql", "@libsql/isomorphic-fetch"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 430, 768, 1024, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
