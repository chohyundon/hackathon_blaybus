import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 개발 시 API 요청을 백엔드로 프록시 → CORS 없음, 새로고침 시에도 동일
      "/api": {
        target: "https://be-dosa.store",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
