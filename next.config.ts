/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};
