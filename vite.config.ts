import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
	base: "/novoAdmin/",
	plugins: [
		react(),
		vanillaExtractPlugin({
			identifiers: ({ debugId }) => `${debugId}`,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		port: 5100,
		proxy: {
			"/admin": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/admin"),
			},
		},
	},
	customLogger: (() => {
		const warnedMessages = new Set<string>();
		let hasWarned = false;

		return {
			info(msg) {
				console.log(`[Admin] ${msg}`);
			},
			warn(msg) {
				hasWarned = true;
				console.warn(`[Admin] ${msg}`);
			},
			warnOnce(msg) {
				if (!warnedMessages.has(msg)) {
					warnedMessages.add(msg);
					hasWarned = true;
					console.warn(`[Admin] ${msg}`);
				}
			},
			error(msg) {
				console.error(`[Admin] ${msg}`);
			},
			clearScreen() {
				process.stdout.write("\x1Bc");
			},
			hasErrorLogged(error) {
				console.error("[Admin] Error logged:", error);
				return true;
			},
			hasWarned,
		};
	})(),
});
