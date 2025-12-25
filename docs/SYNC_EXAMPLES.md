# Onda Sync Examples

## Example 1: Basic Setup

```javascript
import { syncService } from './services/syncService';

// Initialize sync service on app startup
async function initializeApp() {
  await syncService.initialize();
  console.log('Sync service initialized');
}
```

## Example 2: Configure Sync from Settings

```javascript
// Save sync configuration
const config = {
  enabled: true,
  serverUrl: 'https://your-server.onrender.com',
  secretKey: 'my-secret-key-12345',
  autoSync: true,
  syncInterval: 300000, // 5 minutes
};

await syncService.saveSyncConfig(config);
await syncService.initialize();
```

## Example 3: Manual Sync

```javascript
// Trigger manual sync
const result = await syncService.sync(true);

if (result.status === 'success') {
  console.log('Sync successful!');
  console.log('Version:', result.version);
  console.log('Timestamp:', result.timestamp);
} else {
  console.error('Sync failed:', result.message);
}
```

## Example 4: Test Connection

```javascript
// Test server connection before saving config
const serverUrl = 'https://your-server.onrender.com';
const secretKey = 'my-secret-key-12345';

const result = await syncService.testConnection(serverUrl, secretKey);

if (result.status === 'success') {
  console.log('Connection successful!');
  // Save config
  await syncService.saveSyncConfig({ serverUrl, secretKey, enabled: true });
} else {
  console.error('Connection failed:', result.message);
}
```

## Example 5: Get Sync Status

```javascript
// Get current sync status
const status = syncService.getStatus();

console.log('Enabled:', status.enabled);
console.log('Syncing:', status.syncing);
console.log('Version:', status.version);
console.log('Last Sync:', status.lastSync);
console.log('Auto-sync Active:', status.autoSyncActive);
```

## Example 6: Start/Stop Auto-Sync

```javascript
// Start auto-sync with custom interval (10 minutes)
syncService.startAutoSync(600000);

// Stop auto-sync
syncService.stopAutoSync();
```

## Example 7: React Component with Sync

```jsx
import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';

function SyncIndicator() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Update status every second
    const interval = setInterval(() => {
      setStatus(syncService.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!status || !status.enabled) return null;

  return (
    <div className="sync-indicator">
      {status.syncing ? (
        <span>🔄 Syncing...</span>
      ) : (
        <span>✓ Synced {status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : 'never'}</span>
      )}
    </div>
  );
}
```

## Example 8: Handle Sync Errors

```javascript
// Wrap sync in try-catch
async function handleSync() {
  try {
    const result = await syncService.sync(true);
    
    if (result.status === 'error') {
      // Show user-friendly error message
      if (result.message.includes('not configured')) {
        alert('Please configure sync in Settings first');
      } else if (result.message.includes('Server error')) {
        alert('Server is unavailable. Will retry automatically.');
      } else {
        alert('Sync error: ' + result.message);
      }
    }
  } catch (error) {
    console.error('Unexpected sync error:', error);
    alert('Unexpected error during sync');
  }
}
```

## Example 9: Sync on Data Change

```javascript
// Debounced sync on data changes
let syncTimeout = null;

function onDataChange() {
  // Clear previous timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  // Trigger sync after 5 seconds of no changes
  syncTimeout = setTimeout(() => {
    syncService.sync().catch(console.error);
  }, 5000);
}

// Use in your data update functions
async function updateTask(taskId, data) {
  await db.tasks.update(taskId, data);
  onDataChange(); // Trigger debounced sync
}
```

## Example 10: Migration from Old System

```javascript
// If you have old import/export system
import { exportData, importData } from './services/indexedDB';

async function migrateToSync() {
  // Export current data
  const localData = await exportData();
  
  // Configure sync
  await syncService.saveSyncConfig({
    enabled: true,
    serverUrl: 'https://your-server.onrender.com',
    secretKey: 'your-secret-key',
    autoSync: true,
  });
  
  // Initialize sync
  await syncService.initialize();
  
  // Push initial data to server
  const result = await syncService.sync(true);
  
  if (result.status === 'success') {
    console.log('Migration successful!');
  }
}
```

## Server API Examples

### Push Data
```bash
curl -X POST http://localhost:3001/sync/push \
  -H "Content-Type: application/json" \
  -H "x-secret-key: your-secret-key" \
  -d '{
    "data": {
      "weeks": [],
      "calendar": [],
      "settings": []
    },
    "clientVersion": 0
  }'
```

### Pull Data
```bash
curl -X GET http://localhost:3001/sync/data \
  -H "x-secret-key: your-secret-key"
```

### Pull with Conflict Check
```bash
curl -X POST http://localhost:3001/sync/pull \
  -H "Content-Type: application/json" \
  -H "x-secret-key: your-secret-key" \
  -d '{
    "clientVersion": 1,
    "clientLastSync": "2024-01-01T00:00:00.000Z"
  }'
```

### Delete Data
```bash
curl -X DELETE http://localhost:3001/sync/data \
  -H "x-secret-key: your-secret-key"
```

## Testing Sync Locally

1. **Start server:**
```bash
cd sync-server
npm install
npm start
```

2. **In another terminal, test endpoints:**
```bash
npm test
```

3. **Configure app:**
- Server URL: `http://localhost:3001`
- Secret Key: Any 8+ character string
- Test connection
- Save and sync

4. **Test multi-device:**
- Open app on computer A
- Make changes and sync
- Open app on computer B (with same secret key)
- Sync and verify changes appear
