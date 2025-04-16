import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // 打包 Docker 镜像需要
};

export default nextConfig;
