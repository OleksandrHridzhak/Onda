# Electron Layer

This directory contains the desktop-specific part of ONDA.

## Structure

- `main/` - creates the Electron app window and configures desktop settings.
- `preload/` - exposes a safe API from Electron to the renderer process.
- `ipc/` - contains IPC handlers and channels used for communication between the main process and the renderer.
