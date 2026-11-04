import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yamlPlugin from "./scripts/vite-yaml-plugin.js";

const contentDir = fileURLToPath(new URL("./content", import.meta.url));

export default defineConfig({
  plugins: [
    yamlPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@content": contentDir,
    },
  },
  base: "/",
  worker: {
    format: "es",
  },
  build: {
    sourcemap: true,
  },
});
