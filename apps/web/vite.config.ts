import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ["react", "react-dom"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".web.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query", "@tanstack/react-table"],
          motion: ["framer-motion"],
        },
      },
    },
  },

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://api.bumpmarket.hu",
        changeOrigin: true,
        secure: true,
      },
    },
  },

  optimizeDeps: {
    exclude: ["@bump/assets"],
  },
});
