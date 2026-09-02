import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const repositoryRoot = path.resolve(__dirname, '../..');
    const env = loadEnv(mode, repositoryRoot, '');
    const devServerUrl = new URL(env.DEV_SERVER_URL);

    return {
        base: './',
        plugins: [react()],
        resolve: {
            alias: {
                app: path.resolve(__dirname, 'src/app'),
                entities: path.resolve(__dirname, 'src/entities'),
                features: path.resolve(__dirname, 'src/features'),
                pages: path.resolve(__dirname, 'src/pages'),
                shared: path.resolve(__dirname, 'src/shared'),
                widgets: path.resolve(__dirname, 'src/widgets'),
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
