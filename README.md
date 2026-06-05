# Onda

Desktop weekly planning app built with Electron, React, TypeScript, and Dexie.

## Structure

```text
Onda
|- api        # Electron IPC handlers
|- assets     # Desktop app assets
|- docs       # Notes and design docs
|- render     # React frontend
|- main.js    # Electron entry point
|- preload.js # Electron preload script
```

## Getting Started

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd render
npm install
cd ..
```

Run the app:

```bash
npm run start
```

Build the desktop app:

```bash
npm run dist
```
