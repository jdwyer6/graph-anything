import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Set host to 'localhost' instead of default '127.0.0.1'
    port: 3000,        // Specify the port to be 3000
  },
});