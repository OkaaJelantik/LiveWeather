import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/LiveWeather/',
  server: {
    proxy: {
      // Proxy wilayah Indonesia API → menghindari CORS dari localhost
      '/api/wilayah': {
        target: 'https://wilayah.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wilayah/, '/api'),
      },
      // Proxy Nominatim (OpenStreetMap) → menghindari CORS dari localhost
      '/api/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nominatim/, ''),
        headers: {
          // Nominatim mensyaratkan User-Agent yang valid
          'User-Agent': 'LiveWeatherIndonesia/1.0 (educational project)',
        },
      },
    },
  },
})

