import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/backend": "http://localhost:5000/",
      "/backend/:what&:id": "http://localhost:5000/",

      "/backend/register": "http://localhost:5000/",
      "/backend/login": "http://localhost:5000/",

      "/backend/lists": "http://localhost:5000/",
      "/backend/lists/:id": "http://localhost:5000/",

      "/backend/create": "http://localhost:5000/",
      "/backend/add": "http://localhost:5000/",
      
      "/backend/delete/:what&:id": "http://localhost:5000/",
      "/backend/delete/user": "http://localhost:5000/",
      "/backend/update": "http://localhost:5000/",
    }
  },
  plugins: [react()],
})
