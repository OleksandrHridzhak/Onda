# Auto-Sync Integration Guide

## Overview

The sync system now includes **debounced auto-sync** (Notion-style) where changes sync automatically as you type, with automatic pulls when the app opens or returns from tray.

## Configuration

All sync configuration constants are centralized in `render/src/services/syncConstants.js`:

```javascript
// Default sync server URL - change this for production
export const DEFAULT_SYNC_SERVER_URL = 'http://localhost:3001';

// Sync timing
export const SYNC_DEBOUNCE_DELAY = 1000; // 1 second
export const SYNC_AUTO_INTERVAL = 300000; // 5 minutes
export const SYNC_STATUS_UPDATE_INTERVAL = 2000; // 2 seconds

// Secret key config
export const MIN_SECRET_KEY_LENGTH = 8;
export const GENERATED_SECRET_KEY_LENGTH = 16;
```

## How It Works

1. **Debounced Sync**: When data changes, sync triggers after 1 second of no activity
2. **Auto-Pull**: Data pulls automatically when app opens or returns from tray
3. **Background Sync**: Optional periodic sync every 5 minutes (can be disabled)

## Integration Methods

### Method 1: Using the Helper Function (Recommended)

Import and use the auto-sync helper:

```javascript
import { notifyDataChange } from '../services/autoSync';

// Notify after any database operation
async function updateTask(taskId, data) {
  await db.tasks.update(taskId, data);
  notifyDataChange(); // Triggers debounced sync
}
```

### Method 2: Using Service Proxy (Advanced)

Instead of a proxy helper, you can create small wrapper objects that call `notifyDataChange()` after write operations:

```javascript
import { calendarService } from './calendarDB';
import { notifyDataChange } from '../services/autoSync';

export const calendarServiceWithSync = {
  async updateCalendar(data) {
    const res = await calendarService.updateCalendar(data);
    notifyDataChange();
    return res;
  },
  // ...wrap other write methods similarly
};
```

### Method 3: Direct Call

Call sync service directly:

```javascript
import { syncService } from './syncService';

async function saveData(data) {
  await db.save(data);
  syncService.triggerDebouncedSync(); // Manual trigger
}
```

## Examples

### Calendar Service

```javascript
// render/src/services/calendarDB.js
import { notifyDataChange } from './autoSync';

export const calendarService = {
  async updateCalendar(calendarData) {
    try {
      const db = await dbPromise;
      const tx = db.transaction('calendar', 'readwrite');
      const store = tx.objectStore('calendar');

      await store.put({ id: 1, body: calendarData });
      await tx.done;

      notifyDataChange(); // Trigger sync

      return { status: 'success' };
    } catch (err) {
      return { status: 'error', error: err.message };
    }
  },
};
```

### Columns Service

```javascript
// render/src/services/columnsDB.js
import { notifyDataChange } from './autoSync';

export async function updateColumn(columnData) {
  const db = await dbPromise;
  await db.put('columns', columnData);
  notifyDataChange();
  return { status: 'success' };
}
```

### React Component

```jsx
import { notifyDataChange } from '../services/autoSync';

function TaskEditor() {
  const [task, setTask] = useState('');

  const handleSave = async () => {
    await db.tasks.save(task);
    notifyDataChange(); // Sync triggers after 1 second
  };

  return (
    <input
      value={task}
      onChange={(e) => setTask(e.target.value)}
      onBlur={handleSave} // Save on blur
    />
  );
}
```

## Debounce Behavior

- **Delay**: 1 second after last change
- **Cancellation**: New changes reset the timer
- **Smart**: Only syncs if sync is enabled

```
User types: "H" -> Timer starts (1s)
User types: "e" -> Timer resets (1s)
User types: "l" -> Timer resets (1s)
User types: "l" -> Timer resets (1s)
User types: "o" -> Timer resets (1s)
[1 second passes with no typing]
-> Sync triggers!
```

## Auto-Pull on App Open

Automatically handled in `App.tsx`:

```typescript
// Pull on visibility change (return from tray)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    syncService.sync();
  }
});

// Pull on window focus
window.addEventListener('focus', () => {
  syncService.sync();
});
```

## Configuration

Users can configure sync behavior in Settings → Sync:

- **Enable/Disable Sync**: Turn on/off
- **Server URL**: Where to sync
- **Secret Key**: Authentication
- **Background Sync**: Optional 5-minute interval

## Best Practices

### DO ✅

- Call `notifyDataChange()` after ALL write operations
- Call `notifyDataChange()` after write operations for consistency
- Test with slow network to verify behavior
- Keep debounce delay reasonable (500ms - 2000ms)

### DON'T ❌

- Don't call sync on every keystroke (that's what debouncing prevents)
- Don't sync on read operations
- Don't block UI waiting for sync
- Don't forget to notify on batch operations

## Testing

### Test Debounced Sync

```javascript
import { syncService } from './syncService';

// Make multiple rapid changes
for (let i = 0; i < 10; i++) {
  await db.update(data);
  notifyDataChange();
}

// Should only sync ONCE after 1 second
```

### Test Auto-Pull

1. Open app
2. Change data on another device
3. Minimize app to tray
4. Restore app
5. Data should auto-update

## Troubleshooting

**Sync not triggering?**

- Check if sync is enabled in settings
- Verify `notifyDataChange()` is being called
- Check console for sync logs

**Too many syncs?**

- Increase debounce delay
- Check for unnecessary `notifyDataChange()` calls
- Consider batching updates

**Data not pulling on app open?**

- Check visibility/focus event listeners
- Verify sync is configured
- Check server connectivity

## Migration from Old System

### Before (Manual Sync)

```javascript
async function saveTask(task) {
  await db.tasks.save(task);
  // User clicks "Sync" button later
}
```

### After (Auto-Sync)

```javascript
import { notifyDataChange } from '../services/autoSync';

async function saveTask(task) {
  await db.tasks.save(task);
  notifyDataChange(); // Auto-syncs after 1 second!
}
```

## Performance

- Debouncing prevents excessive sync requests
- Network requests are batched
- Local writes are immediate (no waiting)
- Background sync uses minimal resources

## Future Enhancements

- Configurable debounce delay in UI
- Sync queue for offline changes
- Conflict resolution UI
- Selective sync (choose what to sync)
