# Database Layer

Browser IndexedDB layer built with Dexie.

## Structure

```text
db/
|- index.ts             # Dexie class and schema
|- types.ts             # DbResult<T>
|- constants.ts         # DEFAULT_SETTINGS
|- column.templates.ts  # Templates for new columns
|- helpers/
   |- columns.ts        # CRUD operations for table columns
   |- columnEntries.ts  # CRUD operations for day-based column values
   |- calendar.ts       # CRUD operations for calendar events
   |- settings.ts       # CRUD operations for settings and full local reset
```

## Tables

| Table | Primary Key | Indexes | Description |
| --- | --- | --- | --- |
| `settings` | `id` | - | Single global settings row |
| `tableColumns` | `id` | - | Column configuration and non-day column data |
| `columnEntries` | `id` | `columnId`, `dateKey`, `weekStart`, `[columnId+dateKey]` | Day-based column values |
| `calendar` | `id` | `date` | Calendar events |

All helpers return `DbResult<T>`:

```typescript
type DbResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
};
```
