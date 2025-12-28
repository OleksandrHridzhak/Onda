# Frontend Sync Architecture

## Overview

The frontend sync system implements a **local-first, push-first sync strategy**. Data is always local and ready; sync happens in the background without blocking the UI.

## Key Principle

**Local-First**: App always works with local data → UI is instant. Sync is asynchronous background work.

**Push-First**: When syncing, push local changes _first_, then pull server updates. This prevents race conditions and data loss.

---

## File Structure & Roles

### Core Service Layer

#### `syncService.ts` (Main Orchestrator)

- **Role**: Entry point for all sync operations
- **When**: Called by UI when user opens Settings or presses "Sync Now"
- **What it does**:
  1. Initializes sync on app startup (pulls data, starts auto-sync timer)
  2. Coordinates push/pull cycle
  3. Manages auto-sync intervals
  4. Exposes UI-friendly methods (`getSyncConfig()`, `sync()`, `testConnection()`)

#### `sync/syncConfig.ts` (Config Manager)

- **Role**: Persistent storage of sync settings
- **When**: Used when loading/saving sync configuration (Server URL, Secret Key, etc.)
- **What it does**:
  - Read/write sync config from IndexedDB
  - Validate secret key length
  - Track current version number and last sync timestamp

#### `sync/syncOperations.ts` (Server Communication)

- **Role**: Direct backend communication
- **When**: During push/pull/test operations
- **What it does**:
  - `pushToServer()`: Send local changes to backend
  - `pullFromServer()`: Fetch new data from backend
  - `testConnection()`: Verify server connectivity

#### `sync/syncState.ts` (State Manager)

- **Role**: In-memory state during sync lifecycle
- **When**: Used internally throughout sync operations
- **What it does**:
  - Tracks if sync is in progress
  - Holds current version, secret key, server URL
  - Manages "has unsaved changes" flag
  - Stores last sync time

### Type Definitions

#### `syncTypes.ts`

- Defines all interfaces:
  - `SyncConfig`: User settings (enabled, server URL, secret key)
  - `SyncResult`: Response from sync operation
  - `PushResult` / `PullResult`: Push/pull operation details
  - `SyncStatus`: UI-friendly status (for settings panel)

### Constants

#### `syncConstants.ts`

- `DEFAULT_SYNC_SERVER_URL`: Production backend URL
- `SYNC_AUTO_INTERVAL`: 5 minutes (auto-sync frequency)
- `SYNC_DEBOUNCE_DELAY`: 1 second (wait before syncing after changes)
- `SYNC_STATUS_UPDATE_INTERVAL`: 2 seconds (UI refresh rate for status)

---

## Sync Flow (Step-by-Step)

### 1. Initialization (App Opens)

```
App starts
  ↓
syncService.initialize()
  ├─ Load config from IndexedDB
  ├─ Set sync credentials (URL, secret key)
  ├─ Perform first pull() to get latest data
  └─ Start auto-sync timer (5 min intervals)
```

### 2. User Makes Changes

```
User edits table cell
  ↓
Local data updated immediately in IndexedDB
  ↓
Debounce timer starts (1 second)
  ↓
After 1 second of no changes:
  └─ Mark "has unsaved changes" = true
```

### 3. Auto-Sync Cycle (Every 5 Minutes)

```
Auto-sync timer triggers
  ↓
syncService.sync() called automatically
  ↓
Check if config is valid
  ├─ If invalid → skip
  └─ If valid → proceed
```

### 4. Full Sync Operation

```
1. PUSH Phase (if local changes exist)
   ├─ Send local data + current version to backend
   ├─ Backend increments version
   └─ Frontend updates local version

2. PULL Phase
   ├─ Request latest data from backend
   ├─ Merge with local data if conflict
   └─ Update UI status (version, last sync time)
```

### 5. Manual Sync

```
User clicks "Sync Now" button
  ↓
syncService.sync(force=true)
  ↓
Same as Auto-Sync flow above
  ↓
UI shows "Syncing..." spinner
  ↓
Complete → show timestamp & version
```

---

## UI Integration (SyncSection.tsx)

### Settings Panel Shows

- **Enable Sync**: Toggle sync on/off
- **Server URL**: Backend address (default: Render deployment)
- **Secret Key**: Encryption key (can generate auto)
- **Test Connection**: Verify backend is reachable
- **Sync Status**: Version, last sync time, active status
- **Sync Now**: Force immediate push/pull

### Status Updates

```
Auto-refresh every 2 seconds (SYNC_STATUS_UPDATE_INTERVAL)
Shows:
  - Current version number
  - Last sync timestamp
  - Smart Sync active/inactive
```

---

## Key Features

### 1. Local-First

- Data writes happen instantly to local IndexedDB
- No "waiting for server" blocking

### 2. Background Sync

- Auto-sync runs every 5 minutes
- Doesn't interrupt user work
- Can be manually triggered

### 3. Push-First Strategy

- Local changes pushed first (prevents loss)
- Then pull latest server data
- Reduces race conditions

### 4. Version Management

- Each sync increments backend version
- Frontend tracks local version
- Detects conflicts based on version mismatch

### 5. Debouncing

- Wait 1 second after last change before marking "dirty"
- Prevents excessive sync triggers during rapid edits

---

## Example: User Edits Cell → Sync

```
1. User changes cell value in table
   └─ Local state updated instantly

2. SyncService marks hasUnsavedChanges = true (after 1s debounce)

3. Next auto-sync (5 min later):
   ├─ Push: Send local data to backend
   │  └─ Backend: increment version, save data
   ├─ Pull: Fetch latest from backend
   └─ UI: Display new version & "Last Sync: Dec 28, 6:17 PM"

4. If user makes change again before next auto-sync:
   └─ Just updates local data (no push until next cycle)

5. User clicks "Sync Now":
   └─ Immediately force push/pull (regardless of timer)
```

---

## Configuration

### Change Server URL

Edit `syncConstants.ts`:

```typescript
export const DEFAULT_SYNC_SERVER_URL = 'https://your-server.com';
```

### Change Auto-Sync Interval

```typescript
export const SYNC_AUTO_INTERVAL = 300000; // 5 minutes (in milliseconds)
```

### Change Debounce Delay

```typescript
export const SYNC_DEBOUNCE_DELAY = 1000; // 1 second
```

---

## Error Handling

- **No Config**: Sync skipped if URL/key missing
- **Connection Failed**: Shows error message, retries next cycle
- **Version Conflict**: Merged data, logged to console
- **Push Failed**: Continues to pull (doesn't block)

---

## Testing Sync

1. **Local + Render Server**:
   - Default config points to Render deployment
   - Can test offline: disable sync, make changes, re-enable

2. **Local Server** (for dev):
   - Set URL to `http://localhost:3001`
   - Run backend: `npm run dev` in sync-server folder

3. **Test Connection**:
   - Click "Test Connection" button in Settings
   - Verifies backend reachability before enabling sync
