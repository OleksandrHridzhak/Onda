import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    base: './',
    plugins: [react()],
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'src/app'),
            db: path.resolve(__dirname, 'src/db'),
            features: path.resolve(__dirname, 'src/features'),
            pages: path.resolve(__dirname, 'src/pages'),
            shared: path.resolve(__dirname, 'src/shared'),
            styles: path.resolve(__dirname, 'src/styles'),
        },
    },
    server: {
        port: 3000,
        strictPort: true,
    },
    build: {
        outDir: 'build',
        emptyOutDir: true,
    },
});
