# Database Layer (Dexie.js)

Browser IndexedDB layer built with Dexie.js - our client-side database.

## 📁 Structure

```
db/
├── index.ts              # Dexie class (OndaDB) & DB schema
├── types.ts              # DbResult<T>, ExportData
├── constants.ts          # DEFAULT_SETTINGS
├── column.templates.ts   # Templates for new columns
└── helpers/
    ├── backup.ts         # Export/Import data
    ├── columns.ts        # CRUD operations for columns
    ├── calendar.ts       # CRUD operations for calendar
    └── settings.ts       # CRUD operations for settings
```

## 🚀 Usage

### Columns (table)

```typescript
import { getAllColumns, createColumn, updateColumnFields, deleteColumn } from '@/db/helpers/columns';

// Get all columns
const result = await getAllColumns();
if (result.success) {
  console.log(result.data); // Column[]
}

// Create new column
const newCol = await createColumn('todoListColumn');
if (newCol.success) {
  console.log(newCol.data.id); // UUID
}

// Update column fields
await updateColumnFields('column-id-123', {
  name: 'New Name',
  'uniqueProps.checkboxColor': '#ff0000'
});

// Delete column
await deleteColumn('column-id-123');
```

### Calendar (events)

```typescript
import { 
  getAllCalendarEvents, 
  getCalendarEventsByDate,
  createCalendarEvent,
  deleteCalendarEvent 
} from '@/db/helpers/calendar';

// All events
const events = await getAllCalendarEvents();

// Events by date (uses Dexie index - fast!)
const todayEvents = await getCalendarEventsByDate('2026-01-15');

// Create event
await createCalendarEvent({
  title: 'Meeting',
  date: '2026-01-15',
  startTime: '10:00',
  endTime: '11:00',
  color: '#4CAF50',
  repeatDays: [],
  repeatFrequency: null
});

// Delete event
await deleteCalendarEvent(123);
```

### Settings

```typescript
import { getSettings, updateSettings, getColumnsOrder } from '@/db/helpers/settings';

// Get settings
const settings = await getSettings();

// Update sync settings
await updateSettings({
  sync: {
    isSyncEnabled: true,
    syncServerUrl: 'https://...',
    syncSecretKey: 'abc123'
  }
});

// Update columns order (drag-and-drop)
await updateColumnsOrder(['col-1', 'col-2', 'col-3']);
```

### Backup & Clear

```typescript
import { exportData, importData } from '@/db/helpers/backup';
import { clearAllData } from '@/db/helpers/settings';

// Export all data
const backup = await exportData();
// { calendar: [...], settings: [...], columns: [...] }

// Import data
await importData(backup);

// Clear ALL data (reset)
await clearAllData();
```

## 🎯 DbResult<T>

All functions return `DbResult<T>`:

```typescript
type DbResult<T> = {
  success: boolean;
  data?: T;        // Data if success: true
  error?: string;  // Error message if success: false
}
```

**Example handling:**

```typescript
const result = await getAllColumns();

if (result.success) {
  // Success - use result.data
  console.log(result.data.length);
} else {
  // Error - show result.error
  console.error(result.error);
}
```

## 📦 Database Tables

| Table | Primary Key | Indexes | Description |
|---------|-------------|---------|------|
| `settings` | `id: 'global'` | — | Single row with app settings |
| `tableColumns` | `id: string` | — | Table columns |
| `calendar` | `id: number` | `date` | Calendar events (indexed for fast lookup) |

## 💡 Features

- ✅ **TypeScript** - full type safety
- ✅ **Transactions** - atomic operations (createColumn, deleteColumn)
- ✅ **Indexes** - fast date lookups
- ✅ **JSDoc** - documentation with examples
- ✅ **DbResult<T>** - consistent error handling
- ✅ **Auto-generated IDs** - crypto.randomUUID()
