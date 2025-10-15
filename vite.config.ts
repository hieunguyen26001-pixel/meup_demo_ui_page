import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    // Bundle analyzer for production builds
    mode === 'analyze' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  server: {
    port: 3000,
    host: true,
    open: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'apexcharts',
      'react-apexcharts'
    ],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('apexcharts')) {
              return 'chart-vendor';
            }
            if (id.includes('swiper') || id.includes('simplebar') || id.includes('react-dropzone')) {
              return 'ui-vendor';
            }
            if (id.includes('@fullcalendar')) {
              return 'calendar-vendor';
            }
            if (id.includes('react-flatpickr') || id.includes('flatpickr')) {
              return 'form-vendor';
            }
            if (id.includes('axios') || id.includes('classnames') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('xlsx')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('src/pages/Charts')) {
            return 'charts';
          }
          if (id.includes('src/pages/Forms')) {
            return 'forms';
          }
          if (id.includes('src/pages/Tables')) {
            return 'tables';
          }
          if (id.includes('src/pages/UiElements')) {
            return 'ui-elements';
          }
          if (id.includes('src/pages/Ads')) {
            return 'ads';
          }
          if (id.includes('src/pages/Creator')) {
            return 'creator';
          }
          if (id.includes('src/pages/Management') || id.includes('src/pages/VideoManagement') || id.includes('src/pages/BookingManagement')) {
            return 'management';
          }
          if (id.includes('src/pages/Store')) {
            return 'store';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash].[ext]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
