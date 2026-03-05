import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url' // Thêm dòng này
import path from 'path'

const __filename = fileURLToPath(import.meta.url) // Tạo __filename theo kiểu ESM
const __dirname = path.dirname(__filename)     // Tạo __dirname từ __filename

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Bây giờ dòng này sẽ chạy ngon lành
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // CẤU HÌNH QUAN TRỌNG ĐỂ HMR NHẠY HƠN TRÊN DOCKER
    watch: {
      usePolling: true,   // Ép Vite phải quét file liên tục
      interval: 500,      // Kiểm tra mỗi 0.5 giây (máy i5 để mức này là vừa đẹp)
    },
    hmr: {
      clientPort: 3000,   // Đảm bảo trình duyệt kết nối đúng cổng HMR qua Docker
    },
  },
})