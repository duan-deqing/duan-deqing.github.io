import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yamlPlugin from "./scripts/vite-yaml-plugin.js";
import adminPlugin from "./scripts/admin-plugin.js";

export default defineConfig(({ command }) => ({
  plugins: [
    yamlPlugin(),
    react(),
    tailwindcss(),
    ...(command === 'serve' ? [adminPlugin()] : []),
  ],
  base: "/",
  build: {
    sourcemap: true,
  },
}));
