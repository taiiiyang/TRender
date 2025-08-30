import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "@TRender/t-svg",
      fileName: (format) => {
        if (format === "es")
          return "esm/index.js";
        if (format === "cjs")
          return "lib/index.js";
        return `dist/index.min.js`;
      },
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
