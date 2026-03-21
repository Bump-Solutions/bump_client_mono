import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ["react", "react-dom"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".web.ts"],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
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
