import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: ".", // Place assets in the same folder as index.html
  },
  base: "./", // Ensure relative paths for all assets
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
