import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
