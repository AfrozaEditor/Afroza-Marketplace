import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    optimizeDeps: {
        include: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
    },
    build: {
        // Code splitting pour de meilleures performances
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks - bibliothèques tierces
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-inertia': ['@inertiajs/react'],
                    'vendor-radix': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-select',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-tooltip',
                    ],
                    'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
                },
            },
        },
        // Compression et minification
        minify: 'esbuild',
        // Target modern browsers
        target: 'es2020',
        // Taille des chunks
        chunkSizeWarningLimit: 1000,
        // Source maps en production (désactivé pour performance)
        sourcemap: false,
    },
});
