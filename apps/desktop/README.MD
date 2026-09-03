# Electron Layer

This directory contains the desktop-specific part of ONDA.

## Structure

- `src/main/` - creates the Electron app window and configures desktop settings.
- `src/preload/` - exposes a safe API from Electron to the renderer process.
- `src/core/` - shared backend infrastructure (Prisma client, database initialization, change broadcast events).
- `src/features/` - vertical feature slices containing services and IPC handlers (`planner`, `calendar`, `settings`, `system`).


