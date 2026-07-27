import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ap-race-training-hq-public/",
  plugins: [react()],
});
