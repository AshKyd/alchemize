import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  define: { "process.env": {} },
  build: {
    rollupOptions: {
      plugins: [
        inject({
          process: "process",
        }),
      ],
    },
  },
});
