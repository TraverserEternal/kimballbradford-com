import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [preact()],
  server: {
    host: "0.0.0.0",
  },
});
