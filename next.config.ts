import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "@wyw-in-js/webpack-loader",
          options: {
            sourceMap: process.env.NODE_ENV !== "production",
            babelOptions: {
              presets: ["@linaria/babel-preset"],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
