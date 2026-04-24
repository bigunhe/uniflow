import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: __dirname,
	},
	serverExternalPackages: ["pdf-parse", "unpdf", "pdfjs-dist"],
};

export default nextConfig;
