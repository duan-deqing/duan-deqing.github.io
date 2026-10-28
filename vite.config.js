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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm') || id.includes('node_modules/rehype-highlight')) {
            return 'markdown-vendor';
          }
        }
      }
    }
  },
}));
