/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ["src"],
  },
  images: {
    domains: [
      "memesakeawsbucket.s3.ap-south-1.amazonaws.com"
    ],
  },

  reactStrictMode: false,

  experimental: {
    scrollRestoration: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};
