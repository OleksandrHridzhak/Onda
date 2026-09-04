import path from "node:path";
import type { Configuration } from "webpack";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const desktopDirectory = __dirname;
const isDevelopment = process.env.NODE_ENV === "development";

const commonConfig: Configuration = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "inline-source-map" : false,
  output: {
    path: path.resolve(desktopDirectory, "build"),
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
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@onda/shared": path.resolve(__dirname, "../../packages/shared"),
    },
  },
};

const mainConfig: Configuration = {
  ...commonConfig,
  target: "electron-main",
  entry: path.resolve(desktopDirectory, "src/main/index.ts"),
  output: {
    ...commonConfig.output,
    filename: "main.bundle.js",
  },
};

const preloadConfig: Configuration = {
  ...commonConfig,
  target: "electron-preload",
  entry: path.resolve(desktopDirectory, "src/preload/index.ts"),
  output: {
    ...commonConfig.output,
    filename: "preload.bundle.js",
  },
};

export default [mainConfig, preloadConfig];
