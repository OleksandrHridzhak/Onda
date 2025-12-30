import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onda.app',
  appName: 'Onda',
  webDir: '../render/build',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      javaSourceCompatibility: '21',
      javaTargetCompatibility: '21',
    },
  },
};

export default config;
