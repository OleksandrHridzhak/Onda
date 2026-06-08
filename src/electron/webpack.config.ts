import path from 'node:path';
import type { Configuration } from 'webpack';

const electronDirectory = path.resolve(process.cwd(), 'src/electron');

const commonConfig: Configuration = {
    mode: 'production',
    output: {
        path: path.resolve(electronDirectory, 'build'),
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    
    // Converts TypeScript to JavaScript for webpack to bundle
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};

const mainConfig: Configuration = {
    ...commonConfig,
    target: 'electron-main',
    entry: path.resolve(electronDirectory, 'main/index.ts'),
    output: {
        ...commonConfig.output,
        filename: 'main.bundle.js',
    },
};

const preloadConfig: Configuration = {
    ...commonConfig,
    target: 'electron-preload',
    entry: path.resolve(electronDirectory, 'preload/index.ts'),
    output: {
        ...commonConfig.output,
        filename: 'preload.bundle.js',
    },
};

export default [mainConfig, preloadConfig];
