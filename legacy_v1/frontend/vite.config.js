import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-gsap': ['gsap', '@studio-freight/lenis'],
                    'vendor-charts': ['chart.js', 'react-chartjs-2'],
                    'vendor-icons': ['lucide-react']
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Increased since GSAP and Chart.js get localized to their own chunks
    }
})
