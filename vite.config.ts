import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@root": path.resolve(__dirname, "."),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        bypass(req) {
          if (
            req.url?.startsWith("/api/v2/user/callback") &&
            req.headers.accept?.includes("text/html")
          ) {
            return "/index.html";
          }
        },
      },
    },
  },
});
