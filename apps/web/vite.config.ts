/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel đặt các biến này lúc build; chạy local thì để trống.
    __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV ?? ""),
    __VERCEL_COMMIT__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? ""),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
