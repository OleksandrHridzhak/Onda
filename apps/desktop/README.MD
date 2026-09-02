# Electron Layer

This directory contains the desktop-specific part of ONDA.

## Structure

- `main/` - creates the Electron app window and configures desktop settings.
- `preload/` - exposes a safe API from Electron to the renderer process.
- `core/` - shared backend infrastructure (Prisma client, database initialization, change broadcast events).
- `features/` - vertical feature slices containing services and IPC handlers (`planner`, `calendar`, `settings`, `system`).

