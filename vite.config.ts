
// import { defineConfig, Plugin } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// // import { createServer } from "./server";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//     fs: {
//       allow: ["./client", "./shared"],
//       deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
//     },
//   },
//   build: {
//     outDir: "dist/spa",
//   },
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./client"),
//       "@shared": path.resolve(__dirname, "./shared"),
//     },
//   },
// }));


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    open: true
  },
  build: {
    outDir: "dist"
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),     // ← CHANGED client → src
      "@shared": path.resolve(__dirname, "./shared")
    },
  },
});
