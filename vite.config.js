import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yamlPlugin from "./scripts/vite-yaml-plugin.js";
import adminPlugin from "./scripts/admin-plugin.js";

const contentDir = fileURLToPath(new URL("./content", import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [
    yamlPlugin(),
    react(),
    tailwindcss(),
    ...(command === 'serve' ? [adminPlugin()] : []),
  ],
  resolve: {
    alias: {
      "@content": contentDir,
    },
  },
  base: "/",
  build: {
    sourcemap: true,
  },
}));
