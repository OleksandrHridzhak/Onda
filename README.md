# Onda
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img width="400" alt="743shots_so" src="https://github.com/user-attachments/assets/6ec0d886-1055-48e2-9c2a-94194ad98133" />
  <img width="400" alt="541shots_so" src="https://github.com/user-attachments/assets/80c037a8-e67b-4b43-ac22-3bae4c7c58a7" />
</div>


---

## Getting Started

Instructions for how to run the project locally.

### Requirements

- Node.js (version XX+)
- npm or yarn
- Git Bash (for Windows)
- VS Code (optional)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/OleksandrHridzhak/Onda
cd Onda
```

2. Install dependencies in the root folder:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd /render
npm install
cd ../
```

4. Run the start script:

```bash
npm run start
```

---

## Mobile Development (Android)

Onda supports mobile deployment via Capacitor for Android.

### Requirements for Mobile Development

- Android Studio (with SDK and emulator)
- Java JDK 17+
- Android SDK (API level 22+)
- USB debugging enabled on device (for testing on physical device)

### Mobile Commands

All mobile commands should be run from the `render` directory:

```bash
cd render
```

#### Development Mode

Run the app on an Android emulator or connected device:

```bash
npm run mobile:dev
```

This command:

1. Builds the React app
2. Syncs with Capacitor
3. Opens the app on an Android emulator or connected device

#### Build APK

Generate a debug APK file:

```bash
npm run mobile:build
```

The APK will be located at:
`render/android/app/build/outputs/apk/debug/app-debug.apk`

#### USB Testing

Test on a specific device connected via USB:

```bash
npm run mobile:usb
```

This will show a list of connected devices and let you select which one to deploy to.

### Syncing Changes

After making changes to the web app, sync them to the Android project:

```bash
npm run cap:sync
```

---
