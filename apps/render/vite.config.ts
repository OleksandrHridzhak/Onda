import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const repositoryRoot = path.resolve(__dirname, '../..');
    const env = loadEnv(mode, repositoryRoot, '');
    const devServerUrl = new URL(env.DEV_SERVER_URL || 'http://localhost:3000');

    return {
        base: './',
        plugins: [react()],
        resolve: {
            alias: {
                app: path.resolve(__dirname, 'src/app'),
                features: path.resolve(__dirname, 'src/features'),
                shared: path.resolve(__dirname, 'src/shared'),
                '@onda/shared': path.resolve(__dirname, '../../packages/shared'),
            },
        },
        server: {
            host: devServerUrl.hostname,
            port: Number(devServerUrl.port),
            strictPort: true,
        },
        build: {
            outDir: 'build',
            emptyOutDir: true,
        },
    };
});
