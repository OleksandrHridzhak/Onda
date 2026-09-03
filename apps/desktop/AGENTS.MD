# Desktop Backend Rules (`apps/desktop`)

## Architecture: Feature-Driven (Vertical Slice)

- **Strict Architecture**: We use **Feature-Driven (vertical slice)** architecture for the desktop/Node.js backend.
- **Directory Roles**:
  - `src/main/`: Electron main process lifecycle, window creation (`BrowserWindow`), and tray management.
  - `src/preload/`: Electron preload bridge (`contextBridge.exposeInMainWorld`). Securely exposes IPC methods to the renderer window.
  - `src/core/`: Core shared infrastructure (database client initialization, change broadcast events, global utilities).
  - `src/features/<feature-name>/`: Vertical feature slices (`calendar`, `columns`, `entries`, `settings`, `system`).

## Feature Slice Structure

Each feature slice under `src/features/` should be structured as follows:
- `services/`: Fine-grained, single-responsibility services performing database operations with Prisma.
- `<feature>.controller.ts`: Handles requests and formats responses/errors.
- `<feature>.router.ts`: Registers `ipcMain.handle` endpoints for this specific slice.
- `index.ts`: Public API of the slice for registration in the main dispatcher.

## Process Boundary & Security Rules

- **Process Separation**: Keep `main` and `preload` strictly separated.
- **No Node.js in Renderer**: Never enable `nodeIntegration` in renderer windows. All communication between UI and backend must pass through IPC via `preload/index.ts`.
- **Database Access**: Direct Prisma/SQLite access is strictly prohibited in `render`. All DB queries and mutations must occur inside `apps/desktop/src/features/*/services/`.
- **Event Broadcasting**: When modifying database records, broadcast change events via `src/core/events.ts` (`broadcastDbChange`) so the frontend can reactively sync state.

## General Practices

- **Don't Repeat Yourself (DRY)**: Centralize common Prisma operations or utilities in `src/core/`.
- **Types**: Use shared contracts and types from `@onda/shared`.
