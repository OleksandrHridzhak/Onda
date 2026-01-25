# Database Architecture (Onda)

## 1. Stack Overview

- **Engine:** IndexedDB (Browser-native)
- **Wrapper:** [Dexie.js](https://dexie.org/)
- **State Management Integration:** Functions are designed to be called from Redux Thunk or directly in UI components.

## 2. Table Schemas

| Table Name     | Primary Key | Indexes        | Description                                    |
| -------------- | ----------- | -------------- | ---------------------------------------------- |
| `tableColumns` | `id`        | `type`, `name` | Stores all user-created tracker columns.       |
| `settings`     | `id`        | (none)         | Global app state (e.g., column order, themes). |

## 3. Core Principles (Philosophy)

### A. Standardized Response (DbResult)

All mutation functions (Create, Update, Delete) must return a consistent object:

- `success`: boolean — indicating if the operation was successful.
- `data`: any (optional) — the result data (e.g., a new ID).
- `error`: string (optional) — a human-readable error message.

### B. Hybrid Update Pattern

To balance performance and DX (Developer Experience):

1. **Top-level fields:** Updated via partial objects (e.g., `{ name: "New Name" }`).
2. **Deeply nested fields:** Updated via **Dot Notation** (e.g., `{ "uniqueProps.checkboxColor": "blue" }`).
   _Benefit:_ Prevents accidental data loss in large nested objects like `uniqueProps`.

### C. Transactional Integrity

Operations that affect multiple tables (e.g., `createColumn` and `deleteColumn`) MUST be wrapped in a Dexie transaction. This prevents "orphan" IDs in the `columnsOrder` array.

## 4. Workflows

### Adding a New Column Type

1. Define the type string in `src/constants/columnTypes.ts`.
2. Add the literal string to `ColumnType` union.
3. Create a blueprint in `src/db/helpers/columnTemplates.ts`.

### Updating Nested Data

Always use `updateColumnFields(id, { 'uniqueProps.path': value })` instead of overwriting the whole `uniqueProps` object.
