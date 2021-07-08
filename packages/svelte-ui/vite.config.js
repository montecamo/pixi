import { defineConfig } from "vite";
import sveltePreprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  optimizeDeps: { exclude: ["svelte-routing"] },
  server: {
    port: 8080,
  },
  resolve: {
    alias: [
      {
        find: "socket.io-client",
        replacement: "socket.io-client/dist/socket.io.js",
      },
      {
        find: "src",
        replacement: path.resolve(projectRootDir, "src"),
      },
    ],
  },
});
