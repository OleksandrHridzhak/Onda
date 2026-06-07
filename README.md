# Onda

Desktop weekly planning app built with Electron, React, TypeScript, and Dexie.

## Structure

```text
Onda
|- src/
|  |- electron/
|     |- main/     # Electron main process
|     |- preload/  # Secure preload bridge
|     |- ipc/      # IPC handlers
|  |- shared/
|     |- assets/   # Shared app assets
|  |- render/
|     |- src/
|        |- app/      # App shell, layout, store, types, utils, constants
|        |- db/       # Dexie database layer
|        |- features/ # Feature modules
|        |- pages/    # Route pages
|        |- shared/   # Shared UI components
|        |- styles/   # Global styles and themes
|- docs/           # Notes and design docs
```

## Getting Started

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd src/render
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
