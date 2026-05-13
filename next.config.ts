import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/OrbitAN",
  images: { unoptimized: true },
};

export default nextConfig;
