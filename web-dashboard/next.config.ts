import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // 打包 Docker 镜像需要
  eslint: {
    ignoreDuringBuilds: true, // ✅ 忽略 eslint 报错
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ 忽略 ts 报错（包括 any）
  },
  images: {
    domains: ['avatars.githubusercontent.com'], 
  },
};

export default nextConfig;
