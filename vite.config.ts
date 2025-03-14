import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@sharedTypes": path.resolve(__dirname, "./src/types"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
})
