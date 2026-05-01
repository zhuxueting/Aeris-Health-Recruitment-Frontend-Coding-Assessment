import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 某些环境下文件变更无法触发 HMR/重新编译，开启轮询确保改动生效
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
})
