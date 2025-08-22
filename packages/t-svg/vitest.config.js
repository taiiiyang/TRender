/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["**/__tests__/**/*.test.js"],
    environment: "happy-dom", // 替换jest-electron环境
    globals: true, // 启用全局API
  },
  browser: {
    provider: "playwright", // or 'webdriverio'
    enabled: true,
    // at least one instance is required
    instances: [{ browser: "chromium" }],
  },
});
