import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lorempixel.com",
      },
      {
        protocol: "http",
        hostname: "lorempixel.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*",
      },
      // Add your custom domains here as needed
      // {
      //   protocol: 'https',
      //   hostname: 'your-custom-domain.com',
      //   pathname: '/images/**',
      // },
    ],
  },
};

export default nextConfig;
