const path = require('node:path');

const commonConfig = {
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'main.bundle.js',
  },
};

const preloadConfig = {
  ...commonConfig,
  target: 'electron-preload',
  entry: './preload.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'preload.bundle.js',
  },
};

module.exports = [mainConfig, preloadConfig];