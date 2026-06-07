const path = require('node:path');

const commonConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: path.resolve(__dirname, 'main/index.js'),
  output: {
    ...commonConfig.output,
    filename: 'main.bundle.js',
  },
};

const preloadConfig = {
  ...commonConfig,
  target: 'electron-preload',
  entry: path.resolve(__dirname, 'preload/index.js'),
  output: {
    ...commonConfig.output,
    filename: 'preload.bundle.js',
  },
};

module.exports = [mainConfig, preloadConfig];
