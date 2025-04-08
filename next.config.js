module.exports = {
  reactStrictMode: true,
  basePath: "",
  trailingSlash: false,
  output: "standalone",
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
