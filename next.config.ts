import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  images: {
    domains: [
      "cq2yc041jh.ufs.sh",
      "uploadthing.s3.amazonaws.com",
      "uploadthing.com",
    ],
  },
};

export default nextConfig;
