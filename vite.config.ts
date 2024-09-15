/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        "react",
        "react-router-dom",
        { zustand: ["create", "useStore"] },
        { "@/store/useAppStore": ["useAppStore"] },
      ],
      dts: "src/auto-imports.d.ts",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
