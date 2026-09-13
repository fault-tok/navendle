import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// base ต้องเป็น '/navendle/' เพราะ deploy ที่ GitHub Pages ใต้ path ชื่อ repo
export default defineConfig({
  base: process.env.NAVENDLE_BASE ?? '/navendle/',
  plugins: [vue(), tailwindcss()],
})
