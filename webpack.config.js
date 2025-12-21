// webpack.config.js
const path = require('node:path');

// Спільні налаштування для обох
const commonConfig = {
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
};

// 1. Конфіг для Main
const mainConfig = {
  ...commonConfig, // Копіюємо спільні налаштування
  target: 'electron-main',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'main.bundle.js',
  },
};

// 2. Конфіг для Preload
const preloadConfig = {
  ...commonConfig, // Копіюємо спільні налаштування
  target: 'electron-preload',
  entry: './preload.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'preload.bundle.js',
  },
};

// 3. Експортуємо обидва
module.exports = [mainConfig, preloadConfig];