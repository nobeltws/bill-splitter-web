import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		const backend = process.env.BACKEND_URL || "http://localhost:8000";
		return [
			{
				source: "/api/:path*",
				destination: `${backend}/api/:path*`,
			},
		];
	},
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
	allowedDevOrigins: ["192.168.31.78"],
};

export default nextConfig;
