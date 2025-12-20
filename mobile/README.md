# Onda Mobile

Mobile application built with Capacitor for Android.

## Prerequisites

- Node.js 16+
- Java JDK 17
- Android SDK (configured in `android/local.properties`)
- Gradle 8.11.1

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the web app (from render directory):

```bash
cd ../render
npm run build
```

3. Sync Capacitor:

```bash
npm run sync
```

## Development

### Run on device/emulator

```bash
npm run dev
```

### Build APK

```bash
npm run build:apk
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Open in Android Studio

```bash
npm run open
```

## Scripts

- `npm run sync` - Sync web assets and fix Java version
- `npm run open` - Open project in Android Studio
- `npm run run` - Run on connected device/emulator
- `npm run build:apk` - Build debug APK
- `npm run build:release` - Build release APK
- `npm run dev` - Sync and run in one command

## Notes

- Java version is automatically fixed to 17 after sync (via `scripts/fix-java-version.js`)
- Web assets are built in `../render/build` and copied to Android project
- Android SDK location is configured in `android/local.properties`
