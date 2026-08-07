import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        id: "/",
        name: "Scanline - Barcode Market Identifier",
        short_name: "Scanline",
        description: "Deteksi barcode/QR untuk QC factory",
        theme_color: "#0E1113",
        background_color: "#0E1113",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "icon-16.png", sizes: "16x16", type: "image/png" },
          { src: "icon-32.png", sizes: "32x32", type: "image/png" },
          { src: "icon-48.png", sizes: "48x48", type: "image/png" },
          { src: "icon-72.png", sizes: "72x72", type: "image/png" },
          { src: "icon-96.png", sizes: "96x96", type: "image/png" },
          { src: "icon-128.png", sizes: "128x128", type: "image/png" },
          { src: "icon-144.png", sizes: "144x144", type: "image/png" },
          { src: "icon-152.png", sizes: "152x152", type: "image/png" },
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "icon-192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          { src: "icon-384.png", sizes: "384x384", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "screenshot-narrow.png",
            sizes: "720x1280",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@tailwindConfig": path.resolve(__dirname, "tailwind.config.js"),
    },
  },
  optimizeDeps: {
    include: ["@tailwindConfig"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
