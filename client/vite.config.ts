import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy: {
      "/health": "http://127.0.0.1:3001",
      "/v1": "http://127.0.0.1:3001",
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
